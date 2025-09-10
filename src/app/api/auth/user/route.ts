import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus, Role } from "@/@types/enum";

// Create or update user account
export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      phone,
      authProviderId,
      subscriptionTier = SubscriptionTier.TIER1,
      subscriptionStatus = SubscriptionStatus.ACTIVE,
      role = Role.USER,
      preferredPlatform = "web",
    } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

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

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", email)
      .is("deleted_at", null)
      .single();

    let accountId: string;

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("accounts")
        .update({
          name,
          phone,
          auth_provider_id: authProviderId,
          subscription_tier: subscriptionTier,
          subscription_status: subscriptionStatus,
          role_id: roleData.id,
          preferred_platform: preferredPlatform,
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      accountId = data.id;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("accounts")
        .insert({
          name,
          email,
          phone,
          auth_provider: "google",
          auth_provider_id: authProviderId,
          subscription_tier: subscriptionTier,
          subscription_status: subscriptionStatus,
          role_id: roleData.id,
          preferred_platform: preferredPlatform,
          last_active_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      accountId = data.id;

      // Create default preferences for new user
      await supabase.from("user_preferences").insert({ account_id: accountId });

      // Add subscription history entry
      await supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: subscriptionTier,
        status: subscriptionStatus,
        start_date: new Date().toISOString(),
        payment_method: "admin_created",
        amount_paid: 0,
        change_reason: "Account created via API",
        notes: "User account created through admin API",
      });
    }

    // Get the complete user data
    const { data: userData, error: userError } = await supabase
      .from("accounts")
      .select(
        `
        id,
        name,
        email,
        phone,
        subscription_tier,
        subscription_status,
        role_id,
        preferred_platform,
        profile_completed,
        onboarding_completed,
        last_active_at,
        created_at,
        updated_at,
        user_roles(name, permissions)
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
        phone: userData.phone,
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
      message: existingUser
        ? "User updated successfully"
        : "User created successfully",
    });
  } catch (error) {
    console.error("User creation/update error:", error);
    return NextResponse.json(
      {
        error: "Failed to create/update user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get user by email
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

    const { data: userData, error } = await supabase
      .from("accounts")
      .select(
        `
        id,
        name,
        email,
        phone,
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
      .eq("email", email)
      .is("deleted_at", null)
      .single();

    if (error || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
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
    });
  } catch (error) {
    console.error("User retrieval error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
