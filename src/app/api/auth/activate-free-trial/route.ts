import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Logger } from "@/lib/utils/log";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import {
  EmailCampaignStatus,
  SubscriptionStatus,
  SubscriptionTier,
} from "@/@types/enum";
import { getAppConfig } from "@/lib/config/env";
import { brevoMoveEmailBetweenLists } from "@/lib/brevo/ultils";

const loggerContext = "ActivateFreeTrial";
const PAID_TRIAL_DAYS = 7;
const REMINDER_TO_PAID_SUBSCRIPTION_LIST_ID =
  getAppConfig().brevo.list_upgraded_to_paid_id;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { code } = await request.json();
    const email = session.user.email;

    const account = await getUserAccount(email);
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (await hasUsedFreeTrial(account.id)) {
      return NextResponse.json({
        success: true,
        message: "You have already used your free trial",
        alreadyUsed: true,
      });
    }

    if (
      account.subscription_status === "active" &&
      account.subscription_tier !== SubscriptionTier.FREE_TRIAL
    ) {
      return NextResponse.json({
        success: true,
        message: "You already have an active subscription",
        hasSubscription: true,
      });
    }

    const trialEndDate = await activateFreeTrial(account.id, email, code);

    return NextResponse.json({
      success: true,
      message: `Congratulations! You have activated a 7-day free trial with refer code: ${code}`,
      trialEndDate: trialEndDate.toISOString(),
      code,
    });
  } catch (error: any) {
    Logger.error(
      `Error activating free trial: ${error.message}`,
      loggerContext
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getUserAccount(email: string) {
  const supabase = createSupabaseAdmin();
  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !account) {
    Logger.error("Account not found", loggerContext);
    return null;
  }

  return account;
}

async function hasUsedFreeTrial(accountId: string) {
  const supabase = createSupabaseAdmin();
  const { data: account } = await supabase
    .from("accounts")
    .select("free_trial_used")
    .eq("id", accountId)
    .single();

  return account?.free_trial_used === true;
}

async function activateFreeTrial(
  accountId: string,
  email: string,
  code: string
) {
  const supabase = createSupabaseAdmin();
  const startDate = new Date();
  const trialEndDate = new Date(startDate);
  trialEndDate.setDate(trialEndDate.getDate() + PAID_TRIAL_DAYS);

  try {
    Logger.log(
      `Updating account ${accountId} with free trial info`,
      loggerContext
    );
    await supabase
      .from("accounts")
      .update({
        subscription_tier: SubscriptionTier.FREE_TRIAL,
        subscription_status: SubscriptionStatus.ACTIVE,
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: trialEndDate.toISOString(),
        free_trial_used: true,
        free_trial_used_date: startDate.toISOString(),
        last_subscription_update: startDate.toISOString(),
      })
      .eq("id", accountId);

    Logger.log(
      `Creating subscription history for account ${accountId}`,
      loggerContext
    );
    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: SubscriptionTier.FREE_TRIAL,
      status: SubscriptionStatus.ACTIVE,
      start_date: startDate.toISOString(),
      end_date: trialEndDate.toISOString(),
      payment_method: "free_trial",
      amount_paid: 0,
      currency: "USD",
      change_reason: "Free trial activated",
      notes: `Free trial activated with refer code: ${code || "none"}`,
    });

    Logger.log(
      `Updating email campaign for account ${accountId}`,
      loggerContext
    );
    const { data: emailCampaign } = await supabase
      .from("user_email_campaign")
      .select("*")
      .eq("email", email)
      .single();

    if (emailCampaign) {
      Logger.log(
        `Updating email campaign for account ${accountId}`,
        loggerContext
      );
      await supabase
        .from("user_email_campaign")
        .update({
          status: EmailCampaignStatus.FREE_TRIAL,
          trial_started_at: startDate.toISOString(),
          updated_at: startDate.toISOString(),
          meta: {
            ...emailCampaign.meta,
            refer_code: code || null,
            trial_activated_at: startDate.toISOString(),
          },
        })
        .eq("id", emailCampaign.id);
    }

    await brevoMoveEmailBetweenLists(
      email,
      getAppConfig().brevo.list_free_trial_id,
      REMINDER_TO_PAID_SUBSCRIPTION_LIST_ID
    );
  } catch (error: any) {
    Logger.error(
      `Error activating free trial: ${error?.message}`,
      loggerContext
    );
  }
  Logger.log(
    `Free trial activated successfully for account ${accountId}`,
    loggerContext
  );
  return trialEndDate;
}
