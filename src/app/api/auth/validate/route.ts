import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // Get user account with subscription details
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select(
        `
        id,
        name,
        email,
        subscription_tier,
        subscription_status,
        role_id,
        profile_completed,
        onboarding_completed,
        user_roles(name, permissions)
      `
      )
      .eq("email", email)
      .is("deleted_at", null)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        {
          error: "User not found",
          valid: false,
        },
        { status: 404 }
      );
    }

    // Check if user has valid subscription (including cancelled subscriptions)
    const hasValidSubscription =
      [SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
        account.subscription_tier as SubscriptionTier
      ) &&
      (account.subscription_status === SubscriptionStatus.ACTIVE ||
        account.subscription_status === SubscriptionStatus.CANCELLED);

    // Get user profile if exists
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("account_id", account.id)
      .single();

    // Get user preferences if exist
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("account_id", account.id)
      .single();

    // Handle the user_roles relationship properly
    const userRole = account.user_roles;
    const roleName =
      userRole && typeof userRole === "object" && "name" in userRole
        ? userRole.name
        : "user";
    const permissions =
      userRole && typeof userRole === "object" && "permissions" in userRole
        ? userRole.permissions
        : {};

    return NextResponse.json({
      valid: hasValidSubscription,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        subscriptionTier: account.subscription_tier,
        subscriptionStatus: account.subscription_status,
        role: roleName,
        permissions: permissions,
        profileCompleted: !!profile,
        onboardingCompleted: account.onboarding_completed || false,
        profile: profile || null,
        preferences: preferences || null,
      },
      subscription: {
        tier: account.subscription_tier,
        status: account.subscription_status,
        valid: hasValidSubscription,
      },
    });
  } catch (error) {
    console.error("Auth validation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        valid: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  // Use POST logic for GET request
  const postRequest = new NextRequest(request.url, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return POST(postRequest);
}
