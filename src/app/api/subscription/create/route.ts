import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { subscriptionService } from "../service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, paymentMethodId } = await request.json();

    if (!planId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Plan ID and payment method are required" },
        { status: 400 }
      );
    }

    const result = await subscriptionService.createSubscription(
      session.user.accountId,
      planId,
      paymentMethodId
    );

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription: result.subscription,
      plan: result.plan,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
