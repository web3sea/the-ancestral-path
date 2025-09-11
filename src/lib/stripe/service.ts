import { stripe, STRIPE_PLANS, type StripePlanId } from "./config";
import { createSupabaseAdmin } from "../supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import Stripe from "stripe";

// Extended subscription type with period properties
type SubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
};

export interface CreateSubscriptionParams {
  customerId: string;
  planId: StripePlanId;
  accountId: string;
}

export interface SubscriptionResult {
  success: boolean;
  subscription?: Stripe.Subscription;
  clientSecret?: string;
  error?: string;
}

export class StripeService {
  private supabase = createSupabaseAdmin();

  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, name: string, accountId: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          accountId,
        },
      });

      // Update account with Stripe customer ID
      await this.supabase
        .from("accounts")
        .update({ stripe_customer_id: customer.id })
        .eq("id", accountId);

      return customer;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw error;
    }
  }

  /**
   * Create a subscription with payment method
   */
  async createSubscription({
    customerId,
    planId,
    accountId,
  }: CreateSubscriptionParams): Promise<SubscriptionResult> {
    try {
      const plan = STRIPE_PLANS[planId];
      if (!plan) {
        return { success: false, error: "Invalid plan ID" };
      }

      // Create Stripe price if it doesn't exist
      const price = await this.getOrCreatePrice(plan);

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          accountId,
          planId,
        },
      });

      // Type guard for expanded subscription.latest_invoice
      type ExpandedInvoice = {
        payment_intent?: {
          client_secret?: string;
        };
      };

      const invoice = subscription.latest_invoice as ExpandedInvoice | null;
      const paymentIntent = invoice?.payment_intent;

      return {
        success: true,
        subscription,
        clientSecret: paymentIntent?.client_secret,
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get or create Stripe price for a plan
   */
  private async getOrCreatePrice(
    plan: typeof STRIPE_PLANS.tier1 | typeof STRIPE_PLANS.tier2
  ) {
    try {
      // Try to find existing price
      const prices = await stripe.prices.list({
        product: await this.getOrCreateProduct(plan),
        active: true,
      });

      const existingPrice = prices.data.find(
        (price) =>
          price.unit_amount === plan.price &&
          price.recurring?.interval === plan.interval
      );

      if (existingPrice) {
        return existingPrice;
      }

      // Create new price
      return await stripe.prices.create({
        product: await this.getOrCreateProduct(plan),
        unit_amount: plan.price,
        currency: "usd",
        recurring: {
          interval: plan.interval as Stripe.Price.Recurring.Interval,
        },
        metadata: {
          planId: plan.id,
        },
      });
    } catch (error) {
      console.error("Error getting/creating price:", error);
      throw error;
    }
  }

  /**
   * Get or create Stripe product for a plan
   */
  private async getOrCreateProduct(
    plan: typeof STRIPE_PLANS.tier1 | typeof STRIPE_PLANS.tier2
  ) {
    try {
      // Try to find existing product
      const products = await stripe.products.list({
        active: true,
      });

      const existingProduct = products.data.find(
        (p) => p.metadata?.planId === plan.id
      );
      if (existingProduct) {
        return existingProduct.id;
      }

      // Create new product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          planId: plan.id,
        },
      });

      return product.id;
    } catch (error) {
      console.error("Error getting/creating product:", error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, accountId: string) {
    try {
      const subscription = (await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })) as Stripe.Subscription;

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

      console.log("Cancel subscription timestamps:", {
        current_period_end: subscriptionWithPeriods.current_period_end,
        endDate,
      });

      // Update database
      await this.supabase
        .from("accounts")
        .update({
          subscription_status: SubscriptionStatus.CANCELLED,
          subscription_end_date: endDate,
        })
        .eq("id", accountId);

      // Record cancellation history
      await this.supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: SubscriptionTier.TIER1, // Will be updated with actual tier
        status: SubscriptionStatus.CANCELLED,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: 0,
        change_reason: "Subscription cancelled",
        notes: "Cancelled by user via Stripe",
      });

      return { success: true, subscription };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(customerId: string) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return { hasSubscription: false, subscription: null };
      }

      const subscription = subscriptions.data[0];
      return {
        hasSubscription: true,
        subscription,
        status: subscription.status,
        currentPeriodEnd: new Date(
          (subscription as SubscriptionWithPeriods).current_period_end * 1000
        ),
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handleSuccessfulPayment(subscriptionId: string, accountId: string) {
    try {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId
      )) as Stripe.Subscription;
      const planId = subscription.metadata.planId as StripePlanId;
      const plan = STRIPE_PLANS[planId];

      if (!plan) {
        throw new Error("Invalid plan ID in subscription metadata");
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
      await this.supabase
        .from("accounts")
        .update({
          subscription_tier: planId as SubscriptionTier,
          subscription_status: SubscriptionStatus.ACTIVE,
          subscription_start_date: startDate,
          subscription_end_date: endDate,
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", accountId);

      // Record subscription history
      await this.supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: planId as SubscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date(
          (subscription as SubscriptionWithPeriods).current_period_start * 1000
        ).toISOString(),
        payment_method: "stripe",
        amount_paid: plan.price / 100,
        change_reason: "New subscription created",
        notes: `Subscribed to ${plan.name} via Stripe`,
      });

      return { success: true };
    } catch (error) {
      console.error("Error handling successful payment:", error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
