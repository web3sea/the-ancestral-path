"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useSessionRefresh } from "@/component/common/useSessionRefresh";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const { refreshSession } = useSessionRefresh();

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );

    if (paymentIntent && paymentIntentClientSecret) {
      // Payment was successful, refresh the session
      refreshSession();
      setStatus("success");
      setMessage("Your subscription has been activated successfully!");
    } else {
      setStatus("error");
      setMessage(
        "Payment confirmation not found. Please check your subscription status."
      );
    }
  }, [searchParams, refreshSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-300/5 via-primary-300/3 to-primary-300/1 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-primary-300/5 border border-primary-300/20 rounded-3xl p-8 text-center backdrop-blur-sm">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-primary-300 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-primary-300 mb-4">
                Confirming Payment
              </h1>
              <p className="text-primary-300/70">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-primary-300 mb-4">
                Payment Successful!
              </h1>
              <p className="text-primary-300/70 mb-6">{message}</p>
              <Link
                href="/"
                className="inline-block bg-primary-300 text-black hover:bg-primary-200 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-primary-300 mb-4">
                Payment Issue
              </h1>
              <p className="text-primary-300/70 mb-6">{message}</p>
              <Link
                href="/"
                className="inline-block bg-primary-300 text-black hover:bg-primary-200 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
