import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { STRIPE_PLANS } from "@/lib/stripe/config";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all available plans
    const plans = Object.values(STRIPE_PLANS);

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to get subscription plans" },
      { status: 500 }
    );
  }
}
