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

    const supabase = createSupabaseAdmin();

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
      return NextResponse.json(
        { error: "Failed to get subscription status" },
        { status: 500 }
      );
    }

    if (!account) {
      return NextResponse.json({
        success: true,
        hasSubscription: false,
        isActive: false,
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
        console.error("Error getting Stripe subscription status:", error);
      }
    }

    const isActive =
      account.subscription_status === SubscriptionStatus.ACTIVE &&
      (!account.subscription_end_date ||
        new Date(account.subscription_end_date) > new Date());

    return NextResponse.json({
      success: true,
      hasSubscription: true,
      isActive,
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
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
