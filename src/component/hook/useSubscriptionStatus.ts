import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface SubscriptionData {
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

interface SubscriptionStatus {
  data: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  isExpired: boolean;
  isInGracePeriod: boolean;
  daysUntilExpiry: number | null;
  refreshSubscription: () => Promise<void>;
  checkRenewal: () => Promise<{
    success: boolean;
    renewed?: boolean;
    expired?: boolean;
    message: string;
  }>;
}

export function useSubscriptionStatus(): SubscriptionStatus {
  const { data: session, update } = useSession();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/subscription/status");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      const result = await response.json();
      setData(result.subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching subscription status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    await fetchSubscriptionStatus();
    // Also update the session to reflect any changes
    await update();
  }, [fetchSubscriptionStatus, update]);

  const checkRenewal = useCallback(async () => {
    try {
      const response = await fetch("/api/subscription/renew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check subscription renewal");
      }

      const result = await response.json();

      if (result.success && result.renewed) {
        // Subscription was renewed, refresh the data
        await refreshSubscription();
      }

      return result;
    } catch (err) {
      console.error("Error checking subscription renewal:", err);
      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }, [refreshSubscription]);

  const isActive = data?.subscription_status === "active";
  const isExpired = data?.subscription_status === "expired";

  const isInGracePeriod = useCallback(() => {
    if (!data?.subscription_end_date || !isExpired) return false;

    const endDate = new Date(data.subscription_end_date);
    const now = new Date();
    const daysSinceExpiry = Math.ceil(
      (now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceExpiry <= 7;
  }, [data?.subscription_end_date, isExpired]);

  const daysUntilExpiry = useCallback(() => {
    if (!data?.subscription_end_date) return null;

    const endDate = new Date(data.subscription_end_date);
    const now = new Date();
    const days = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return days;
  }, [data?.subscription_end_date]);

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptionStatus();
    }
  }, [session?.user, fetchSubscriptionStatus]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      fetchSubscriptionStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isActive, fetchSubscriptionStatus]);

  return {
    data,
    loading,
    error,
    isActive,
    isExpired,
    isInGracePeriod: isInGracePeriod(),
    daysUntilExpiry: daysUntilExpiry(),
    refreshSubscription,
    checkRenewal,
  };
}
