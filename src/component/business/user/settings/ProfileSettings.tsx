"use client";

import { User } from "lucide-react";

export function ProfileSettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <User className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
        <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
          Profile Settings
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Information */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-primary-300 mb-4 sm:mb-6">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors"
                placeholder="Enter your location"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-primary-300 mb-4 sm:mb-6">
            Preferences
          </h3>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <label className="text-sm font-medium text-primary-300">
                  Timezone
                </label>
                <p className="text-sm text-primary-300/70">
                  Set your preferred timezone
                </p>
              </div>
              <select className="px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors w-full sm:w-auto">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>GMT</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <label className="text-sm font-medium text-primary-300">
                  Language
                </label>
                <p className="text-sm text-primary-300/70">
                  Choose your preferred language
                </p>
              </div>
              <select className="px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors w-full sm:w-auto">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="btn-primary w-full sm:w-auto">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
