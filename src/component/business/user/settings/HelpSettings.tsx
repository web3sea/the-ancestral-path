"use client";

import { HelpCircle, MessageCircle, FileText, Mail, Phone } from "lucide-react";

export function HelpSettings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-sage mr-3" />
        <h2 className="text-lg sm:text-xl font-semibold text-primary-300">
          Help & Support
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Contact Support */}
        <div className="glass-effect rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-primary-300 mb-4 sm:mb-6">
            Contact Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 cursor-pointer transition-colors">
              <MessageCircle className="h-8 w-8 text-sage mr-4" />
              <div>
                <p className="font-medium text-primary-300">Live Chat</p>
                <p className="text-sm text-primary-300/70">
                  Get instant help from our support team
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 cursor-pointer transition-colors">
              <Mail className="h-8 w-8 text-gold mr-4" />
              <div>
                <p className="font-medium text-primary-300">Email Support</p>
                <p className="text-sm text-primary-300/70">
                  Send us an email and we&apos;ll respond within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 cursor-pointer transition-colors">
              <Phone className="h-8 w-8 text-purple-400 mr-4" />
              <div>
                <p className="font-medium text-primary-300">Phone Support</p>
                <p className="text-sm text-primary-300/70">
                  Call us for immediate assistance
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 cursor-pointer transition-colors">
              <FileText className="h-8 w-8 text-orange-400 mr-4" />
              <div>
                <p className="font-medium text-primary-300">Submit Ticket</p>
                <p className="text-sm text-primary-300/70">
                  Create a support ticket for complex issues
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-medium text-primary-300 mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <h4 className="font-medium text-primary-300 mb-2">
                How do I cancel my subscription?
              </h4>
              <p className="text-sm text-primary-300/70">
                You can cancel your subscription anytime from the Subscription
                Settings page.
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <h4 className="font-medium text-primary-300 mb-2">
                How do I update my payment method?
              </h4>
              <p className="text-sm text-primary-300/70">
                Go to Subscription Settings and click &quot;Update Payment
                Method&quot; to change your payment information.
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <h4 className="font-medium text-primary-300 mb-2">
                What happens if my payment fails?
              </h4>
              <p className="text-sm text-primary-300/70">
                We&apos;ll automatically retry your payment using your original
                payment method. You&apos;ll receive notifications about any
                issues.
              </p>
            </div>

            <div className="p-4 bg-black/30 rounded-xl border border-primary-300/20">
              <h4 className="font-medium text-primary-300 mb-2">
                Can I change my subscription plan?
              </h4>
              <p className="text-sm text-primary-300/70">
                Yes, you can upgrade or downgrade your plan at any time from the
                Subscription Settings.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-medium text-primary-300 mb-6">
            Documentation
          </h3>

          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 transition-colors">
              <h4 className="font-medium text-primary-300">
                Getting Started Guide
              </h4>
              <p className="text-sm text-primary-300/70">
                Learn how to set up and use your subscription
              </p>
            </button>

            <button className="w-full text-left p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 transition-colors">
              <h4 className="font-medium text-primary-300">
                Billing & Payments
              </h4>
              <p className="text-sm text-primary-300/70">
                Everything you need to know about billing
              </p>
            </button>

            <button className="w-full text-left p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 transition-colors">
              <h4 className="font-medium text-primary-300">
                Account Management
              </h4>
              <p className="text-sm text-primary-300/70">
                Manage your account settings and preferences
              </p>
            </button>

            <button className="w-full text-left p-4 bg-black/30 rounded-xl border border-primary-300/20 hover:bg-black/40 transition-colors">
              <h4 className="font-medium text-primary-300">Troubleshooting</h4>
              <p className="text-sm text-primary-300/70">
                Common issues and their solutions
              </p>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-medium text-primary-300 mb-6">
            System Status
          </h3>

          <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-primary-300/20">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-sage rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-primary-300">
                  All Systems Operational
                </p>
                <p className="text-sm text-primary-300/70">
                  Last updated 2 minutes ago
                </p>
              </div>
            </div>
            <button className="btn-secondary text-sm">View Status Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}
