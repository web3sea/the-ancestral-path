import React, { useState } from "react";
import { StripePayment } from "./StripePayment";

interface UpdatePaymentMethodProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdatePaymentMethod({
  visible,
  onClose,
  onSuccess,
}: UpdatePaymentMethodProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetupPaymentMethod = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a setup intent for updating payment method
      const response = await fetch("/api/subscription/update-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to setup payment method update");
      }

      const result = await response.json();
      setClientSecret(result.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      alert("Failed to setup payment method update");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    alert("Payment method updated successfully!");
    onSuccess?.();
    onClose();
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment method update failed: ${error}`);
  };

  const handleCancel = () => {
    setClientSecret(null);
    setError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold">Update Payment Method</h3>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-800">Error</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!clientSecret ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div>
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold mb-2">
                    Update Your Payment Method
                  </h4>
                  <p className="text-gray-600">
                    Click the button below to securely update your payment
                    method for your subscription.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">
                  Enter New Payment Details
                </h4>
                <p className="text-sm text-gray-600">
                  Your payment method will be updated securely through Stripe.
                </p>
              </div>

              <StripePayment
                clientSecret={clientSecret}
                planName="Payment Method Update"
                planPrice={0}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            <p>
              <strong>Security:</strong> Your payment information is processed
              securely by Stripe and never stored on our servers.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
