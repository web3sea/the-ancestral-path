"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );

    if (paymentIntent && paymentIntentClientSecret) {
      setStatus("success");
      setMessage("Your subscription has been activated successfully!");
    } else {
      setStatus("error");
      setMessage(
        "Payment confirmation not found. Please check your subscription status."
      );
    }
  }, [searchParams]);

  return (
    <div
      style={{
        backgroundImage: "url(/images/bg-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen bg-gradient-to-br from-primary-300/5 via-primary-300/3 to-primary-300/1 flex items-center justify-center p-4"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary-300/10 to-black/60" />

      <div className="max-w-md w-full">
        <div className="bg-primary-300/5 border border-primary-300/30 rounded-3xl p-8 text-center backdrop-blur-sm">
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
                className="flex items-center justify-center px-12 py-4 bg-primary-300/10 text-black rounded-full font-semibold text-lg hover:bg-primary-300/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
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
                className="flex items-center justify-center px-12 py-4 bg-primary-300/10 text-black rounded-full font-semibold text-lg hover:bg-primary-300/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
