"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionUpdate() {
  const { update } = useSession();

  const updateSession = useCallback(async () => {
    try {
      console.log("Updating session...");
      // Trigger NextAuth session update
      await update();
      console.log("Session updated successfully");
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }, [update]);

  return { updateSession };
}
