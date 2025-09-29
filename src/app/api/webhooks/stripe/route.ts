import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionService } from "@/lib/supabase/subscription";
import {
  SubscriptionStatus,
  SubscriptionTier,
  EmailCampaignStatus,
} from "@/@types/enum";
import Stripe from "stripe";

async function triggerSessionRefresh(accountId: string) {
  try {
    const supabase = createSupabaseAdmin();
    await supabase
      .from("accounts")
      .update({
        last_subscription_update: new Date().toISOString(),
      })
      .eq("id", accountId);
  } catch (error) {
    console.error("Error triggering session refresh:", error);
  }
}

// Mark user_email_campaign as upgraded (DONE) for a given email
async function markEmailCampaignAsUpgradedByEmail(email: string) {
  try {
    if (!email) return;
    const supabase = createSupabaseAdmin();
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from("user_email_campaign")
      .select("id,status")
      .eq("email", email);
    if (!existing || existing.length === 0) return;

    await supabase
      .from("user_email_campaign")
      .update({
        status: EmailCampaignStatus.DONE,
        upgraded_at: now,
        updated_at: now,
      })
      .eq("email", email);
  } catch (error) {
    console.error("Error marking email campaign as upgraded:", error);
  }
}

// Helper function to update user role based on subscription tier
async function updateUserRole(
  accountId: string,
  subscriptionTier: SubscriptionTier
) {
  try {
    const supabase = createSupabaseAdmin();
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
    }
  } catch (error) {
    console.error(`Error updating user role for account ${accountId}:`, error);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    const accountId = paymentIntent.metadata?.accountId;
    const planId = paymentIntent.metadata?.planId;
    const subscriptionId = paymentIntent.metadata?.subscriptionId;
    const customerId = paymentIntent.customer as string;

    if (!accountId || !planId) {
      console.error("Missing accountId or planId in payment intent metadata");
      console.error("Available metadata:", paymentIntent.metadata);
      return;
    }

    if (!customerId) {
      console.error("Missing customer ID in payment intent");
      return;
    }

    if (subscriptionId) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as unknown as SubscriptionWithPeriods;

        const startDate = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString();

        const endDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await subscriptionService.updateSubscriptionData(
          accountId,
          planId as SubscriptionTier,
          SubscriptionStatus.ACTIVE,
          paymentIntent.customer as string,
          subscriptionId,
          startDate,
          endDate
        );
      } catch (stripeError) {
        console.error(
          "Error retrieving subscription from Stripe:",
          stripeError
        );

        await subscriptionService.updateSubscriptionData(
          accountId,
          planId as SubscriptionTier,
          SubscriptionStatus.ACTIVE,
          paymentIntent.customer as string,
          subscriptionId,
          new Date().toISOString(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        );
      }

      const supabase = createSupabaseAdmin();

      // Ensure stripe_customer_id is updated in accounts table (fallback)
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ stripe_customer_id: customerId })
        .eq("id", accountId);

      if (updateError) {
        console.error("Error updating customer ID:", updateError);
      }

      // Check if a history record already exists for this subscription
      const { data: existingHistory, error: checkError } = await supabase
        .from("subscription_history")
        .select("id")
        .eq("account_id", accountId)
        .eq("tier", planId as SubscriptionTier)
        .eq("status", SubscriptionStatus.ACTIVE)
        .in("change_reason", [
          "New subscription created",
          "Subscription created",
          "Payment completed for subscription",
        ])
        .limit(1);

      if (checkError) {
        console.error("Error checking existing history:", checkError);
      }

      // Only create history record if this is a standalone payment (no subscription)
      // OR if no subscription history exists yet (payment_intent fires before subscription.created)
      if (!subscriptionId || !existingHistory || existingHistory.length === 0) {
        const changeReason = subscriptionId
          ? "Payment completed for subscription"
          : "Payment completed via standalone payment intent";

        await supabase.from("subscription_history").insert({
          account_id: accountId,
          tier: planId as SubscriptionTier,
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date().toISOString(),
          payment_method: "stripe",
          amount_paid: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          change_reason: changeReason,
          customer_id: customerId,
        });
      }

      // Update user role based on subscription tier
      await updateUserRole(accountId, planId as SubscriptionTier);

      await triggerSessionRefresh(accountId);
      // Update email campaign to DONE if user's email exists in campaign list
      try {
        const { data: account } = await createSupabaseAdmin()
          .from("accounts")
          .select("email")
          .eq("id", accountId)
          .single();
        if (account?.email) {
          await markEmailCampaignAsUpgradedByEmail(account.email);
        }
      } catch {}
    } else {
      const supabase = createSupabaseAdmin();
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ stripe_customer_id: customerId })
        .eq("id", accountId);

      if (updateError) {
        console.error("Error updating customer ID:", updateError);
      }

      await triggerSessionRefresh(accountId);
      try {
        const { data: account } = await createSupabaseAdmin()
          .from("accounts")
          .select("email")
          .eq("id", accountId)
          .single();
        if (account?.email) {
          await markEmailCampaignAsUpgradedByEmail(account.email);
        }
      } catch {}
    }
  } catch (error) {
    console.error("Error handling payment intent success:", error);
  }
}

type SubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("No Stripe webhook secret configured");
      return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", {
        error: err,
        signature: signature?.substring(0, 20) + "...",
        bodyPreview: body?.substring(0, 100) + "...",
        webhookSecretExists: !!webhookSecret,
      });

      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    switch (event.type) {
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.created":
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log("Unhandled webhook event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const accountId = invoice.metadata?.accountId;
    const subscriptionId = (
      invoice as Stripe.Invoice & { subscription?: string }
    ).subscription as string;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

    const supabase = createSupabaseAdmin();

    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("subscription_status, subscription_end_date")
      .eq("id", accountId)
      .single();

    if (accountError) {
      console.error("Error getting account data:", accountError);
    }

    const maxRetryAttempts = 3;
    const gracePeriodDays = 7;
    const currentAttempt = invoice.attempt_count || 1;

    let newStatus: SubscriptionStatus;
    let changeReason: string;
    let notes: string;

    if (currentAttempt < maxRetryAttempts) {
      newStatus = SubscriptionStatus.ACTIVE;
      changeReason = `Monthly payment failed (attempt ${currentAttempt}/${maxRetryAttempts})`;
      notes = `Monthly payment failed but subscription remains active. Stripe will retry payment.`;
    } else {
      const subscriptionEndDate = account?.subscription_end_date
        ? new Date(account.subscription_end_date)
        : new Date();
      const gracePeriodEnd = new Date(
        subscriptionEndDate.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000
      );
      const now = new Date();

      if (now <= gracePeriodEnd) {
        newStatus = SubscriptionStatus.ACTIVE;
        changeReason = "Monthly payment failed - grace period active";
        notes = `Monthly payment failed after ${maxRetryAttempts} attempts. Grace period of ${gracePeriodDays} days active until ${gracePeriodEnd.toISOString()}`;
      } else {
        newStatus = SubscriptionStatus.EXPIRED;
        changeReason = "Monthly payment failed - grace period expired";
        notes = `Monthly payment failed after ${maxRetryAttempts} attempts and grace period of ${gracePeriodDays} days has expired.`;
      }
    }

    const currentDate = new Date().toISOString();
    const endDate =
      newStatus === SubscriptionStatus.EXPIRED ? currentDate : undefined;

    await subscriptionService.updateSubscriptionData(
      accountId,
      (invoice.metadata?.planId as SubscriptionTier) || SubscriptionTier.TIER1,
      newStatus,
      invoice.customer as string,
      subscriptionId,
      currentDate,
      endDate
    );

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier:
        (invoice.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      status: newStatus,
      start_date: new Date().toISOString(),
      end_date:
        newStatus === SubscriptionStatus.EXPIRED
          ? new Date().toISOString()
          : null,
      payment_method: "stripe",
      amount_paid: 0,
      change_reason: changeReason,
      notes: notes,
    });

    // Ensure stripe_customer_id is updated in accounts table (fallback)
    const { error: updateError } = await supabase
      .from("accounts")
      .update({ stripe_customer_id: invoice.customer as string })
      .eq("id", accountId);

    if (updateError) {
      console.error(
        "Error updating customer ID in payment failure:",
        updateError
      );
    }

    if (newStatus === SubscriptionStatus.EXPIRED) {
      await updateUserRole(accountId, SubscriptionTier.TIER1);
    } else {
      await updateUserRole(
        accountId,
        (invoice.metadata?.planId as SubscriptionTier) || SubscriptionTier.TIER1
      );
    }

    await triggerSessionRefresh(accountId);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const accountId = invoice.metadata?.accountId;
    const subscriptionId = (
      invoice as Stripe.Invoice & { subscription?: string }
    ).subscription as string;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

    const supabase = createSupabaseAdmin();

    await subscriptionService.updateSubscriptionData(
      accountId,
      (invoice.metadata?.planId as SubscriptionTier) || SubscriptionTier.TIER1,
      SubscriptionStatus.ACTIVE,
      invoice.customer as string,
      subscriptionId,
      new Date(invoice.period_start * 1000).toISOString(),
      new Date(invoice.period_end * 1000).toISOString()
    );

    await supabase
      .from("accounts")
      .update({
        stripe_customer_id: invoice.customer as string,
      })
      .eq("id", accountId);

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier:
        (invoice.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      status: SubscriptionStatus.ACTIVE,
      start_date: new Date(invoice.period_start * 1000).toISOString(),
      end_date: new Date(invoice.period_end * 1000).toISOString(),
      payment_method: "stripe",
      amount_paid: invoice.amount_paid / 100,
      change_reason: "Monthly recurring payment succeeded",
      notes: "Automatic monthly subscription payment processed successfully",
      customer_id: invoice.customer as string,
    });

    // Update user role based on subscription tier
    await updateUserRole(
      accountId,
      (invoice.metadata?.planId as SubscriptionTier) || SubscriptionTier.TIER1
    );

    await triggerSessionRefresh(accountId);
    // Mark user campaign as upgraded for this account's email
    try {
      const { data: acc } = await createSupabaseAdmin()
        .from("accounts")
        .select("email")
        .eq("id", accountId)
        .single();
      if (acc?.email) {
        await markEmailCampaignAsUpgradedByEmail(acc.email);
      }
    } catch {}
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error(
        "No accountId in subscription metadata for subscription:",
        subscription.id
      );
      return;
    }

    const safeTimestampToISO = (
      timestamp: number | undefined | null
    ): string | null => {
      if (timestamp === undefined || timestamp === null) {
        console.warn("Timestamp is undefined or null");
        return null;
      }
      if (typeof timestamp !== "number" || timestamp <= 0) {
        console.warn(
          "Invalid timestamp:",
          timestamp,
          "type:",
          typeof timestamp
        );
        return null;
      }
      try {
        const date = new Date(timestamp * 1000);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date created from timestamp:", timestamp);
          return null;
        }
        return date.toISOString();
      } catch (error) {
        console.error(
          "Error converting timestamp to ISO:",
          error,
          "timestamp:",
          timestamp
        );
        return null;
      }
    };

    const subscriptionWithPeriods = subscription as SubscriptionWithPeriods;
    const rawSubscription = subscription as unknown as Record<string, unknown>;

    let startTimestamp: number | undefined =
      subscriptionWithPeriods.current_period_start ||
      (rawSubscription.current_period_start as number) ||
      (rawSubscription.start_date as number);

    let endTimestamp: number | undefined =
      subscriptionWithPeriods.current_period_end ||
      (rawSubscription.current_period_end as number) ||
      (rawSubscription.end_date as number);

    if (!startTimestamp || !endTimestamp) {
      const items = rawSubscription.items as unknown as {
        data?: Array<{
          current_period_start?: number;
          current_period_end?: number;
        }>;
      };

      if (items?.data?.[0]) {
        const firstItem = items.data[0];
        startTimestamp =
          startTimestamp || firstItem.current_period_start || undefined;
        endTimestamp =
          endTimestamp || firstItem.current_period_end || undefined;
      }
    }

    if (!startTimestamp) {
      startTimestamp = rawSubscription.start_date as number;
    }

    let startDate = safeTimestampToISO(startTimestamp);
    let endDate = safeTimestampToISO(endTimestamp);

    if (!startDate || !endDate) {
      const fallbackStartDate = startDate || new Date().toISOString();
      const fallbackEndDate =
        endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      startDate = fallbackStartDate;
      endDate = fallbackEndDate;
    }

    const supabase = createSupabaseAdmin();

    // Verify account exists before updating
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id, email")
      .eq("id", accountId)
      .single();

    if (accountError || !account) {
      console.error("Account not found for subscription creation:", {
        accountId,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        error: accountError,
      });
      return;
    }

    // Update subscription data using the service (handles all fields properly including customer ID)
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.ACTIVE,
      subscription.customer as string,
      subscription.id,
      startDate || undefined,
      endDate || undefined
    );

    // Ensure stripe_customer_id is updated in accounts table (fallback)
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        stripe_customer_id: subscription.customer as string,
      })
      .eq("id", accountId);

    if (updateError) {
      console.error(
        "Error updating customer ID in accounts table:",
        updateError
      );
    }

    // Check if a history record already exists for this subscription
    const { data: existingHistory, error: checkError } = await supabase
      .from("subscription_history")
      .select("id")
      .eq("account_id", accountId)
      .eq(
        "tier",
        (subscription.metadata?.planId as SubscriptionTier) ||
          SubscriptionTier.TIER1
      )
      .eq("status", SubscriptionStatus.ACTIVE)
      .in("change_reason", [
        "New subscription created",
        "Subscription created",
        "Payment completed for subscription",
      ])
      .limit(1);

    if (checkError) {
      console.error("Error checking existing history:", checkError);
    }

    // Only create history record if one doesn't already exist
    if (!existingHistory || existingHistory.length === 0) {
      // Get the latest invoice to get the actual payment amount
      let paymentAmount = 0;
      let currency = "USD";

      if (subscription.latest_invoice) {
        try {
          const invoice = await stripe.invoices.retrieve(
            subscription.latest_invoice as string
          );
          paymentAmount = invoice.amount_paid / 100; // Convert from cents to dollars
          currency = invoice.currency.toUpperCase();

          // If amount_paid is 0, try to get the amount from the invoice total
          if (paymentAmount === 0 && invoice.amount_due > 0) {
            paymentAmount = invoice.amount_due / 100;
          }
        } catch (invoiceError) {
          console.error(
            "Error retrieving invoice for payment amount:",
            invoiceError
          );
        }
      }

      // Fallback: Get amount from subscription items if invoice amount is still 0
      if (paymentAmount === 0 && subscription.items?.data?.[0]) {
        try {
          const price = await stripe.prices.retrieve(
            subscription.items.data[0].price.id
          );
          paymentAmount = price.unit_amount ? price.unit_amount / 100 : 0;
          currency = price.currency.toUpperCase();
        } catch (priceError) {
          console.error(
            "Error retrieving price for payment amount:",
            priceError
          );
        }
      }

      const { error: historyError } = await supabase
        .from("subscription_history")
        .insert({
          account_id: accountId,
          tier:
            (subscription.metadata?.planId as SubscriptionTier) ||
            SubscriptionTier.TIER1,
          status: SubscriptionStatus.ACTIVE,
          start_date: startDate || new Date().toISOString(),
          end_date:
            endDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: "stripe",
          amount_paid: paymentAmount,
          currency: currency,
          change_reason: "New subscription created",
          notes: `Subscribed to ${
            subscription.metadata?.planId || "tier1"
          } via Stripe webhook`,
        });

      if (historyError) {
        console.error("Failed to create subscription history:", historyError);
      }
    }

    // Update user role based on subscription tier
    await updateUserRole(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1
    );

    await triggerSessionRefresh(accountId);
    // Mark email campaign as upgraded
    if (account?.email) {
      await markEmailCampaignAsUpgradedByEmail(account.email);
    }
  } catch (error) {
    console.error("Error handling subscription creation:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error(
        "No accountId in subscription metadata for subscription:",
        subscription.id
      );
      return;
    }

    const safeTimestampToISO = (
      timestamp: number | undefined | null
    ): string | null => {
      if (timestamp === undefined || timestamp === null) {
        console.warn("Timestamp is undefined or null");
        return null;
      }
      if (typeof timestamp !== "number" || timestamp <= 0) {
        console.warn(
          "Invalid timestamp:",
          timestamp,
          "type:",
          typeof timestamp
        );
        return null;
      }
      try {
        const date = new Date(timestamp * 1000);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date created from timestamp:", timestamp);
          return null;
        }
        return date.toISOString();
      } catch (error) {
        console.error(
          "Error converting timestamp to ISO:",
          error,
          "timestamp:",
          timestamp
        );
        return null;
      }
    };

    const subscriptionWithPeriods = subscription as SubscriptionWithPeriods;
    const rawSubscription = subscription as unknown as Record<string, unknown>;

    let startTimestamp: number | undefined =
      subscriptionWithPeriods.current_period_start ||
      (rawSubscription.current_period_start as number) ||
      (rawSubscription.start_date as number);

    let endTimestamp: number | undefined =
      subscriptionWithPeriods.current_period_end ||
      (rawSubscription.current_period_end as number) ||
      (rawSubscription.end_date as number);

    if (!startTimestamp || !endTimestamp) {
      const items = rawSubscription.items as unknown as {
        data?: Array<{
          current_period_start?: number;
          current_period_end?: number;
        }>;
      };
      if (items?.data?.[0]) {
        const firstItem = items.data[0];
        startTimestamp =
          startTimestamp || firstItem.current_period_start || undefined;
        endTimestamp =
          endTimestamp || firstItem.current_period_end || undefined;
      }
    }

    if (!startTimestamp) {
      startTimestamp = rawSubscription.start_date as number;
    }

    let startDate = safeTimestampToISO(startTimestamp);
    let endDate = safeTimestampToISO(endTimestamp);

    if (!startDate || !endDate) {
      const fallbackStartDate = startDate || new Date().toISOString();
      const fallbackEndDate =
        endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      startDate = fallbackStartDate;
      endDate = fallbackEndDate;
    }

    const supabase = createSupabaseAdmin();

    // Verify account exists before updating
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id")
      .eq("id", accountId)
      .single();

    if (accountError || !account) {
      console.error("Account not found for subscription update:", {
        accountId,
        subscriptionId: subscription.id,
        error: accountError,
      });
      return;
    }

    // Update subscription data using the service (handles all fields properly including customer ID)
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      subscription.status === SubscriptionStatus.ACTIVE
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.CANCELLED,
      subscription.customer as string,
      subscription.id,
      startDate || undefined,
      endDate || undefined
    );

    // Ensure stripe_customer_id is updated in accounts table (fallback)
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        stripe_customer_id: subscription.customer as string,
      })
      .eq("id", accountId);

    if (updateError) {
      console.error(
        "Error updating customer ID in accounts table:",
        updateError
      );
    }

    // Get the latest invoice to get the actual payment amount
    let paymentAmount = 0;
    let currency = "USD";

    if (subscription.latest_invoice) {
      try {
        const invoice = await stripe.invoices.retrieve(
          subscription.latest_invoice as string
        );
        paymentAmount = invoice.amount_paid / 100; // Convert from cents to dollars
        currency = invoice.currency.toUpperCase();
      } catch (invoiceError) {
        console.error(
          "Error retrieving invoice for payment amount:",
          invoiceError
        );
      }
    }

    const { error: historyError } = await supabase
      .from("subscription_history")
      .insert({
        account_id: accountId,
        tier:
          (subscription.metadata?.planId as SubscriptionTier) ||
          SubscriptionTier.TIER1,
        status:
          subscription.status === SubscriptionStatus.ACTIVE
            ? SubscriptionStatus.ACTIVE
            : SubscriptionStatus.CANCELLED,
        start_date: startDate || new Date().toISOString(),
        end_date:
          endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "stripe",
        amount_paid: paymentAmount,
        currency: currency,
        change_reason: "Subscription updated",
        notes: `Subscription ${subscription.status} via Stripe webhook`,
      });

    if (historyError) {
      console.error(
        "Failed to create subscription history for update:",
        historyError
      );
    }

    // Update user role based on subscription tier
    await updateUserRole(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1
    );

    await triggerSessionRefresh(accountId);
    // If subscription is active, mark email campaign as upgraded
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      try {
        const { data: acc } = await createSupabaseAdmin()
          .from("accounts")
          .select("email")
          .eq("id", accountId)
          .single();
        if (acc?.email) {
          await markEmailCampaignAsUpgradedByEmail(acc.email);
        }
      } catch {}
    }
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
      return;
    }

    // Update subscription data using the service (handles all fields properly including customer ID)
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.CANCELLED,
      subscription.customer as string,
      subscription.id,
      undefined,
      new Date().toISOString()
    );

    // Ensure stripe_customer_id is updated in accounts table (fallback)
    await supabase
      .from("accounts")
      .update({
        stripe_customer_id: subscription.customer as string,
      })
      .eq("id", accountId);

    await triggerSessionRefresh(accountId);

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: subscription.metadata?.planId || SubscriptionTier.TIER1,
      status: SubscriptionStatus.CANCELLED,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      payment_method: "stripe",
      amount_paid: 0,
      change_reason: "Subscription cancelled",
      notes: "Subscription cancelled via Stripe webhook",
    });

    // Update user role to "user" when subscription is deleted/cancelled
    await updateUserRole(accountId, SubscriptionTier.TIER1);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    const accountId = customer.metadata?.accountId;

    if (!accountId) {
      console.error(
        "No accountId in customer metadata, skipping customer.created webhook"
      );
      return;
    }

    const supabase = createSupabaseAdmin();

    // Update the accounts table with the new customer ID
    const { error: updateError } = await supabase
      .from("accounts")
      .update({ stripe_customer_id: customer.id })
      .eq("id", accountId);

    if (updateError) {
      console.error(
        "Error updating customer ID in accounts table:",
        updateError
      );
    }

    await triggerSessionRefresh(accountId);
  } catch (error) {
    console.error("Error handling customer creation:", error);
  }
}
