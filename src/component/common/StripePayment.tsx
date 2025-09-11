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

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripePaymentProps {
  clientSecret: string;
  planName: string;
  planPrice: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  clientSecret,
  planName,
  planPrice,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (err) {
      onError("An unexpected error occurred: " + err);
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
        className="w-full bg-primary-300 text-black hover:bg-primary-200 py-4 text-lg font-semibold rounded-full flex items-center justify-center gap-3"
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

      <div className="flex items-center gap-3 text-sm text-primary-300/70">
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
        colorPrimary: "#fbbf24",
        colorBackground: "#1a1a1a",
        colorText: "#fbbf24",
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
        clientSecret={clientSecret}
        planName={planName}
        planPrice={planPrice}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
