import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus, Role } from "@/@types/enum";

// Create user account from OAuth profile
export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      authProviderId,
      subscriptionTier = SubscriptionTier.TIER1,
      subscriptionStatus = SubscriptionStatus.ACTIVE,
      role = Role.USER,
    } = await request.json();

    if (!email || !name || !authProviderId) {
      return NextResponse.json(
        { error: "Email, name, and authProviderId are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", email)
      .eq("deleted_at", null)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("accounts")
      .insert({
        name,
        email,
        auth_provider: "google",
        auth_provider_id: authProviderId,
        subscription_tier: subscriptionTier,
        subscription_status: subscriptionStatus,
        role_id: roleData.id,
        preferred_platform: "web",
        last_active_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError) {
      throw createError;
    }

    const accountId = newUser.id;

    // Create default preferences for new user
    await supabase.from("user_preferences").insert({ account_id: accountId });

    // Add subscription history entry
    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: subscriptionTier,
      status: subscriptionStatus,
      start_date: new Date().toISOString(),
      payment_method: "oauth_created",
      amount_paid: 0,
      change_reason: "Account created via OAuth",
      notes: "User account created through Google OAuth",
    });

    // Get the complete user data
    const { data: userData, error: userError } = await supabase
      .from("accounts")
      .select(
        `
        id,
        name,
        email,
        subscription_tier,
        subscription_status,
        role_id,
        preferred_platform,
        profile_completed,
        onboarding_completed,
        last_active_at,
        created_at,
        updated_at,
        user_roles!inner(name, permissions)
      `
      )
      .eq("id", accountId)
      .single();

    if (userError) {
      throw userError;
    }

    // Handle the user_roles relationship properly
    const userRole = userData.user_roles;
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
        id: userData.id,
        name: userData.name,
        email: userData.email,
        subscriptionTier: userData.subscription_tier,
        subscriptionStatus: userData.subscription_status,
        role: roleName,
        permissions: permissions,
        preferredPlatform: userData.preferred_platform,
        profileCompleted: userData.profile_completed,
        onboardingCompleted: userData.onboarding_completed,
        lastActiveAt: userData.last_active_at,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
