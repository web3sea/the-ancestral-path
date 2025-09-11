"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      const data = await response.json();

      if (data.success) {
        // Update the session with the new data
        await update({
          ...session,
          user: {
            ...session?.user,
            ...data.session,
          },
        });

        return data.session;
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
  }, [session, update]);

  return { refreshSession };
}
