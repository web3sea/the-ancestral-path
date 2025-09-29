import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeService } from "@/lib/stripe/service";
import { STRIPE_PLANS } from "@/lib/stripe/config";
import { SubscriptionStatus } from "@/@types/enum";

export async function GET(request: NextRequest) {
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

    let supabase;
    try {
      supabase = createSupabaseAdmin();
    } catch (error) {
      // Return a mock response for development when database is not configured
      return NextResponse.json({
        success: true,
        hasSubscription: false,
        isActive: false,
        subscription: null,
        details: null,
        _mock: true,
        _message: "Database not configured - using mock response",
      });
    }

    const { data: account, error } = await supabase
      .from("accounts")
      .select(
        `
        subscription_tier,
        subscription_status,
        subscription_start_date,
        subscription_end_date,
        stripe_customer_id,
        stripe_subscription_id
      `
      )
      .eq("id", token.accountId)
      .single();

    if (error) {
      // Handle case where account doesn't exist in database
      if (error.code === "PGRST116" && error.message.includes("0 rows")) {
        return NextResponse.json({
          success: true,
          hasSubscription: false,
          isActive: false,
          subscription: null,
          details: null,
          _message: "Account not found in database",
        });
      }

      return NextResponse.json(
        { error: "Failed to get subscription status", details: error.message },
        { status: 500 }
      );
    }

    if (!account) {
      return NextResponse.json({
        success: true,
        hasSubscription: false,
        isActive: false,
        subscription: null,
        details: null,
      });
    }

    let stripeSubscription = null;
    if (account.stripe_customer_id) {
      try {
        const stripeStatus = await stripeService.getSubscriptionStatus(
          account.stripe_customer_id
        );
        stripeSubscription = stripeStatus.subscription;
      } catch (error) {
        // Continue without Stripe data - don't fail the entire request
      }
    }

    // Check if subscription is active based on database status
    const now = new Date();
    const endDate = account.subscription_end_date
      ? new Date(account.subscription_end_date)
      : null;
    const isEndDateValid = !endDate || endDate > now;

    const dbIsActive =
      (account.subscription_status === SubscriptionStatus.ACTIVE ||
        account.subscription_status === SubscriptionStatus.CANCELLED) &&
      isEndDateValid;

    // Check if Stripe subscription exists and is in a valid state
    const stripeIsActive =
      stripeSubscription &&
      (stripeSubscription.status === "active" ||
        stripeSubscription.status === "incomplete" ||
        stripeSubscription.status === "trialing");

    // Consider subscription active if either database or Stripe indicates active status
    const isActive = dbIsActive || stripeIsActive;

    return NextResponse.json({
      success: true,
      hasSubscription: true,
      isActive,
      subscription: {
        subscription_tier: account.subscription_tier,
        subscription_status: account.subscription_status,
        subscription_start_date: account.subscription_start_date,
        subscription_end_date: account.subscription_end_date,
        stripe_subscription_id: account.stripe_subscription_id,
        stripe_customer_id: account.stripe_customer_id,
      },
      details: {
        tier: account.subscription_tier,
        status: account.subscription_status,
        startDate: account.subscription_start_date,
        endDate: account.subscription_end_date,
        plan: STRIPE_PLANS[
          account.subscription_tier as keyof typeof STRIPE_PLANS
        ],
        stripeSubscription,
      },
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return NextResponse.json(
      {
        error: "Failed to get subscription status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
