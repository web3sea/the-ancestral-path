import React from "react";
import { useSubscriptionStatus } from "../hook/useSubscriptionStatus";

interface SubscriptionStatusDashboardProps {
  onUpdatePaymentMethod?: () => void;
  onManageSubscription?: () => void;
}

export function SubscriptionStatusDashboard({
  onUpdatePaymentMethod,
  onManageSubscription,
}: SubscriptionStatusDashboardProps) {
  const {
    data,
    loading,
    error,
    isActive,
    isExpired,
    isInGracePeriod,
    daysUntilExpiry,
    refreshSubscription,
  } = useSubscriptionStatus();

  const getStatusColor = () => {
    if (isExpired && !isInGracePeriod)
      return "bg-red-100 text-red-800 border-red-200";
    if (isInGracePeriod)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (isActive) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = () => {
    if (isExpired && !isInGracePeriod) return "Expired";
    if (isInGracePeriod) return "Grace Period";
    if (isActive) return "Active";
    return "Unknown";
  };

  const getStatusIcon = () => {
    if (isExpired && !isInGracePeriod) return "❌";
    if (isInGracePeriod) return "⚠️";
    if (isActive) return "✅";
    return "❓";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleRefresh = async () => {
    await refreshSubscription();
  };

  if (loading) {
    return (
      <div className="bg-black">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">
              Error Loading Subscription
            </span>
          </div>
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-black">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-800">
              No Subscription Found
            </span>
          </div>
          <p className="text-blue-700 text-sm">
            You don&apos;t have an active subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Subscription Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-primary-300 mb-1">Status</div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}
            >
              <span>{getStatusIcon()}</span>
              {getStatusText()}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-primary-300 mb-1">Plan</div>
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-gray-600"
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
              <span className="font-medium">
                {data.subscription_tier?.toUpperCase() || "Unknown"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Days Remaining</div>
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-gray-600"
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
              <span
                className={`font-medium ${
                  daysUntilExpiry && daysUntilExpiry <= 7
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {daysUntilExpiry || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-black">
          <h4 className="font-semibold mb-4">Subscription Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-3">Billing Information</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-primary-300">Start Date:</span>{" "}
                  <span>{formatDate(data.subscription_start_date)}</span>
                </div>
                <div>
                  <span className="text-primary-300">End Date:</span>{" "}
                  <span>{formatDate(data.subscription_end_date)}</span>
                </div>
                <div>
                  <span className="text-primary-300">Stripe ID:</span>{" "}
                  <span>{data.stripe_subscription_id || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
