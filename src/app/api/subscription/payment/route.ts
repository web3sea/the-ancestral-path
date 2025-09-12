import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { STRIPE_PLANS, StripePlanId } from "@/lib/stripe/config";
import { stripeService } from "@/lib/stripe/service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
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

    // Create Supabase admin client
    const supabase = createSupabaseAdmin();

    // Get account subscription details
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select(
        "subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id"
      )
      .eq("id", token.accountId)
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

    const plan = STRIPE_PLANS[account.subscription_tier as StripePlanId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // Simulate payment processing (replace with actual payment processor)
    const paymentSuccess = await stripeService.handleSuccessfulPayment(
      token.accountId,
      plan.price.toString()
    );

    if (paymentSuccess) {
      // Update subscription end date (extend by 30 days)
      const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Ensure stripe_customer_id is stored - get it from Stripe if missing
      let customerId = account.stripe_customer_id;

      if (!customerId && account.stripe_subscription_id) {
        try {
          const subscription = await stripe.subscriptions.retrieve(
            account.stripe_subscription_id
          );
          customerId = subscription.customer as string;
        } catch (error) {
          console.error("Error retrieving customer ID from Stripe:", error);
        }
      }

      if (!customerId) {
        try {
          const customer = await stripeService.createCustomer(
            token.email!,
            token.name || "",
            token.accountId
          );
          customerId = customer.id;
          console.log("Created new Stripe customer:", customerId);
        } catch (error) {
          console.error("Error creating Stripe customer:", error);
        }
      }

      const updateData: Record<string, string | null> = {
        subscription_end_date: newEndDate.toISOString(),
        stripe_customer_id: customerId,
      };

      const { error: updateError } = await supabase
        .from("accounts")
        .update(updateData)
        .eq("id", token.accountId);

      if (updateError) {
        console.error("Error updating subscription end date:", updateError);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }

      const { error: historyError } = await supabase
        .from("subscription_history")
        .insert({
          account_id: token.accountId,
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
      }

      return NextResponse.json({
        success: true,
        message: "Monthly payment processed successfully",
        nextBillingDate: newEndDate,
        customerId: customerId,
        customerIdUpdated: !!customerId && !account.stripe_customer_id,
      });
    } else {
      await handlePaymentFailure(token.accountId, supabase);
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

async function handlePaymentFailure(
  accountId: string,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.EXPIRED,
      })
      .eq("id", accountId);

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: SubscriptionTier.TIER1,
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
