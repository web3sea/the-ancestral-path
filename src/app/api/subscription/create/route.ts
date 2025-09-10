import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { SUBSCRIPTION_PLANS } from "../plans/route";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { planId, paymentMethodId } = await request.json();

    if (!planId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Plan ID and payment method are required" },
        { status: 400 }
      );
    }

    // Validate plan exists
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabase = createSupabaseAdmin();

    // Create subscription record
    const { data: subscription, error } = await supabase
      .from("accounts")
      .update({
        subscription_tier: planId as SubscriptionTier,
        subscription_status: SubscriptionStatus.ACTIVE,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days
      })
      .eq("id", session.user.accountId)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    // Record subscription history
    const { error: historyError } = await supabase
      .from("subscription_history")
      .insert({
        account_id: session.user.accountId,
        tier: planId as SubscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: plan.price / 100,
        change_reason: "New subscription created",
        notes: `Subscribed to ${plan.name}`,
      });

    if (historyError) {
      console.error("Error recording subscription history:", historyError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription,
      plan,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
