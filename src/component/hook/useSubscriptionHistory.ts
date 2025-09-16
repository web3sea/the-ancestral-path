import { useState, useEffect } from "react";

interface SubscriptionHistoryEntry {
  id: string;
  account_id: string;
  tier: string;
  status: string;
  start_date: string;
  end_date?: string;
  payment_method: string;
  amount_paid: number;
  currency?: string;
  change_reason: string;
  notes?: string;
  created_at: string;
}

interface UseSubscriptionHistoryReturn {
  data: SubscriptionHistoryEntry[] | null;
  loading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
}

export function useSubscriptionHistory(): UseSubscriptionHistoryReturn {
  const [data, setData] = useState<SubscriptionHistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/subscription/history");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch subscription history");
      }

      if (result.success) {
        setData(result.history);
      } else {
        throw new Error(result.error || "Failed to fetch subscription history");
      }
    } catch (err) {
      console.error("Error fetching subscription history:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    data,
    loading,
    error,
    refreshHistory: fetchHistory,
  };
}
