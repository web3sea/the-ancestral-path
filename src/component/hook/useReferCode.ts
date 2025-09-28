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
      const response = await fetch("/api/auth/process-refer-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referCode }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("ReferCode processed successfully:", result);
        removeReferCodeFromStorage();

        if (typeof window !== "undefined") {
          toast.success(
            "Congratulations! You have activated a free trial with refer code: " +
              referCode
          );
        }
      } else {
        console.error("Error processing referCode:", result);

        if (result.alreadyUsedTrial) {
          console.log("User already used a trial");
          removeReferCodeFromStorage();
        } else if (result.hasSubscription) {
          console.log("User already has a subscription");
          removeReferCodeFromStorage();
        }
      }
    } catch (error) {
      console.error("Error calling process-refer-code API:", error);
    }
  };

  return {
    processReferCode,
  };
}
