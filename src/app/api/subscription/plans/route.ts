import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";

// Subscription plans configuration
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in cents
  features: string[];
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  tier1: {
    id: "tier1",
    name: "Tier 1",
    price: 2900, // $29.00
    description: "Essential wellness features",
    features: [
      "Guided breathwork sessions",
      "Basic meditation practices",
      "Oracle guidance",
      "Email support",
    ],
  },
  tier2: {
    id: "tier2",
    name: "Tier 2",
    price: 3900, // $39.00
    description: "Complete wellness experience",
    features: [
      "Everything in Tier 1",
      "Advanced oracle AI",
      "Astrological insights",
      "Group workshops",
      "Priority support",
    ],
  },
};

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all available plans
    const plans = Object.values(SUBSCRIPTION_PLANS);

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to get subscription plans" },
      { status: 500 }
    );
  }
}
