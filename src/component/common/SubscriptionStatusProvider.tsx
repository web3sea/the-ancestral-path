"use client";

import { useSession } from "next-auth/react";
import { useSessionRefresh } from "./useSessionRefresh";
import { useEffect, useRef } from "react";

interface SubscriptionStatusProviderProps {
  children: React.ReactNode;
}

export function SubscriptionStatusProvider({
  children,
}: SubscriptionStatusProviderProps) {
  const { data: session, status } = useSession();
  const { refreshSession } = useSessionRefresh();
  const lastRefreshTime = useRef<number>(0);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Refresh session every 30 seconds if user is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const refreshSessionData = async () => {
        const now = Date.now();
        // Only refresh if it's been more than 30 seconds since last refresh
        if (now - lastRefreshTime.current > 30000) {
          try {
            await refreshSession();
            lastRefreshTime.current = now;
          } catch (error) {
            console.error("Failed to refresh session:", error);
          }
        }
      };

      // Initial refresh
      refreshSessionData();

      // Set up interval for periodic refresh
      refreshInterval.current = setInterval(refreshSessionData, 30000);

      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
    }
  }, [status, session?.user, refreshSession]);

  // Listen for storage events (for cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "subscription-updated" && e.newValue) {
        // Another tab updated subscription, refresh our session
        refreshSession().catch(console.error);
        localStorage.removeItem("subscription-updated");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshSession]);

  return <>{children}</>;
}
