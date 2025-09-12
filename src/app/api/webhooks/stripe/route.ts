import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionService } from "@/lib/supabase/subscription";
import { SubscriptionStatus, SubscriptionTier } from "@/@types/enum";
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
    } else {
      console.log(`Updated role to ${roleName} for account ${accountId}`);
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
      } else {
        console.log("Customer ID updated successfully for account:", accountId);
      }

      await supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: planId as SubscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        change_reason: "Payment completed via standalone payment intent",
        customer_id: customerId,
      });

      // Update user role based on subscription tier
      await updateUserRole(accountId, planId as SubscriptionTier);

      await triggerSessionRefresh(accountId);
    } else {
      const supabase = createSupabaseAdmin();
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ stripe_customer_id: customerId })
        .eq("id", accountId);

      if (updateError) {
        console.error("Error updating customer ID:", updateError);
      } else {
        console.log("Customer ID updated successfully for account:", accountId);
      }

      await triggerSessionRefresh(accountId);
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

      // For development/testing: try to parse the body as JSON to see if it's a valid Stripe event
      try {
        const parsedBody = JSON.parse(body);
        console.log("Body can be parsed as JSON:", {
          type: parsedBody.type,
          id: parsedBody.id,
          created: parsedBody.created,
        });

        // If it looks like a Stripe event, log more details
        if (parsedBody.type && parsedBody.id) {
          console.log(
            "This appears to be a Stripe event but signature verification failed"
          );
          console.log("Check your STRIPE_WEBHOOK_SECRET environment variable");
        }
      } catch (parseErr) {
        console.log("Body cannot be parsed as JSON:", parseErr);
      }

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
    } else {
      console.log("Customer ID updated successfully for account:", accountId);
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

    console.log("Account verified for subscription creation:", {
      accountId,
      accountEmail: account.email,
    });

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
    } else {
      console.log("Customer ID updated successfully for account:", accountId);
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
        amount_paid: 0,
        change_reason: "New subscription created",
        notes: `Subscribed to ${
          subscription.metadata?.planId || "tier1"
        } via Stripe webhook`,
      });

    if (historyError) {
      console.error("Failed to create subscription history:", historyError);
    } else {
      console.log("Subscription history created successfully");
    }

    // Update user role based on subscription tier
    await updateUserRole(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1
    );

    await triggerSessionRefresh(accountId);
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

    console.log("Account verified for subscription update:", accountId);

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
    } else {
      console.log("Customer ID updated successfully for account:", accountId);
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
        amount_paid: 0,
        change_reason: "Subscription updated",
        notes: `Subscription ${subscription.status} via Stripe webhook`,
      });

    if (historyError) {
      console.error(
        "Failed to create subscription history for update:",
        historyError
      );
    } else {
      console.log("Subscription history created for update");
    }

    // Update user role based on subscription tier
    await updateUserRole(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1
    );

    await triggerSessionRefresh(accountId);
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
      console.log(
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
    } else {
      console.log("Customer ID updated successfully for account:", accountId);
    }

    await triggerSessionRefresh(accountId);
  } catch (error) {
    console.error("Error handling customer creation:", error);
  }
}
