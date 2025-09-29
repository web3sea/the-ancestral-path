import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { STRIPE_PLANS } from "@/lib/stripe/config";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    // Get user token to check if they've used free trial
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    let hasUsedFreeTrial = false;

    if (token?.accountId) {
      try {
        const supabase = createSupabaseAdmin();
        const { data: account } = await supabase
          .from("accounts")
          .select("free_trial_used")
          .eq("id", token.accountId)
          .single();

        hasUsedFreeTrial = account?.free_trial_used || false;
      } catch (error) {
        console.error("Error checking free trial status:", error);
        // Continue with showing all plans if we can't check
      }
    }

    // Convert STRIPE_PLANS to the format expected by the frontend
    const allPlans = Object.values(STRIPE_PLANS).map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      period: plan.id === "free_trial" ? "7 days" : plan.interval,
      features: plan.features,
      description: plan.description,
      popular: plan.id === "free_trial" && !hasUsedFreeTrial, // Free trial is popular only if not used
    }));

    // Filter out free trial if user has already used it
    const plans = hasUsedFreeTrial
      ? allPlans.filter((plan) => plan.id !== "free_trial")
      : allPlans;

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscription plans",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
