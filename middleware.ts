import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Simplified middleware - only handle admin routes
  // All other authentication and subscription validation is handled by guards

  // Remove subscription validation from middleware
  // Let the SubscriptionGuard handle subscription validation instead

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
