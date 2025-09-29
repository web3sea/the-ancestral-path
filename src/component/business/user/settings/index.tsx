"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { SubscriptionSettings } from "./SubscriptionSettings";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const settingsTabs: SettingsTab[] = [
  {
    id: "subscription",
    label: "Subscription",
    icon: CreditCard,
    component: SubscriptionSettings,
  },
  // {
  //   id: "profile",
  //   label: "Profile",
  //   icon: User,
  //   component: ProfileSettings,
  // },
  // {
  //   id: "notifications",
  //   label: "Notifications",
  //   icon: Bell,
  //   component: NotificationSettings,
  // },
  // {
  //   id: "security",
  //   label: "Security",
  //   icon: Shield,
  //   component: SecuritySettings,
  // },
  // {
  //   id: "help",
  //   label: "Help & Support",
  //   icon: HelpCircle,
  //   component: HelpSettings,
  // },
];

export function SettingsSection() {
  const [activeTab, setActiveTab] = useState("subscription");

  const ActiveComponent =
    settingsTabs.find((tab) => tab.id === activeTab)?.component ||
    SubscriptionSettings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-300">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-primary-300/70 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() =>
            setActiveTab(activeTab === "menu" ? "subscription" : "menu")
          }
          className="w-full flex items-center justify-between px-4 py-3 bg-black/30 border border-primary-300/20 rounded-xl text-primary-300"
        >
          <span className="flex items-center">
            <CreditCard className="h-5 w-5 mr-3" />
            {settingsTabs.find((tab) => tab.id === activeTab)?.label ||
              "Subscription"}
          </span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Mobile Dropdown */}
        {activeTab === "menu" && (
          <div className="mt-2 space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-primary-300/70 hover:bg-white/5 hover:text-primary-300 border border-transparent"
                >
                  <Icon className="mr-3 h-5 w-5 text-primary-300/50" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <nav className="space-y-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-sage/20 text-sage border border-sage/30"
                      : "text-primary-300/70 hover:bg-white/5 hover:text-primary-300 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-sage" : "text-primary-300/50"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="glass-effect rounded-xl lg:rounded-2xl border border-primary-300/20">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
