"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    try {
      await update();
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
