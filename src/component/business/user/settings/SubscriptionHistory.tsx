"use client";

import { useState } from "react";
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useSubscriptionHistory } from "@/component/hook/useSubscriptionHistory";
import { SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import { useToast } from "@/component/common/Toast";

export function SubscriptionHistory() {
  const {
    data: history,
    loading,
    error,
    refreshHistory,
  } = useSubscriptionHistory();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { success, error: showError } = useToast();

  const formatTierName = (tier: string) => {
    switch (tier) {
      case SubscriptionTier.FREE_TRIAL:
        return "Free Trial";
      case SubscriptionTier.TIER1:
        return "Basic Plan";
      case SubscriptionTier.TIER2:
        return "Premium Plan";
      default:
        return tier;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshHistory();
      success("History Refreshed", "Subscription history has been updated");
    } catch {
      showError("Refresh Failed", "Failed to refresh subscription history");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-300 mb-2">
            Error Loading History
          </h3>
          <p className="text-primary-300/70 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary"
          >
            {isRefreshing ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
          <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
            Subscription History
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-secondary text-sm"
        >
          <span className="flex items-center gap-2">
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </span>
        </button>
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-primary-300/50 mx-auto mb-6" />
          <h3 className="text-lg sm:text-xl font-medium text-primary-300 mb-3">
            No History Found
          </h3>
          <p className="text-primary-300/70 mb-6">
            You don&apos;t have any subscription history yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-black/30 rounded-xl p-4 sm:p-6 border border-primary-300/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-semibold text-primary-300">
                      {formatTierName(entry.tier)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {entry.status.charAt(0).toUpperCase() +
                        entry.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-primary-300/70">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Started: {formatDate(entry.start_date)}</span>
                    </div>

                    {entry.end_date && (
                      <div className="flex items-center text-primary-300/70">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Ended: {formatDate(entry.end_date)}</span>
                      </div>
                    )}

                    <div className="flex items-center text-primary-300/70">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Payment: {entry.payment_method}</span>
                    </div>

                    {entry.amount_paid > 0 && (
                      <div className="flex items-center text-primary-300/70">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>
                          Amount:{" "}
                          {formatAmount(entry.amount_paid, entry.currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {entry.change_reason && (
                    <div className="mt-3">
                      <p className="text-sm text-primary-300/70">
                        <span className="font-medium">Reason:</span>{" "}
                        {entry.change_reason}
                      </p>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-primary-300/70">
                        <span className="font-medium">Notes:</span>{" "}
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-primary-300/50">
                  {formatDate(entry.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
