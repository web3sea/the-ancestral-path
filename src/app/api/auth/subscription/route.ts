import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

// Update user subscription
export async function PUT(request: NextRequest) {
  try {
    const {
      email,
      subscriptionTier,
      subscriptionStatus,
      changeReason,
      notes,
      paymentMethod,
      amountPaid,
    } = await request.json();

    if (!email || !subscriptionTier || !subscriptionStatus) {
      return NextResponse.json(
        {
          error: "Email, subscriptionTier, and subscriptionStatus are required",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Get user account
    const { data: userData, error: userError } = await supabase
      .from("accounts")
      .select("id, subscription_tier, subscription_status")
      .eq("email", email)
      .is("deleted_at", null)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user subscription
    const { data: updatedUser, error: updateError } = await supabase
      .from("accounts")
      .update({
        subscription_tier: subscriptionTier,
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.id)
      .select(
        `
        id,
        name,
        email,
        subscription_tier,
        subscription_status,
        user_roles(name, permissions)
      `
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    // Add subscription history entry
    const { error: historyError } = await supabase
      .from("subscription_history")
      .insert({
        account_id: userData.id,
        tier: subscriptionTier,
        status: subscriptionStatus,
        start_date: new Date().toISOString(),
        payment_method: paymentMethod || "admin_updated",
        amount_paid: amountPaid || 0,
        change_reason: changeReason || "Subscription updated via API",
        notes: notes || "Subscription updated through admin API",
      });

    if (historyError) {
      console.error("Failed to add subscription history:", historyError);
      // Don't fail the request if history logging fails
    }

    // Handle the user_roles relationship properly
    const userRole = updatedUser.user_roles;
    const roleName =
      userRole && typeof userRole === "object" && "name" in userRole
        ? userRole.name
        : "user";
    const permissions =
      userRole && typeof userRole === "object" && "permissions" in userRole
        ? userRole.permissions
        : {};

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        subscriptionTier: updatedUser.subscription_tier,
        subscriptionStatus: updatedUser.subscription_status,
        role: roleName,
        permissions: permissions,
      },
      message: "Subscription updated successfully",
    });
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get subscription history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Get user account
    const { data: userData, error: userError } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", email)
      .is("deleted_at", null)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get subscription history
    const { data: history, error: historyError } = await supabase
      .from("subscription_history")
      .select("*")
      .eq("account_id", userData.id)
      .order("created_at", { ascending: false });

    if (historyError) {
      throw historyError;
    }

    return NextResponse.json({
      email,
      subscriptionHistory: history || [],
    });
  } catch (error) {
    console.error("Subscription history retrieval error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve subscription history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
