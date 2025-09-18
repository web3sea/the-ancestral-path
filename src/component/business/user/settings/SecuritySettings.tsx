"use client";

import { Shield, Key, Smartphone, Eye, EyeOff } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
        <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
          Security Settings
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Password */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <Key className="h-5 w-5 text-primary-300/70 mr-3" />
            <h3 className="text-base sm:text-lg font-medium text-primary-300">
              Password
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors pr-12"
                  placeholder="Enter current password"
                />
                <Eye className="absolute right-4 top-3.5 h-4 w-4 text-primary-300/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors pr-12"
                  placeholder="Enter new password"
                />
                <Eye className="absolute right-4 top-3.5 h-4 w-4 text-primary-300/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-300/70 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 placeholder-primary-300/50 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors pr-12"
                  placeholder="Confirm new password"
                />
                <Eye className="absolute right-4 top-3.5 h-4 w-4 text-primary-300/50" />
              </div>
            </div>
          </div>

          <button className="btn-primary mt-4 sm:mt-6 w-full sm:w-auto">
            Update Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <Smartphone className="h-5 w-5 text-primary-300/70 mr-3" />
            <h3 className="text-base sm:text-lg font-medium text-primary-300">
              Two-Factor Authentication
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary-300">Enable 2FA</p>
              <p className="text-sm text-primary-300/70">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="btn-primary w-full sm:w-auto">Enable 2FA</button>
          </div>
        </div>

        {/* Login Sessions */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-medium text-primary-300 mb-6">
            Active Sessions
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <div>
                <p className="text-sm font-medium text-primary-300">
                  Current Session
                </p>
                <p className="text-sm text-primary-300/70">
                  Chrome on Windows • Last active now
                </p>
              </div>
              <span className="text-xs text-sage bg-sage/10 px-3 py-1 rounded-full border border-sage/20">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <div>
                <p className="text-sm font-medium text-primary-300">
                  Mobile App
                </p>
                <p className="text-sm text-primary-300/70">
                  iOS App • Last active 2 hours ago
                </p>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-medium text-primary-300 mb-6">
            Privacy Settings
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300">
                  Profile Visibility
                </label>
                <p className="text-sm text-primary-300/70">
                  Control who can see your profile
                </p>
              </div>
              <select className="px-4 py-3 bg-black/50 border border-primary-300/20 rounded-xl text-primary-300 focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-colors">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-primary-300">
                  Data Sharing
                </label>
                <p className="text-sm text-primary-300/70">
                  Allow data sharing for service improvement
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-sage rounded focus:ring-sage/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
