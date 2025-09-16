"use client";

import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

export function NotificationSettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
        <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
          Notification Settings
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Email Notifications */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <Mail className="h-5 w-5 text-primary-300/70 mr-3" />
            <h3 className="text-base sm:text-lg font-medium text-primary-300">
              Email Notifications
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Subscription Updates
                </label>
                <p className="text-sm text-primary-300/70">
                  Receive updates about your subscription
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-300 rounded"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Payment Reminders
                </label>
                <p className="text-sm text-primary-300/70">
                  Get notified before payments are due
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Service Updates
                </label>
                <p className="text-sm text-primary-300/70">
                  Important updates about our service
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <Smartphone className="h-5 w-5 text-primary-300/70 mr-3" />
            <h3 className="text-base sm:text-lg font-medium text-primary-300">
              SMS Notifications
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Payment Confirmations
                </label>
                <p className="text-sm text-primary-300/70">
                  Receive SMS when payments are processed
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  Security Alerts
                </label>
                <p className="text-sm text-primary-300/70">
                  Important security notifications
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                defaultChecked
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Notifications */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <MessageSquare className="h-5 w-5 text-primary-300/70 mr-3" />
            <h3 className="text-base sm:text-lg font-medium text-primary-300">
              WhatsApp Notifications
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300/70">
                  WhatsApp Updates
                </label>
                <p className="text-sm text-primary-300/70">
                  Receive updates via WhatsApp
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn-primary w-full sm:w-auto">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
