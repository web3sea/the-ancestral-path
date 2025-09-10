import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in cents
  features: string[];
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  tier1: {
    id: "tier1",
    name: "Tier 1",
    price: 2900, // $29.00
    description: "Essential wellness features",
    features: [
      "Guided breathwork sessions",
      "Basic meditation practices",
      "Oracle guidance",
      "Email support",
    ],
  },
  tier2: {
    id: "tier2",
    name: "Tier 2",
    price: 3900, // $39.00
    description: "Complete wellness experience",
    features: [
      "Everything in Tier 1",
      "Advanced oracle AI",
      "Astrological insights",
      "Group workshops",
      "Priority support",
    ],
  },
};

export class SubscriptionService {
  private supabase = createSupabaseAdmin();

  /**
   * Create a new subscription
   */
  async createSubscription(
    accountId: string,
    planId: string,
    paymentMethodId: string
  ) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId];
      if (!plan) {
        throw new Error("Invalid subscription plan");
      }

      // Create subscription record
      const { data: subscription, error } = await this.supabase
        .from("accounts")
        .update({
          subscription_tier: planId as SubscriptionTier,
          subscription_status: SubscriptionStatus.ACTIVE,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days
        })
        .eq("id", accountId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Record subscription history
      await this.supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: planId as SubscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: plan.price / 100,
        change_reason: "New subscription created",
        notes: `Subscribed to ${plan.name}`,
      });

      return {
        success: true,
        subscription,
        plan,
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  /**
   * Process monthly payment
   */
  async processMonthlyPayment(accountId: string) {
    try {
      // Get account subscription details
      const { data: account } = await this.supabase
        .from("accounts")
        .select("subscription_tier, subscription_status")
        .eq("id", accountId)
        .single();

      if (
        !account ||
        account.subscription_status !== SubscriptionStatus.ACTIVE
      ) {
        throw new Error("No active subscription found");
      }

      const plan = SUBSCRIPTION_PLANS[account.subscription_tier];
      if (!plan) {
        throw new Error("Invalid subscription plan");
      }

      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful payment
      const paymentSuccess = await this.simulatePayment(accountId, plan.price);

      if (paymentSuccess) {
        // Update subscription end date (extend by 30 days)
        const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await this.supabase
          .from("accounts")
          .update({
            subscription_end_date: newEndDate.toISOString(),
          })
          .eq("id", accountId);

        // Record payment history
        await this.supabase.from("subscription_history").insert({
          account_id: accountId,
          tier: account.subscription_tier as SubscriptionTier,
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date().toISOString(),
          payment_method: "stripe",
          amount_paid: plan.price / 100,
          change_reason: "Monthly payment processed",
          notes: `Monthly payment for ${plan.name}`,
        });

        return {
          success: true,
          message: "Monthly payment processed successfully",
          nextBillingDate: newEndDate,
        };
      } else {
        // Payment failed
        await this.handlePaymentFailure(accountId);
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing monthly payment:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(accountId: string, reason?: string) {
    try {
      // Update subscription status to cancelled
      await this.supabase
        .from("accounts")
        .update({
          subscription_status: SubscriptionStatus.CANCELLED,
          subscription_end_date: new Date().toISOString(),
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
        notes: reason || "Cancelled by user",
      });

      return {
        success: true,
        message: "Subscription cancelled successfully",
      };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  /**
   * Check subscription status
   */
  async getSubscriptionStatus(accountId: string) {
    try {
      const { data: account } = await this.supabase
        .from("accounts")
        .select(
          `
          subscription_tier,
          subscription_status,
          subscription_start_date,
          subscription_end_date
        `
        )
        .eq("id", accountId)
        .single();

      if (!account) {
        return {
          hasSubscription: false,
          isActive: false,
          details: null,
        };
      }

      const isActive =
        account.subscription_status === SubscriptionStatus.ACTIVE &&
        (!account.subscription_end_date ||
          new Date(account.subscription_end_date) > new Date());

      return {
        hasSubscription: true,
        isActive,
        details: {
          tier: account.subscription_tier,
          status: account.subscription_status,
          startDate: account.subscription_start_date,
          endDate: account.subscription_end_date,
          plan: SUBSCRIPTION_PLANS[account.subscription_tier],
        },
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return {
        hasSubscription: false,
        isActive: false,
        details: null,
      };
    }
  }

  /**
   * Get all available plans
   */
  getAvailablePlans(): SubscriptionPlan[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }

  /**
   * Simulate payment processing (replace with actual payment processor)
   */
  private async simulatePayment(
    accountId: string,
    amount: number
  ): Promise<boolean> {
    // This is a placeholder - replace with actual payment processing
    // For example, using Stripe, PayPal, or other payment processors

    // Simulate 95% success rate
    return Math.random() > 0.05;
  }

  /**
   * Handle payment failure
   */
  private async handlePaymentFailure(accountId: string) {
    try {
      // Update subscription status to failed
      await this.supabase
        .from("accounts")
        .update({
          subscription_status: SubscriptionStatus.EXPIRED,
        })
        .eq("id", accountId);

      // Record failure history
      await this.supabase.from("subscription_history").insert({
        account_id: accountId,
        tier: SubscriptionTier.TIER1, // Will be updated with actual tier
        status: SubscriptionStatus.EXPIRED,
        start_date: new Date().toISOString(),
        payment_method: "stripe",
        amount_paid: 0,
        change_reason: "Payment failed",
        notes: "Monthly payment failed",
      });
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
