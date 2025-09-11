import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { stripeService } from "@/lib/stripe/service";
import { STRIPE_PLANS } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub || !token?.accountId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    try {
      let customerId = token.stripeCustomerId as string;

      if (!customerId) {
        const customer = await stripeService.createCustomer(
          token.email!,
          token.name || "",
          token.accountId
        );
        customerId = customer.id;
      }

      const result = await stripeService.createSubscription({
        customerId,
        planId: planId as keyof typeof STRIPE_PLANS,
        accountId: token.accountId,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to create subscription" },
          { status: 500 }
        );
      }

      if (!result.clientSecret) {
        return NextResponse.json(
          { error: "Payment intent not created properly" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Subscription created successfully",
        clientSecret: result.clientSecret,
        subscription: result.subscription,
        plan,
      });
    } catch (error) {
      console.error("Error creating Stripe subscription:", error);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
