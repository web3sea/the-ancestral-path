import React, { useState } from "react";
import { useSubscriptionStatus } from "../hook/useSubscriptionStatus";

interface PaymentFailureNotificationProps {
  visible: boolean;
  onClose: () => void;
  onUpdatePaymentMethod: () => void;
}

export function PaymentFailureNotification({
  visible,
  onClose,
  onUpdatePaymentMethod,
}: PaymentFailureNotificationProps) {
  const { data, refreshSubscription } = useSubscriptionStatus();
  const [updating, setUpdating] = useState(false);

  const handleRetryPayment = async () => {
    try {
      setUpdating(true);
      const result = await fetch("/api/subscription/renew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();

      if (data.success && data.renewed) {
        alert(
          "Payment processed successfully using your original payment method! Your subscription has been renewed."
        );
        await refreshSubscription();
        onClose();
      } else if (data.paymentFailed) {
        alert(
          "Payment failed using your original payment method. Please update your payment method."
        );
        onUpdatePaymentMethod();
      } else {
        alert(data.message || "Unable to process payment at this time.");
      }
    } catch {
      alert("Failed to retry payment. Please try again later.");
    } finally {
      setUpdating(false);
    }
  };

  const getGracePeriodInfo = () => {
    if (!data?.subscription_end_date) return null;

    const endDate = new Date(data.subscription_end_date);
    const now = new Date();
    const daysSinceExpiry = Math.ceil(
      (now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const gracePeriodDays = 7;
    const remainingGraceDays = Math.max(0, gracePeriodDays - daysSinceExpiry);

    return {
      daysSinceExpiry,
      remainingGraceDays,
      gracePeriodEnd: new Date(
        endDate.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000
      ),
    };
  };

  const graceInfo = getGracePeriodInfo();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">!</span>
          </div>
          <h3 className="text-lg font-semibold">Payment Failed</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">Payment Issue</span>
            </div>
            <p className="text-yellow-700 text-sm">
              We were unable to process your monthly subscription payment using
              your original payment method. Your subscription is currently in a
              grace period.
            </p>
          </div>

          {graceInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Grace Period Status</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Days since expiry:</span>{" "}
                  {graceInfo.daysSinceExpiry}
                </div>
                <div>
                  <span className="font-medium">Grace period remaining:</span>{" "}
                  {graceInfo.remainingGraceDays} days
                </div>
                <div>
                  <span className="font-medium">Grace period ends:</span>{" "}
                  {graceInfo.gracePeriodEnd.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gray-600">
              To continue using our service, please update your payment method
              or retry the payment using your original payment method.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onUpdatePaymentMethod}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
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
                Update Payment Method
              </button>

              <button
                onClick={handleRetryPayment}
                disabled={updating}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {updating
                  ? "Retrying with Original Payment Method..."
                  : "Retry with Original Payment Method"}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>
              <strong>What happens next?</strong>
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>
                We&apos;ll automatically retry your payment using your original
                payment method
              </li>
              <li>You have 7 days to resolve the payment issue</li>
              <li>
                Your subscription will be suspended if payment isn&apos;t
                resolved
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
