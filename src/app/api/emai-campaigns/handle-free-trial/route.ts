import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Logger } from "@/lib/utils/log";
import { NextResponse } from "next/server";

const loggerContext = "EmailCampaignsHandleFreeTrial";

export async function POST(request: Request) {
  try {
    const { user_id, code } = await request.json();
    Logger.log(
      `Handling free trial for user: ${user_id} with code: ${code}`,
      loggerContext
    );

    if (!user_id) {
      Logger.error("User ID is required", loggerContext);
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    Logger.log(`Getting user account: ${user_id}`, loggerContext);
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", user_id)
      .single();

    if (accountError || !account) {
      Logger.error("Account not found", loggerContext);
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    Logger.log("Updating account with trial information", loggerContext);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 days trial

    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        trial_end_date: trialEndDate.toISOString(),
        subscription_tier: "tier1",
        subscription_status: "active",
        last_subscription_update: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (updateError) {
      Logger.error("Error updating account:", updateError.message);
      return NextResponse.json(
        { error: "Failed to update account" },
        { status: 500 }
      );
    }

    Logger.log("Updating user_email_campaign status if exists", loggerContext);
    const { data: emailCampaign, error: campaignError } = await supabase
      .from("user_email_campaign")
      .select("*")
      .eq("email", account.email)
      .single();

    if (!campaignError && emailCampaign) {
      Logger.log("Updating campaign status to free_trial", loggerContext);
      const { error: campaignUpdateError } = await supabase
        .from("user_email_campaign")
        .update({
          status: "freetrial",
          trial_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          meta: {
            ...emailCampaign.meta,
            refer_code: code || null,
            trial_activated_at: new Date().toISOString(),
          },
        })
        .eq("id", emailCampaign.id);

      if (campaignUpdateError) {
        Logger.error(
          "Error updating email campaign:",
          campaignUpdateError.message
        );
        // Don't fail the entire request if campaign update fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Free trial activated successfully",
      trialEndDate: trialEndDate.toISOString(),
      code,
    });
  } catch (error: any) {
    Logger.error("Error handling free trial:", error.message);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
