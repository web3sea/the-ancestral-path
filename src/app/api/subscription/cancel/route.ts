import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeService } from "@/lib/stripe/service";
import { SubscriptionStatus } from "@/@types/enum";

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

    const supabase = createSupabaseAdmin();

    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("stripe_subscription_id")
      .eq("id", token.accountId)
      .single();

    if (accountError) {
      console.error("Error getting account details:", accountError);
      return NextResponse.json(
        { error: "Failed to get account details" },
        { status: 500 }
      );
    }

    if (account?.stripe_subscription_id) {
      // Check if it's actually a payment intent ID instead of subscription ID
      let subscriptionId = account.stripe_subscription_id;

      if (subscriptionId.startsWith("pi_")) {
        const foundSubscriptionId =
          await stripeService.findSubscriptionFromPaymentIntent(subscriptionId);

        if (foundSubscriptionId) {
          subscriptionId = foundSubscriptionId;
        } else {
          console.error(
            `🔍 CANCEL: Could not find subscription for payment intent: ${subscriptionId}`
          );
          return NextResponse.json(
            { error: "Could not find subscription for this payment intent" },
            { status: 400 }
          );
        }
      }

      try {
        await stripeService.cancelSubscription(subscriptionId, token.accountId);
      } catch (error) {
        console.error("Error cancelling Stripe subscription:", error);
        return NextResponse.json(
          { error: "Failed to cancel subscription" },
          { status: 500 }
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          subscription_status: SubscriptionStatus.CANCELLED,
          subscription_end_date: new Date().toISOString(),
        })
        .eq("id", token.accountId);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to cancel subscription" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel subscription: " + error },
      { status: 500 }
    );
  }
}
