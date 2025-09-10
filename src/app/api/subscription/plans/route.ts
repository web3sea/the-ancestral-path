import { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "../service";

export async function GET(request: NextRequest) {
  try {
    const plans = subscriptionService.getAvailablePlans();

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
