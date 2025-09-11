import { createSupabaseAdmin } from "./admin";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { SubscriptionDataForRefresh } from "./types";

export class SubscriptionService {
  private supabase = createSupabaseAdmin();

  /**
   * Update subscription data using the database function
   */
  async updateSubscriptionData(
    accountId: string,
    subscriptionTier: SubscriptionTier,
    subscriptionStatus: SubscriptionStatus,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
    subscriptionStartDate?: string,
    subscriptionEndDate?: string
  ): Promise<boolean> {
    try {
      console.log("SubscriptionService.updateSubscriptionData called with:", {
        accountId,
        subscriptionTier,
        subscriptionStatus,
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStartDate,
        subscriptionEndDate,
      });

      const { data, error } = await this.supabase.rpc(
        "update_subscription_data",
        {
          p_account_id: accountId,
          p_subscription_tier: subscriptionTier,
          p_subscription_status: subscriptionStatus,
          p_stripe_customer_id: stripeCustomerId || null,
          p_stripe_subscription_id: stripeSubscriptionId || null,
          p_subscription_start_date: subscriptionStartDate || null,
          p_subscription_end_date: subscriptionEndDate || null,
        }
      );

      if (error) {
        console.error("Error updating subscription data:", error);
        return false;
      }

      console.log("Database function update_subscription_data result:", data);
      return data;
    } catch (error) {
      console.error("Error calling update_subscription_data function:", error);
      return false;
    }
  }

  /**
   * Get subscription data for session refresh
   */
  async getSubscriptionDataForRefresh(
    accountId: string
  ): Promise<SubscriptionDataForRefresh | null> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_subscription_data_for_refresh",
        {
          p_account_id: accountId,
        }
      );

      if (error) {
        console.error("Error getting subscription data for refresh:", error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error(
        "Error calling get_subscription_data_for_refresh function:",
        error
      );
      return null;
    }
  }

  /**
   * Check if user has valid subscription
   */
  async isValidSubscription(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc("is_valid_subscription", {
        p_email: email,
      });

      if (error) {
        console.error("Error checking subscription validity:", error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error("Error calling is_valid_subscription function:", error);
      return false;
    }
  }

  /**
   * Get user subscription data
   */
  async getUserSubscriptionData(email: string) {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_user_subscription_data",
        {
          p_email: email,
        }
      );

      if (error) {
        console.error("Error getting user subscription data:", error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error(
        "Error calling get_user_subscription_data function:",
        error
      );
      return null;
    }
  }

  /**
   * Create user account with proper defaults
   */
  async createUserAccount(
    name: string,
    email: string,
    phone?: string,
    authProvider: string = "google",
    authProviderId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.rpc("create_user_account", {
        p_name: name,
        p_email: email,
        p_phone: phone || null,
        p_auth_provider: authProvider,
        p_auth_provider_id: authProviderId || null,
        p_preferred_platform: "web",
        p_subscription_tier: null, // No subscription initially
        p_subscription_status: null, // No subscription initially
      });

      if (error) {
        console.error("Error creating user account:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error calling create_user_account function:", error);
      return null;
    }
  }
}

export const subscriptionService = new SubscriptionService();
