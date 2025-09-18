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

    const { paymentMethodId } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Get user's Stripe customer ID
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("stripe_customer_id, stripe_subscription_id")
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
      // Update the customer's default payment method for invoices
      await stripe.customers.update(account.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // If user has an active subscription, update it to use the new payment method
      if (account.stripe_subscription_id) {
        await stripe.subscriptions.update(account.stripe_subscription_id, {
          default_payment_method: paymentMethodId,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Payment method updated successfully",
      });
    } catch (stripeError) {
      console.error("Stripe error updating payment method:", stripeError);
      return NextResponse.json(
        { error: "Failed to update payment method" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    );
  }
}
