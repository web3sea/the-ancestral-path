"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    try {
      console.log("Refreshing session...");

      // Simple session update without complex triggers
      await update();
      console.log("Session updated successfully");
    } catch (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
  }, [update]);

  return {
    session,
    refreshSession,
  };
}
