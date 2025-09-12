"use client";

import React, { useState, useEffect } from "react";
import { useSubscriptionStatus } from "@/component/hook/useSubscriptionStatus";
import { SubscriptionStatusDashboard } from "@/component/common/SubscriptionStatusDashboard";
import { SubscriptionRenewalReminder } from "@/component/common/SubscriptionRenewalReminder";
import { UpdatePaymentMethod } from "@/component/common/UpdatePaymentMethod";
import { useRouter } from "next/navigation";

interface SubscriptionManagerProps {
  className?: string;
}

export function SubscriptionManager({ className }: SubscriptionManagerProps) {
  const router = useRouter();
  const { isExpired, isInGracePeriod, daysUntilExpiry } =
    useSubscriptionStatus();
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (
      isInGracePeriod ||
      (isExpired && daysUntilExpiry !== null && daysUntilExpiry <= 0)
    ) {
      setShowPaymentMethodModal(true);
      setActiveTab("payment");
    }
  }, [isInGracePeriod, isExpired, daysUntilExpiry]);

  const handlePaymentMethodSuccess = () => {
    setShowPaymentMethodModal(false);
    router.refresh();
  };

  const handleManageSubscription = () => {
    alert("Subscription management features coming soon!");
  };

  const tabItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: (
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
            d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z"
          />
        </svg>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <SubscriptionStatusDashboard
            onUpdatePaymentMethod={() => setShowPaymentMethodModal(true)}
            onManageSubscription={handleManageSubscription}
          />
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <SubscriptionRenewalReminder
              onUpdatePaymentMethod={() => setShowPaymentMethodModal(true)}
            />

            <div>
              <h4 className="font-semibold mb-4">Notification Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Payment Reminders</h5>
                    <p className="text-sm text-gray-600">
                      Get notified before your subscription expires
                    </p>
                  </div>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Payment Failures</h5>
                    <p className="text-sm text-gray-600">
                      Get notified when payments fail
                    </p>
                  </div>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Renewal Confirmations</h5>
                    <p className="text-sm text-gray-600">
                      Get notified when payments are successful
                    </p>
                  </div>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Subscription Management</h2>
        <p className="text-gray-600">
          Manage your subscription, payment methods, and billing preferences.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-primary-300/20 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
