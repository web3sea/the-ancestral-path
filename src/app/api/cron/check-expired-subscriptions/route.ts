import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionService } from "@/lib/supabase/subscription";
import { SubscriptionStatus, SubscriptionTier } from "@/@types/enum";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Fetch expiring subscriptions excluding admin users
    const { data: expiringSubscriptions, error } = await supabase
      .from("accounts")
      .select(
        "id, subscription_tier, subscription_status, subscription_end_date, stripe_subscription_id, role_id, user_roles!inner(name)"
      )
      .in("subscription_status", [SubscriptionStatus.ACTIVE])
      .not("stripe_subscription_id", "is", null)
      .lte("subscription_end_date", threeDaysFromNow.toISOString())
      .eq("user_roles.name", "user");

    if (error) {
      console.error("Error fetching expiring subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!expiringSubscriptions || expiringSubscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expiring subscriptions found",
        processed: 0,
      });
    }

    let processed = 0;
    let renewed = 0;
    let expired = 0;

    // Helper function to update user role based on subscription tier
    const updateUserRole = async (
      accountId: string,
      subscriptionTier: SubscriptionTier
    ) => {
      try {
        let roleName = "user"; // Default role

        if (subscriptionTier === SubscriptionTier.TIER1) {
          roleName = "user";
        } else if (subscriptionTier === SubscriptionTier.TIER2) {
          roleName = "premium_user";
        }

        // Get the role ID for the target role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("id")
          .eq("name", roleName)
          .single();

        if (roleError || !roleData) {
          console.error(`Error finding role ${roleName}:`, roleError);
          return;
        }

        // Update the user's role
        const { error: updateError } = await supabase
          .from("accounts")
          .update({ role_id: roleData.id })
          .eq("id", accountId);

        if (updateError) {
          console.error(
            `Error updating role for account ${accountId}:`,
            updateError
          );
        } else {
          console.log(`Updated role to ${roleName} for account ${accountId}`);
        }
      } catch (error) {
        console.error(
          `Error updating user role for account ${accountId}:`,
          error
        );
      }
    };

    for (const account of expiringSubscriptions) {
      try {
        if (!account.stripe_subscription_id) {
          console.log(
            `Account ${account.id} has no Stripe subscription ID, skipping`
          );
          continue;
        }

        const stripeSubscription = (await stripe.subscriptions.retrieve(
          account.stripe_subscription_id
        )) as unknown as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        };

        if (stripeSubscription.status === "active") {
          await subscriptionService.updateSubscriptionData(
            account.id,
            account.subscription_tier as SubscriptionTier,
            SubscriptionStatus.ACTIVE,
            stripeSubscription.customer as string,
            stripeSubscription.id,
            new Date(
              stripeSubscription.current_period_start * 1000
            ).toISOString(),
            new Date(stripeSubscription.current_period_end * 1000).toISOString()
          );

          await supabase.from("subscription_history").insert({
            account_id: account.id,
            tier: account.subscription_tier as SubscriptionTier,
            status: SubscriptionStatus.ACTIVE,
            start_date: new Date(
              stripeSubscription.current_period_start * 1000
            ).toISOString(),
            end_date: new Date(
              stripeSubscription.current_period_end * 1000
            ).toISOString(),
            payment_method: "stripe",
            amount_paid: 0,
            change_reason: "Automatic renewal check - subscription active",
            notes: "Subscription automatically renewed via cron job",
          });

          // Update user role based on subscription tier
          await updateUserRole(
            account.id,
            account.subscription_tier as SubscriptionTier
          );

          renewed++;
          console.log(`Renewed subscription for account ${account.id}`);
        } else if (stripeSubscription.status === "past_due") {
          const subscriptionEndDate = account.subscription_end_date
            ? new Date(account.subscription_end_date)
            : new Date();
          const gracePeriodDays = 7;
          const gracePeriodEnd = new Date(
            subscriptionEndDate.getTime() +
              gracePeriodDays * 24 * 60 * 60 * 1000
          );
          const now = new Date();

          if (now > gracePeriodEnd) {
            await subscriptionService.updateSubscriptionData(
              account.id,
              account.subscription_tier as SubscriptionTier,
              SubscriptionStatus.EXPIRED,
              stripeSubscription.customer as string,
              stripeSubscription.id,
              undefined,
              new Date().toISOString()
            );

            await supabase.from("subscription_history").insert({
              account_id: account.id,
              tier: account.subscription_tier as SubscriptionTier,
              status: SubscriptionStatus.EXPIRED,
              start_date: new Date().toISOString(),
              end_date: new Date().toISOString(),
              payment_method: "stripe",
              amount_paid: 0,
              change_reason: "Grace period expired - subscription suspended",
              notes: "Subscription expired after grace period via cron job",
            });

            expired++;
            console.log(
              `Expired subscription for account ${account.id} - grace period expired`
            );
          } else {
            console.log(
              `Account ${
                account.id
              } still in grace period until ${gracePeriodEnd.toISOString()}`
            );
          }
        } else if (
          stripeSubscription.status === "canceled" ||
          stripeSubscription.status === "unpaid"
        ) {
          await subscriptionService.updateSubscriptionData(
            account.id,
            account.subscription_tier as SubscriptionTier,
            SubscriptionStatus.EXPIRED,
            stripeSubscription.customer as string,
            stripeSubscription.id,
            undefined,
            new Date().toISOString()
          );

          await supabase.from("subscription_history").insert({
            account_id: account.id,
            tier: account.subscription_tier as SubscriptionTier,
            status: SubscriptionStatus.EXPIRED,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            payment_method: "stripe",
            amount_paid: 0,
            change_reason: "Subscription canceled or unpaid",
            notes: `Subscription ${stripeSubscription.status} via cron job`,
          });

          // Update user role to "user" when subscription expires
          await updateUserRole(account.id, SubscriptionTier.TIER1); // TIER1 maps to "user" role

          expired++;
          console.log(
            `Expired subscription for account ${account.id} - status: ${stripeSubscription.status}`
          );
        }

        processed++;
      } catch (error) {
        console.error(
          `Error processing subscription for account ${account.id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscription check completed",
      processed,
      renewed,
      expired,
    });
  } catch (error) {
    console.error("Error in subscription check cron job:", error);
    return NextResponse.json(
      {
        error: "Failed to check subscriptions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
