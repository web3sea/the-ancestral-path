import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

// Client-side Stripe instance
export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY;
};

// Subscription plans based on AO Platform Architecture
export const STRIPE_PLANS = {
  tier1: {
    id: "tier1",
    name: "Tier 1",
    price: 2900, // $29.00 in cents
    interval: "month",
    features: [
      "All resources access",
      "Daily AO messaging (once per day only)",
      "Personal dashboard",
      "Guided breathwork sessions",
      "Basic meditation practices",
      "Oracle guidance",
      "Email support",
    ],
    description: "Essential wellness features with daily AO messaging",
  },
  tier2: {
    id: "tier2",
    name: "Tier 2",
    price: 3900, // $39.00 in cents
    interval: "month",
    features: [
      "Everything from Tier 1",
      "Voice calling capability",
      "Monthly Q&A sessions",
      "Advanced oracle AI",
      "Astrological insights",
      "Group workshops",
      "Priority support",
    ],
    description: "Complete wellness experience with voice calling",
  },
} as const;

export type StripePlanId = keyof typeof STRIPE_PLANS;
