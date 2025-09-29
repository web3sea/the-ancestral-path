"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getReferCodeFromStorage,
  removeReferCodeFromStorage,
} from "@/lib/utils/referCode";
import { toast } from "sonner";

export function useReferCode() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const referCode = getReferCodeFromStorage();

      if (referCode) {
        processReferCode(referCode, session.user.email);
      }
    }
  }, [status, session]);

  const processReferCode = async (referCode: string, email: string) => {
    try {
      const response = await fetch("/api/auth/activate-free-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: referCode }),
      });

      const result = await response.json();

      // Always remove referCode from storage after processing
      removeReferCodeFromStorage();

      if (response.ok) {
        console.log("Free trial processing result:", result);
        if (typeof window !== "undefined") {
          if (result.alreadyUsed || result.hasSubscription) {
            toast.info(result.message);
          } else {
            toast.success(result.message);
          }
        }
      } else {
        console.error("Error activating free trial:", result);
        if (typeof window !== "undefined") {
          toast.error(
            result.error || "Failed to activate free trial. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error calling activate-free-trial API:", error);
      removeReferCodeFromStorage();
      if (typeof window !== "undefined") {
        toast.error("Failed to activate free trial. Please try again.");
      }
    }
  };

  return {
    processReferCode,
  };
}
