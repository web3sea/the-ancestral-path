import React, { useState, useEffect, useCallback } from "react";
import { useSubscriptionStatus } from "../hook/useSubscriptionStatus";

interface SubscriptionRenewalReminderProps {
  onUpdatePaymentMethod?: () => void;
}

export function SubscriptionRenewalReminder({
  onUpdatePaymentMethod,
}: SubscriptionRenewalReminderProps) {
  const { data, isActive, daysUntilExpiry, checkRenewal } =
    useSubscriptionStatus();
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCheckRenewal = useCallback(async () => {
    try {
      setChecking(true);
      const result = await checkRenewal();

      if (result.success && result.renewed) {
        // Subscription was renewed
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error("Error checking renewal:", error);
    } finally {
      setChecking(false);
    }
  }, [checkRenewal]);

  // Auto-check renewal when subscription is close to expiry
  useEffect(() => {
    if (daysUntilExpiry !== null && daysUntilExpiry <= 3 && isActive) {
      const interval = setInterval(() => {
        handleCheckRenewal();
      }, 30 * 60 * 1000); // Check every 30 minutes

      return () => clearInterval(interval);
    }
  }, [daysUntilExpiry, isActive, handleCheckRenewal]);

  if (!isActive || !data?.subscription_end_date || daysUntilExpiry === null) {
    return null;
  }

  // Only show reminder if subscription expires within 7 days
  if (daysUntilExpiry > 7) {
    return null;
  }

  const getReminderMessage = () => {
    if (daysUntilExpiry <= 1) {
      return `Your subscription expires today! Please ensure your original payment method is up to date.`;
    }
    if (daysUntilExpiry <= 3) {
      return `Your subscription expires in ${daysUntilExpiry} days. Please check your original payment method.`;
    }
    return `Your subscription expires in ${daysUntilExpiry} days.`;
  };

  const getProgressPercent = () => {
    const totalDays = 30; // Assuming monthly subscription
    const remainingDays = Math.max(0, daysUntilExpiry);
    return ((totalDays - remainingDays) / totalDays) * 100;
  };

  const getAlertClasses = () => {
    if (daysUntilExpiry <= 1) return "bg-red-50 border-red-200 text-red-800";
    if (daysUntilExpiry <= 3)
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-blue-50 border-blue-200 text-blue-800";
  };

  const getProgressColor = () => {
    if (daysUntilExpiry <= 1) return "bg-red-500";
    if (daysUntilExpiry <= 3) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="rounded-lg p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Subscription Renewal</span>
          </div>
          {lastChecked && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className={`border rounded-lg p-3 ${getAlertClasses()}`}>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                daysUntilExpiry <= 1
                  ? "bg-red-500"
                  : daysUntilExpiry <= 3
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            ></div>
            <span className="font-medium">{getReminderMessage()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subscription Progress</span>
            <span>{daysUntilExpiry} days remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor()}`}
              style={{ width: `${getProgressPercent()}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCheckRenewal}
            disabled={checking}
            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
          >
            {checking ? "Checking..." : "Check Renewal Status"}
          </button>

          {onUpdatePaymentMethod && (
            <button
              onClick={onUpdatePaymentMethod}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
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
              Update Payment
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          <p>
            <strong>Next billing date:</strong>{" "}
            {new Date(data.subscription_end_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Plan:</strong>{" "}
            {data.subscription_tier?.toUpperCase() || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
