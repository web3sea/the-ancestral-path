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

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    const accountId = paymentIntent.metadata?.accountId;
    const planId = paymentIntent.metadata?.planId;
    const subscriptionId = paymentIntent.metadata?.subscriptionId;

    if (!accountId || !planId) {
      console.error("Missing accountId or planId in payment intent metadata");
      console.error("Available metadata:", paymentIntent.metadata);
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

        console.log("Subscription dates from Stripe:", { startDate, endDate });

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
      await supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: planId as SubscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        change_reason: "Payment completed via standalone payment intent",
      });

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
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    switch (event.type) {
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
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

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    const accountId = invoice.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
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

    const endDate = safeTimestampToISO(invoice.period_end);
    const startDate = safeTimestampToISO(invoice.period_start);

    await subscriptionService.updateSubscriptionData(
      accountId,
      SubscriptionTier.TIER1,
      SubscriptionStatus.ACTIVE,
      undefined,
      undefined,
      startDate || undefined,
      endDate || undefined
    );

    await triggerSessionRefresh(accountId);

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: invoice.metadata?.planId || "tier1",
      status: SubscriptionStatus.ACTIVE,
      start_date: startDate,
      end_date: endDate,
      payment_method: "stripe",
      amount_paid: invoice.amount_paid / 100,
      change_reason: "Monthly payment processed",
      notes: "Payment processed via Stripe webhook",
    });
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const accountId = invoice.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

    const supabase = createSupabaseAdmin();

    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.EXPIRED,
      })
      .eq("id", accountId);

    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: invoice.metadata?.planId || "tier1",
      status: SubscriptionStatus.EXPIRED,
      start_date: new Date().toISOString(),
      payment_method: "stripe",
      amount_paid: 0,
      change_reason: "Payment failed",
      notes: "Payment failed via Stripe webhook",
    });
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
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

    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.ACTIVE,
      undefined,
      subscription.id,
      startDate || undefined,
      endDate || undefined
    );

    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const supabase = createSupabaseAdmin();

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

    await triggerSessionRefresh(accountId);
  } catch (error) {
    console.error("Error handling subscription creation:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
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

    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      subscription.status === SubscriptionStatus.ACTIVE
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.CANCELLED,
      undefined,
      subscription.id,
      startDate || undefined,
      endDate || undefined
    );

    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const supabase = createSupabaseAdmin();

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

    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.CANCELLED,
      undefined,
      subscription.id,
      undefined,
      new Date().toISOString()
    );

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
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}
