import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { Logger } from "@/lib/utils/log";

const loggerContext = "ProcessReferCode";

export async function POST(request: Request) {
  try {
    const { referCode } = await request.json();
    Logger.log(`Processing referCode: ${referCode}`, loggerContext);

    if (!referCode) {
      Logger.error("ReferCode is required", loggerContext);
      return NextResponse.json(
        { error: "ReferCode is required" },
        { status: 400 }
      );
    }

    // Get current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      Logger.error("User not authenticated", loggerContext);
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    Logger.log(`User authenticated: ${session.user.email}`, loggerContext);
    const supabase = createSupabaseAdmin();

    // Get user account
    Logger.log(
      `Getting account for email: ${session.user.email}`,
      loggerContext
    );
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("email", session.user.email)
      .is("deleted_at", null)
      .single();

    if (accountError || !account) {
      Logger.error(
        `Account not found: ${accountError?.message}`,
        loggerContext
      );
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    Logger.log(`Account found: ${account.id}`, loggerContext);

    // Check if user already has a subscription
    Logger.log(
      `Current subscription status: ${account.subscription_status}, tier: ${account.subscription_tier}`,
      loggerContext
    );
    if (account.subscription_status === "active" || account.subscription_tier) {
      Logger.log("User already has an active subscription", loggerContext);
      return NextResponse.json(
        {
          error: "User already has an active subscription",
          hasSubscription: true,
        },
        { status: 400 }
      );
    }

    // Check if user already used a referCode (prevent multiple uses)
    // Check if user has any subscription tier or active status
    if (account.subscription_tier || account.subscription_status === "active") {
      Logger.log(
        "User already used a trial or has subscription",
        loggerContext
      );
      return NextResponse.json(
        {
          error: "User already used a trial or has subscription",
          alreadyUsedTrial: true,
        },
        { status: 400 }
      );
    }

    // Update account with trial information
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial

    Logger.log(
      `Updating account with trial info. Start: ${trialStartDate.toISOString()}, End: ${trialEndDate.toISOString()}`,
      loggerContext
    );

    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        subscription_tier: "tier1", // Use valid tier value
        subscription_status: "active", // Use valid status value
        subscription_start_date: trialStartDate.toISOString(),
        subscription_end_date: trialEndDate.toISOString(),
        last_subscription_update: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (updateError) {
      Logger.error(
        `Error updating account: ${updateError.message}`,
        loggerContext
      );
      Logger.error(
        `Update error details: ${JSON.stringify(updateError)}`,
        loggerContext
      );
      return NextResponse.json(
        { error: "Failed to update account", details: updateError.message },
        { status: 500 }
      );
    }

    Logger.log("Account updated successfully", loggerContext);

    // Update user_email_campaign status if exists
    const { data: emailCampaign, error: campaignError } = await supabase
      .from("user_email_campaign")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!campaignError && emailCampaign) {
      // Update campaign status to free_trial
      Logger.log("Updating email campaign status", loggerContext);
      await supabase
        .from("user_email_campaign")
        .update({
          status: "freetrial", // Use consistent status value
          trial_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          meta: {
            ...emailCampaign.meta,
            refer_code: referCode,
            trial_activated_at: new Date().toISOString(),
            is_trial: true, // Mark as trial in metadata
            trial_type: "refer_code", // Track trial type
          },
        })
        .eq("id", emailCampaign.id);
    } else {
      Logger.log("No email campaign found for user", loggerContext);
    }

    Logger.log("ReferCode processed successfully", loggerContext);
    return NextResponse.json({
      success: true,
      message: "Free trial activated successfully",
      trialStartDate: trialStartDate.toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      subscriptionTier: "tier1",
      subscriptionStatus: "active",
      referCode,
      isTrial: true,
    });
  } catch (error: any) {
    console.error("Error processing refer code:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
