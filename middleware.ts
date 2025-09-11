import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Debug logging for admin routes
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

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        "/login?next=" + encodeURIComponent(request.nextUrl.pathname),
        request.url
      )
    );
  }

  // Check if user needs to complete subscription setup
  if (
    token &&
    !isPublicRoute &&
    !request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/"
  ) {
    const userRole = token.role as string;

    // Admin users bypass subscription check
    if (userRole === "admin") {
      return NextResponse.next();
    }

    // Check subscription status from token first (faster)
    const subscriptionTier = token.subscriptionTier as string;
    const subscriptionStatus = token.subscriptionStatus as string;

    // If token has subscription data, use it (faster)
    if (subscriptionTier && subscriptionStatus) {
      if (
        ![SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
          subscriptionTier as SubscriptionTier
        ) ||
        subscriptionStatus !== SubscriptionStatus.ACTIVE
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // Fallback to database query only if token doesn't have subscription data
      try {
        const supabase = createSupabaseAdmin();
        const { data: account, error } = await supabase
          .from("accounts")
          .select("subscription_tier, subscription_status")
          .eq("id", token.accountId)
          .single();

        if (error || !account) {
          console.error("Error checking subscription in middleware:", error);
          return NextResponse.redirect(new URL("/", request.url));
        }

        const dbSubscriptionTier = account.subscription_tier;
        const dbSubscriptionStatus = account.subscription_status;

        if (
          !dbSubscriptionTier ||
          !dbSubscriptionStatus ||
          ![SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
            dbSubscriptionTier as SubscriptionTier
          ) ||
          dbSubscriptionStatus !== SubscriptionStatus.ACTIVE
        ) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.error("Error in middleware subscription check:", error);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/(user)/:path*",
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
    "/",
  ],
};
