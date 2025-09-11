import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionStatus } from "@/@types/enum";
import Stripe from "stripe";

// Extended subscription type with period properties
type SubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
};

// Extended invoice type with subscription property
type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string;
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
        await handlePaymentFailed(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          supabase
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
    const accountId = invoice.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

    // Helper function to safely convert timestamp to ISO string
    const safeTimestampToISO = (
      timestamp: number | undefined
    ): string | null => {
      if (!timestamp || typeof timestamp !== "number" || timestamp <= 0) {
        console.warn("Invalid timestamp:", timestamp);
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

    // Update subscription status
    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.ACTIVE,
        subscription_end_date: endDate,
      })
      .eq("id", accountId);

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

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    const accountId = invoice.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in invoice metadata");
      return;
    }

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

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
      return;
    }

    // Helper function to safely convert timestamp to ISO string
    const safeTimestampToISO = (
      timestamp: number | undefined
    ): string | null => {
      if (!timestamp || typeof timestamp !== "number" || timestamp <= 0) {
        console.warn("Invalid timestamp:", timestamp);
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
    const startDate = safeTimestampToISO(
      subscriptionWithPeriods.current_period_start
    );
    const endDate = safeTimestampToISO(
      subscriptionWithPeriods.current_period_end
    );

    // Update account with subscription details
    await supabase
      .from("accounts")
      .update({
        stripe_subscription_id: subscription.id,
        subscription_tier: subscription.metadata?.planId || "tier1",
        subscription_status: SubscriptionStatus.ACTIVE,
        subscription_start_date: startDate,
        subscription_end_date: endDate,
      })
      .eq("id", accountId);
  } catch (error) {
    console.error("Error handling subscription creation:", error);
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createSupabaseAdmin>
) {
  try {
    const accountId = subscription.metadata?.accountId;

    if (!accountId) {
      console.error("No accountId in subscription metadata");
      return;
    }

    // Helper function to safely convert timestamp to ISO string
    const safeTimestampToISO = (
      timestamp: number | undefined
    ): string | null => {
      if (!timestamp || typeof timestamp !== "number" || timestamp <= 0) {
        console.warn("Invalid timestamp:", timestamp);
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
    const endDate = safeTimestampToISO(
      subscriptionWithPeriods.current_period_end
    );

    // Update subscription details
    await supabase
      .from("accounts")
      .update({
        subscription_status:
          subscription.status === "active"
            ? SubscriptionStatus.ACTIVE
            : SubscriptionStatus.CANCELLED,
        subscription_end_date: endDate,
      })
      .eq("id", accountId);
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

    // Update subscription status to cancelled
    await supabase
      .from("accounts")
      .update({
        subscription_status: SubscriptionStatus.CANCELLED,
        subscription_end_date: new Date().toISOString(),
      })
      .eq("id", accountId);

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
