import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeService } from "@/lib/stripe/service";

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

    const { reason } = await request.json();

    // Create Supabase admin client
    const supabase = createSupabaseAdmin();

    // Get account details to find Stripe subscription ID
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
      try {
        // Cancel Stripe subscription
        await stripeService.cancelSubscription(
          account.stripe_subscription_id,
          token.accountId
        );
      } catch (error) {
        console.error("Error cancelling Stripe subscription:", error);
        return NextResponse.json(
          { error: "Failed to cancel subscription" },
          { status: 500 }
        );
      }
    } else {
      // Fallback: just update database if no Stripe subscription
      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          subscription_status: "cancelled",
          subscription_end_date: new Date().toISOString(),
        })
        .eq("id", token.accountId);

      if (updateError) {
        console.error("Error cancelling subscription:", updateError);
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
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
