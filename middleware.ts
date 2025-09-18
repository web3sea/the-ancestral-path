import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login?next=" + encodeURIComponent(request.nextUrl.pathname),
          request.url
        )
      );
    }

    const userRole = token.role as string;

    if (userRole !== "admin") {
      return NextResponse.redirect(
        new URL("/login?error=admin_access_required", request.url)
      );
    }
  }

  const publicRoutes = ["/", "/login", "/register", "/pricing", "/about"];
  const loggedInUserRoutes = [
    "/subscription",
    "/subscription/settings",
    "/settings",
  ];
  // Routes that require subscription (all content routes except subscription)
  const subscriptionRequiredRoutes = [
    "/abj-recordings",
    "/astrology",
    "/breathwork",
    "/challenges",
    "/group-workshops",
    "/meditations",
    "/oracle",
    "/products",
    "/retreats",
    "/wisdom",
    "/resources",
  ];

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isLoggedInUserRoute = loggedInUserRoutes.includes(
    request.nextUrl.pathname
  );
  const isSubscriptionRequiredRoute = subscriptionRequiredRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (
    token &&
    isSubscriptionRequiredRoute &&
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    const userRole = token.role as string;

    if (userRole === "admin") {
      return NextResponse.next();
    }

    const subscriptionTier = token.subscriptionTier as string;
    const subscriptionStatus = token.subscriptionStatus as string;

    if (subscriptionTier && subscriptionStatus) {
      const hasValidTierAndStatus =
        [SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
          subscriptionTier as SubscriptionTier
        ) &&
        (subscriptionStatus === SubscriptionStatus.ACTIVE ||
          subscriptionStatus === SubscriptionStatus.CANCELLED);

      if (!hasValidTierAndStatus) {
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    } else {
      try {
        const supabase = createSupabaseAdmin();
        const { data: account, error } = await supabase
          .from("accounts")
          .select(
            "subscription_tier, subscription_status, subscription_end_date"
          )
          .eq("id", token.accountId)
          .single();

        if (error || !account) {
          return NextResponse.redirect(new URL("/pricing", request.url));
        }

        const dbSubscriptionTier = account.subscription_tier;
        const dbSubscriptionStatus = account.subscription_status;
        const dbSubscriptionEndDate = account.subscription_end_date;

        const hasValidTierAndStatus =
          dbSubscriptionTier &&
          dbSubscriptionStatus &&
          [SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
            dbSubscriptionTier as SubscriptionTier
          ) &&
          (dbSubscriptionStatus === SubscriptionStatus.ACTIVE ||
            dbSubscriptionStatus === SubscriptionStatus.CANCELLED);

        if (!hasValidTierAndStatus) {
          return NextResponse.redirect(new URL("/pricing", request.url));
        }

        if (dbSubscriptionEndDate) {
          const endDate = new Date(dbSubscriptionEndDate);
          const now = new Date();

          // If subscription end date has passed, redirect to pricing
          if (now > endDate) {
            return NextResponse.redirect(new URL("/pricing", request.url));
          } else {
            console.log(
              `🔍 MIDDLEWARE: DB check - Subscription still valid until: ${endDate.toISOString()}, allowing access to ${
                request.nextUrl.pathname
              }`
            );
          }
        }
      } catch (error) {
        console.error("Error in middleware subscription check:", error);
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    }
  }

  console.log(
    `🔍 MIDDLEWARE: Allowing request to proceed to ${request.nextUrl.pathname}`
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/(user)/:path*",
    "/subscription/:path*",
    "/settings/:path*",
    "/oracle/:path*",
    "/breathwork/:path*",
    "/meditations/:path*",
    "/wisdom/:path*",
    "/astrology/:path*",
    "/challenges/:path*",
    "/abj-recordings/:path*",
    "/group-workshops/:path*",
    "/resources/:path*",
    "/retreats/:path*",
    "/products/:path*",
    "/login",
    "/register",
    "/pricing",
    "/about",
    "/",
  ],
};
