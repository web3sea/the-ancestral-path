import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionStatus } from "@/@types/enum";
import { SUBSCRIPTION_PLANS } from "../plans/route";

export async function GET() {
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

    // Get subscription details
    const { data: account, error } = await supabase
      .from("accounts")
      .select(
        `
        subscription_tier,
        subscription_status,
        subscription_start_date,
        subscription_end_date
      `
      )
      .eq("id", session.user.accountId)
      .single();

    if (error) {
      console.error("Error getting subscription status:", error);
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
        plan: SUBSCRIPTION_PLANS[account.subscription_tier],
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
