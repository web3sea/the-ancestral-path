import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub || !token?.accountId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Get user's Stripe customer ID
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("stripe_customer_id")
      .eq("id", token.accountId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    try {
      // Create setup intent for saving payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: account.stripe_customer_id,
        payment_method_types: ["card"],
        usage: "off_session", // For future payments
        metadata: {
          accountId: token.accountId,
        },
      });

      return NextResponse.json({
        success: true,
        clientSecret: setupIntent.client_secret,
      });
    } catch (stripeError) {
      console.error("Stripe error creating setup intent:", stripeError);
      return NextResponse.json(
        { error: "Failed to create setup intent" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return NextResponse.json(
      { error: "Failed to create setup intent" },
      { status: 500 }
    );
  }
}
