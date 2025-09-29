"use client";

import { useState } from "react";
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { useSubscriptionStatus } from "@/component/hook/useSubscriptionStatus";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { SubscriptionHistory } from "./SubscriptionHistory";
import { useToast } from "@/component/common/Toast";
import { useConfirm } from "@/component/common/ConfirmDialog";
import { UpdatePaymentMethodModal } from "@/component/common/UpdatePaymentMethodModal";

export function SubscriptionSettings() {
  const {
    data: subscription,
    loading,
    refreshSubscription,
  } = useSubscriptionStatus();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpdatePaymentMethod, setShowUpdatePaymentMethod] = useState(false);
  const { success, error } = useToast();
  const { confirm } = useConfirm();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <CheckCircle className="h-5 w-5 text-sage" />;
      case SubscriptionStatus.EXPIRED:
        return <XCircle className="h-5 w-5 text-red-400" />;
      case SubscriptionStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case SubscriptionStatus.PAUSED:
        return <AlertCircle className="h-5 w-5 text-gold" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return "text-sage bg-sage/10 border-sage/20";
      case SubscriptionStatus.EXPIRED:
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case SubscriptionStatus.CANCELLED:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      case SubscriptionStatus.PAUSED:
        return "text-gold bg-gold/10 border-gold/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatTierName = (tier: string) => {
    switch (tier) {
      case SubscriptionTier.TIER1:
        return "Basic Plan";
      case SubscriptionTier.TIER2:
        return "Premium Plan";
      default:
        return "No Plan";
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = await confirm({
      title: "Cancel Subscription",
      message:
        "Are you sure you want to cancel your subscription? This action cannot be undone.",
      confirmText: "Cancel Subscription",
      cancelText: "Keep Subscription",
      type: "danger",
    });

    if (!confirmed) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Subscription Cancelled",
          "Your subscription has been cancelled successfully"
        );
        await refreshSubscription();
      } else {
        error(
          "Cancellation Failed",
          result.message || "Failed to cancel subscription"
        );
      }
    } catch {
      error(
        "Cancellation Error",
        "An error occurred while cancelling your subscription"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
        <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
          Subscription Settings
        </h2>
      </div>

      {subscription ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Current Subscription Status */}
          <div className="bg-black/30 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-primary-300 mb-4 sm:mb-6">
              Current Subscription
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Plan
                </label>
                <p className="text-lg font-semibold text-primary-300 mt-1">
                  {formatTierName(subscription.subscription_tier || "")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Status
                </label>
                <div className="flex items-center mt-1">
                  {getStatusIcon(subscription.subscription_status || "")}
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      subscription.subscription_status || ""
                    )}`}
                  >
                    {(subscription.subscription_status || "")
                      .charAt(0)
                      .toUpperCase() +
                      (subscription.subscription_status || "").slice(1)}
                  </span>
                </div>
              </div>

              {subscription.subscription_start_date && (
                <div>
                  <label className="text-sm font-medium text-primary-300/70">
                    Start Date
                  </label>
                  <p className="text-primary-300 mt-1">
                    {new Date(
                      subscription.subscription_start_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {subscription.subscription_end_date && (
                <div>
                  <label className="text-sm font-medium text-primary-300/70">
                    End Date
                  </label>
                  <p className="text-primary-300 mt-1">
                    {new Date(
                      subscription.subscription_end_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              {/* Actions */}
              {subscription.subscription_status ===
                SubscriptionStatus.ACTIVE && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isUpdating}
                  className="btn-secondary col-span-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
              {(subscription.subscription_status ===
                SubscriptionStatus.EXPIRED ||
                (subscription.subscription_status ===
                  SubscriptionStatus.CANCELLED &&
                  subscription.subscription_end_date &&
                  new Date() >
                    new Date(subscription.subscription_end_date))) && (
                <button
                  onClick={() => (window.location.href = "/subscription")}
                  className="btn-secondary col-span-2 flex-1"
                >
                  Resubscribe
                </button>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-black/30 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-primary-300 mb-4 sm:mb-6">
              Payment Method
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary-300/70 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary-300">
                    Original Payment Method
                  </p>
                  <p className="text-sm text-primary-300/70">
                    Your first payment method is used for renewals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePaymentMethod(true)}
                className="btn-secondary text-sm w-full sm:w-auto"
              >
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Subscription History */}
          <div className="bg-black/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-primary-300">
                  Subscription History
                </h3>
                <p className="text-sm text-primary-300/70 mt-1">
                  View your complete subscription history and payment records.
                </p>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="btn-secondary text-sm"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {showHistory ? "Hide History" : "View History"}
                </span>
              </button>
            </div>

            {showHistory && (
              <div className="mt-4 border-t border-primary-300/20 pt-4">
                <SubscriptionHistory />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 text-primary-300/50 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-medium text-primary-300 mb-3">
            No Active Subscription
          </h3>
          <p className="text-sm sm:text-base text-primary-300/70 mb-4 sm:mb-6 px-4">
            You don&apos;t have an active subscription yet.
          </p>
          <button
            onClick={() => (window.location.href = "/subscription")}
            className="btn-primary w-full sm:w-auto"
          >
            Choose a Plan
          </button>
        </div>
      )}

      {/* Update Payment Method Modal */}
      <UpdatePaymentMethodModal
        isOpen={showUpdatePaymentMethod}
        onClose={() => setShowUpdatePaymentMethod(false)}
        onSuccess={() => {
          refreshSubscription();
        }}
      />
    </div>
  );
}
