"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/component/common/Toast";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripePublishableKey!);

interface UpdatePaymentMethodProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function UpdatePaymentForm({ onSuccess, onCancel }: UpdatePaymentMethodProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      error(
        "Stripe Error",
        "Stripe is not loaded. Please refresh the page and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Confirm setup intent to save payment method
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings`,
        },
        redirect: "if_required",
      });

      if (setupError) {
        console.error("Setup error:", setupError);
        error(
          "Payment Method Error",
          setupError.message || "Failed to save payment method"
        );
        return;
      }

      if (!setupIntent || !setupIntent.payment_method) {
        error("Payment Method Error", "No payment method saved");
        return;
      }

      // Update payment method on server
      const response = await fetch("/api/subscription/update-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: setupIntent.payment_method as string,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Payment Method Updated",
          "Your payment method has been updated successfully!"
        );
        onSuccess?.();
      } else {
        error(
          "Update Failed",
          result.error || "Failed to update payment method"
        );
      }
    } catch (err) {
      console.error("Update payment method exception:", err);
      error("Update Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary-300/70">
          <CreditCard className="w-4 h-4" />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 border border-primary-300/20 rounded-2xl p-6">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 group relative px-6 py-3 bg-sage/20 text-sage rounded-xl font-semibold hover:bg-sage/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating Payment Method...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Update Payment Method
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-black/30 text-primary-300 rounded-xl font-semibold hover:bg-white/5 transition-all duration-300 border border-primary-300/20"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex items-center justify-center w-full gap-3 text-sm text-primary-300/70">
        <CheckCircle className="w-4 h-4 text-sage" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
}

export function UpdatePaymentMethod({
  onSuccess,
  onCancel,
}: UpdatePaymentMethodProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const response = await fetch("/api/subscription/create-setup-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.success) {
          setClientSecret(result.clientSecret);
        } else {
          error(
            "Setup Error",
            result.error || "Failed to initialize payment form"
          );
        }
      } catch (err) {
        console.error("Error fetching setup intent:", err);
        error("Setup Error", "Failed to initialize payment form");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetupIntent();
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-sage" />
        <span className="ml-3 text-primary-300">
          Initializing payment form...
        </span>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-300/70">Failed to initialize payment form</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

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
      <UpdatePaymentForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
