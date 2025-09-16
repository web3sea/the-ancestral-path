"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripePublishableKey!);

interface StripePaymentProps {
  clientSecret: string;
  planName: string;
  planPrice: number;
  onSuccess: (paymentIntent: { id: string; client_secret?: string }) => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  planName,
  planPrice,
  onSuccess,
  onError,
}: Omit<StripePaymentProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe is not loaded. Please refresh the page and try again.");
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        onError(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent as { id: string; client_secret?: string });
      } else {
        onError("Payment was not completed. Please try again.");
      }
    } catch (err) {
      console.error("Payment exception:", err);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary-300/5 border border-primary-300/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary-300">
            Payment Details
          </h3>
          <div className="flex items-center gap-2 text-primary-300/70">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Secure Payment</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-primary-300/10 rounded-lg">
            <span className="text-primary-300/80">Plan</span>
            <span className="font-medium text-primary-300">{planName}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary-300/10 rounded-lg">
            <span className="text-primary-300/80">Amount</span>
            <span className="font-bold text-primary-300">
              ${(planPrice / 100).toFixed(2)}/month
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-primary-300/20 rounded-2xl p-6">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="group relative px-12 py-4 bg-primary-300/10 text-black rounded-full font-semibold text-lg hover:bg-primary-300/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </>
        )}
      </button>

      <div className="flex items-center justify-center w-full gap-3 text-sm text-primary-300/70">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
}

export function StripePayment({
  clientSecret,
  planName,
  planPrice,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#d8d2c6",
        colorBackground: "#1a1a1a",
        colorText: "#d8d2c6",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        planName={planName}
        planPrice={planPrice}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
