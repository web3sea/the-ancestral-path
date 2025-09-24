"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface SubscriptionData {
  success: boolean;
  hasSubscription: boolean;
  isActive: boolean;
  subscription: unknown;
  details: unknown;
  _mock?: boolean;
  _message?: string;
}

interface SubscriptionContextType {
  subscriptionData: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  lastUpdated: Date | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { data: session, status } = useSession();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSubscriptionData = async () => {
    if (!session) {
      setSubscriptionData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/status");

      if (!response.ok) {
        if (response.status === 500) {
          // For development, allow access if database is not configured
          const errorData = await response.json().catch(() => ({}));
          if (errorData._mock) {
            setSubscriptionData({
              success: true,
              hasSubscription: false,
              isActive: false,
              subscription: null,
              details: null,
              _mock: true,
              _message: "Database not configured - using mock response",
            });
            setLastUpdated(new Date());
            return;
          }
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptionData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      // For development, set mock data on error
      setSubscriptionData({
        success: true,
        hasSubscription: false,
        isActive: false,
        subscription: null,
        details: null,
        _mock: true,
        _message: "Network error - using mock response",
      });
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscriptionData();
  };

  // Fetch subscription data when session changes
  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchSubscriptionData();
    } else if (status === "unauthenticated") {
      setSubscriptionData(null);
      setLastUpdated(null);
    }
  }, [session, status]);

  // Auto-refresh subscription data every 5 minutes
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetchSubscriptionData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [session]);

  const contextValue: SubscriptionContextType = {
    subscriptionData,
    isLoading,
    error,
    refreshSubscription,
    lastUpdated,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}
