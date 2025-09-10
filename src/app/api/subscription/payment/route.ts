import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { SUBSCRIPTION_PLANS } from "../plans/route";

export async function POST() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create Supabase admin client
    const supabase = createSupabaseAdmin();

    // Get account subscription details
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("subscription_tier, subscription_status")
      .eq("id", session.user.accountId)
      .single();

    if (accountError) {
      console.error("Error getting account details:", accountError);
      return NextResponse.json(
        { error: "Failed to get account details" },
        { status: 500 }
      );
    }

    if (!account || account.subscription_status !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[account.subscription_tier];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Simulate payment processing (replace with actual payment processor)
    const paymentSuccess = await simulatePayment(
      session.user.accountId,
      plan.price
    );

    if (paymentSuccess) {
      // Update subscription end date (extend by 30 days)
      const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          subscription_end_date: newEndDate.toISOString(),
        })
        .eq("id", session.user.accountId);

      if (updateError) {
        console.error("Error updating subscription end date:", updateError);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }

      // Record payment history
      const { error: historyError } = await supabase
        .from("subscription_history")
        .insert({
          account_id: session.user.accountId,
          tier: account.subscription_tier as SubscriptionTier,
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date().toISOString(),
          payment_method: "stripe",
          amount_paid: plan.price / 100,
          change_reason: "Monthly payment processed",
          notes: `Monthly payment for ${plan.name}`,
        });

      if (historyError) {
        console.error("Error recording payment history:", historyError);
        // Don't fail the request, just log the error
      }

      return NextResponse.json({
        success: true,
        message: "Monthly payment processed successfully",
        nextBillingDate: newEndDate,
      });
    } else {
      // Payment failed
      await handlePaymentFailure(session.user.accountId, supabase);
      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing monthly payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

// Simulate payment processing (replace with actual payment processor)
async function simulatePayment(
  _accountId: string,
  _amount: number
): Promise<boolean> {
  // This is a placeholder - replace with actual payment processing
  // For example, using Stripe, PayPal, or other payment processors

  // Simulate 95% success rate
  return Math.random() > 0.05;
}

// Handle payment failure
async function handlePaymentFailure(
  accountId: string,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    // Update subscription status to failed
    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.EXPIRED,
      })
      .eq("id", accountId);

    // Record failure history
    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: SubscriptionTier.TIER1, // Will be updated with actual tier
      status: SubscriptionStatus.EXPIRED,
      start_date: new Date().toISOString(),
      payment_method: "stripe",
      amount_paid: 0,
      change_reason: "Payment failed",
      notes: "Monthly payment failed",
    });
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}
