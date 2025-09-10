import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";

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

    const { reason } = await request.json();

    // Create Supabase admin client
    const supabase = createSupabaseAdmin();

    // Update subscription status to cancelled
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.CANCELLED,
        subscription_end_date: new Date().toISOString(),
      })
      .eq("id", session.user.accountId);

    if (updateError) {
      console.error("Error cancelling subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    // Record cancellation history
    const { error: historyError } = await supabase
      .from("subscription_history")
      .insert({
        account_id: session.user.accountId,
        tier: SubscriptionTier.TIER1, // Will be updated with actual tier
        status: SubscriptionStatus.CANCELLED,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: 0,
        change_reason: "Subscription cancelled",
        notes: reason || "Cancelled by user",
      });

    if (historyError) {
      console.error("Error recording cancellation history:", historyError);
      // Don't fail the request, just log the error
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
