import { stripe, STRIPE_PLANS, type StripePlanId } from "./config";
import { createSupabaseAdmin } from "../supabase/admin";
import { subscriptionService } from "../supabase/subscription";
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
      const { error: updateError } = await this.supabase
        .from("accounts")
        .update({ stripe_customer_id: customer.id })
        .eq("id", accountId);

      if (updateError) {
        console.error(
          "Error updating account with Stripe customer ID:",
          updateError
        );
        throw new Error(`Failed to update account: ${updateError.message}`);
      }

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

      // Create subscription with payment intent
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
          payment_method_types: ["card"],
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          accountId,
          planId,
        },
        collection_method: "charge_automatically",
      });

      console.log(
        "Created subscription:",
        subscription.id,
        "with metadata:",
        subscription.metadata
      );

      let clientSecret: string | undefined;

      if (subscription.latest_invoice) {
        const invoice = subscription.latest_invoice as Stripe.Invoice & {
          payment_intent?: Stripe.PaymentIntent;
        };

        if (invoice.payment_intent) {
          const paymentIntent = invoice.payment_intent;
          clientSecret = paymentIntent.client_secret || undefined;

          // Ensure payment intent has subscription ID in metadata
          if (!paymentIntent.metadata?.subscriptionId) {
            try {
              await stripe.paymentIntents.update(paymentIntent.id, {
                metadata: {
                  ...paymentIntent.metadata,
                  accountId,
                  planId,
                  subscriptionId: subscription.id,
                },
              });
              console.log(
                "Updated payment intent metadata with subscription ID"
              );
            } catch (error) {
              console.error("Error updating payment intent metadata:", error);
            }
          }
        } else {
          try {
            if (invoice.id) {
              const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
                expand: ["payment_intent"],
              });

              const expandedInvoice = fullInvoice as Stripe.Invoice & {
                payment_intent?: Stripe.PaymentIntent;
              };
              if (expandedInvoice.payment_intent) {
                const paymentIntent = expandedInvoice.payment_intent;
                clientSecret = paymentIntent.client_secret || undefined;
              }
            }
          } catch (error) {
            console.error("Error retrieving invoice:", error);
          }
        }
      }

      if (!clientSecret) {
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: plan.price,
            currency: "usd",
            customer: customerId,
            metadata: {
              accountId,
              planId,
              subscriptionId: subscription.id,
            },
            automatic_payment_methods: {
              enabled: true,
            },
          });

          clientSecret = paymentIntent.client_secret || undefined;
          console.log(
            "Created standalone payment intent with metadata:",
            paymentIntent.metadata
          );
        } catch (error) {
          console.error("Error creating standalone payment intent:", error);
          return {
            success: false,
            error: "Failed to create payment intent",
          };
        }
      }

      if (!clientSecret) {
        console.error("No client secret found in payment intent");
        return {
          success: false,
          error: "Payment intent not created properly",
        };
      }

      // Create subscription history record
      try {
        await this.supabase.from("subscription_history").insert({
          account_id: accountId,
          tier: planId as SubscriptionTier,
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date().toISOString(),
          payment_method: "stripe",
          amount_paid: plan.price / 100,
          currency: "USD",
          change_reason: "Subscription created",
        });
        console.log("Subscription history created for account:", accountId);
      } catch (error) {
        console.error("Error creating subscription history:", error);
        // Don't fail the entire operation if history creation fails
      }

      return {
        success: true,
        subscription,
        clientSecret,
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
        timestamp: number | undefined | null
      ): string | null => {
        if (timestamp === undefined || timestamp === null) {
          return null;
        }
        if (typeof timestamp !== "number" || timestamp <= 0) {
          return null;
        }
        try {
          const date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
            return null;
          }
          return date.toISOString();
        } catch {
          return null;
        }
      };

      const subscriptionWithPeriods = subscription as SubscriptionWithPeriods;
      const endDate = safeTimestampToISO(
        subscriptionWithPeriods.current_period_end
      );

      // Update database using the subscription service
      await subscriptionService.updateSubscriptionData(
        accountId,
        SubscriptionTier.TIER1, // Will be updated with actual tier
        SubscriptionStatus.CANCELLED,
        undefined, // stripeCustomerId
        undefined, // stripeSubscriptionId
        undefined, // subscriptionStartDate
        endDate || undefined // subscriptionEndDate
      );

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
        timestamp: number | undefined | null
      ): string | null => {
        if (timestamp === undefined || timestamp === null) {
          return null;
        }
        if (typeof timestamp !== "number" || timestamp <= 0) {
          return null;
        }
        try {
          const date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
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

      // Update account with subscription details using the subscription service
      await subscriptionService.updateSubscriptionData(
        accountId,
        planId as SubscriptionTier,
        SubscriptionStatus.ACTIVE,
        undefined, // stripeCustomerId (will be set separately)
        subscriptionId, // stripeSubscriptionId
        startDate || undefined, // subscriptionStartDate
        endDate || undefined // subscriptionEndDate
      );

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
