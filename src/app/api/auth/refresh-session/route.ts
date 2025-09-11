import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus, Role } from "@/@types/enum";

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

    // Get the latest subscription data from the database
    const { data: account, error } = await supabase
      .from("accounts")
      .select(
        `
        id,
        email,
        subscription_tier,
        subscription_status,
        subscription_start_date,
        subscription_end_date,
        stripe_customer_id,
        stripe_subscription_id,
        last_subscription_update,
        role_id,
        user_roles(name, permissions)
      `
      )
      .eq("id", token.accountId)
      .single();

    if (error) {
      console.error("Error getting updated account data:", error);
      return NextResponse.json(
        { error: "Failed to get account data" },
        { status: 500 }
      );
    }

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Extract role information
    const userRole = account.user_roles;
    let role = Role.USER;
    if (userRole && typeof userRole === "object" && "name" in userRole) {
      role = userRole.name as Role;
    }

    // Return updated session data
    const updatedSessionData = {
      id: token.sub,
      email: account.email,
      role,
      subscriptionTier: account.subscription_tier as SubscriptionTier,
      subscriptionStatus: account.subscription_status as SubscriptionStatus,
      subscriptionStartDate: account.subscription_start_date,
      subscriptionEndDate: account.subscription_end_date,
      stripeCustomerId: account.stripe_customer_id,
      stripeSubscriptionId: account.stripe_subscription_id,
      lastSubscriptionUpdate: account.last_subscription_update,
      accountId: account.id,
    };

    return NextResponse.json({
      success: true,
      session: updatedSessionData,
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
