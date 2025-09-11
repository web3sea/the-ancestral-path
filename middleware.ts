import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
    const subscriptionTier = token.subscriptionTier as string;
    const subscriptionStatus = token.subscriptionStatus as string;
    const userRole = token.role as string;

    // Admin users bypass subscription check
    if (userRole === "admin") {
      return NextResponse.next();
    }

    if (
      !subscriptionTier ||
      !subscriptionStatus ||
      !["tier1", "tier2"].includes(subscriptionTier) ||
      subscriptionStatus !== "active"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
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
