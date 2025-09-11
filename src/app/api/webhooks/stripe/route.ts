import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionService } from "@/lib/supabase/subscription";
import { SubscriptionStatus, SubscriptionTier } from "@/@types/enum";
import Stripe from "stripe";

// Function to trigger session refresh for a user
async function triggerSessionRefresh(accountId: string) {
  try {
    // Store a flag in the database to indicate subscription was updated
    const supabase = createSupabaseAdmin();
    await supabase
      .from("accounts")
      .update({
        last_subscription_update: new Date().toISOString(),
      })
      .eq("id", accountId);

    console.log("Session refresh triggered for account:", accountId);
  } catch (error) {
    console.error("Error triggering session refresh:", error);
  }
}

// Extended subscription type with period properties
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

    console.log("Received Stripe webhook:", event.type);
    console.log(
      "Webhook event data:",
      JSON.stringify(event.data.object, null, 2)
    );

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
    console.log("Payment succeeded - invoice data:", {
      id: invoice.id,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
      metadata: invoice.metadata,
      subscription: (invoice as Stripe.Invoice & { subscription?: string })
        .subscription,
    });

    const accountId = invoice.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

    // Helper function to safely convert timestamp to ISO string
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

    // Update subscription status using subscription service
    await subscriptionService.updateSubscriptionData(
      accountId,
      SubscriptionTier.TIER1, // Will be updated with actual tier from metadata
      SubscriptionStatus.ACTIVE,
      undefined, // stripeCustomerId
      undefined, // stripeSubscriptionId
      startDate || undefined, // subscriptionStartDate
      endDate || undefined // subscriptionEndDate
    );

    // Trigger session refresh for the user
    await triggerSessionRefresh(accountId);

    // Record payment history
    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: invoice.metadata?.planId || "tier1",
      status: SubscriptionStatus.ACTIVE,
      start_date: startDate,
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

    // Update subscription status to expired
    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.EXPIRED,
      })
      .eq("id", accountId);

    // Record failure history
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
    console.log("Subscription created - subscription data:", {
      id: subscription.id,
      current_period_start: (subscription as SubscriptionWithPeriods)
        .current_period_start,
      current_period_end: (subscription as SubscriptionWithPeriods)
        .current_period_end,
      status: subscription.status,
      metadata: subscription.metadata,
    });

    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
      return;
    }

    // Helper function to safely convert timestamp to ISO string
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

    // Try to get timestamps from different possible locations
    const subscriptionWithPeriods = subscription as SubscriptionWithPeriods;
    const rawSubscription = subscription as unknown as Record<string, unknown>;

    const startTimestamp =
      subscriptionWithPeriods.current_period_start ||
      (rawSubscription.current_period_start as number) ||
      (rawSubscription.start_date as number);
    const endTimestamp =
      subscriptionWithPeriods.current_period_end ||
      (rawSubscription.current_period_end as number) ||
      (rawSubscription.end_date as number);

    console.log("Subscription timestamp extraction:", {
      current_period_start: subscriptionWithPeriods.current_period_start,
      current_period_end: subscriptionWithPeriods.current_period_end,
      raw_current_period_start: rawSubscription.current_period_start,
      raw_current_period_end: rawSubscription.current_period_end,
      extracted_start: startTimestamp,
      extracted_end: endTimestamp,
    });

    const startDate = safeTimestampToISO(startTimestamp);
    const endDate = safeTimestampToISO(endTimestamp);

    // Update account with subscription details using subscription service
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.ACTIVE,
      undefined, // stripeCustomerId (will be set separately)
      subscription.id, // stripeSubscriptionId
      startDate || undefined, // subscriptionStartDate
      endDate || undefined // subscriptionEndDate
    );

    // Trigger session refresh for the user
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

    // Helper function to safely convert timestamp to ISO string
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

    // Try to get timestamps from different possible locations
    const subscriptionWithPeriods = subscription as SubscriptionWithPeriods;
    const rawSubscription = subscription as unknown as Record<string, unknown>;

    const endTimestamp =
      subscriptionWithPeriods.current_period_end ||
      (rawSubscription.current_period_end as number) ||
      (rawSubscription.end_date as number);

    console.log("Subscription update timestamp extraction:", {
      current_period_end: subscriptionWithPeriods.current_period_end,
      raw_current_period_end: rawSubscription.current_period_end,
      extracted_end: endTimestamp,
    });

    const endDate = safeTimestampToISO(endTimestamp);

    // Update subscription details using subscription service
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      subscription.status === "active"
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.CANCELLED,
      undefined, // stripeCustomerId
      subscription.id, // stripeSubscriptionId
      undefined, // subscriptionStartDate
      endDate || undefined // subscriptionEndDate
    );

    // Trigger session refresh for the user
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

    // Update subscription status to cancelled using subscription service
    await subscriptionService.updateSubscriptionData(
      accountId,
      (subscription.metadata?.planId as SubscriptionTier) ||
        SubscriptionTier.TIER1,
      SubscriptionStatus.CANCELLED,
      undefined, // stripeCustomerId
      subscription.id, // stripeSubscriptionId
      undefined, // subscriptionStartDate
      new Date().toISOString() // subscriptionEndDate
    );

    // Trigger session refresh for the user
    await triggerSessionRefresh(accountId);

    // Record cancellation history
    await supabase.from("subscription_history").insert({
      account_id: accountId,
      tier: subscription.metadata?.planId || "tier1",
      status: SubscriptionStatus.CANCELLED,
      start_date: new Date().toISOString(),
      payment_method: "stripe",
      amount_paid: 0,
      change_reason: "Subscription cancelled",
      notes: "Subscription cancelled via Stripe webhook",
    });
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}
