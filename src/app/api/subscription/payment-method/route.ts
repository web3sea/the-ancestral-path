import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(request: NextRequest) {
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
      return NextResponse.json({
        success: true,
        hasPaymentMethod: false,
        message: "No payment method found",
      });
    }

    try {
      // Get customer's default payment method
      const customer = await stripe.customers.retrieve(
        account.stripe_customer_id
      );

      let defaultPaymentMethod = null;
      if (
        customer &&
        typeof customer === "object" &&
        !customer.deleted &&
        customer.default_source
      ) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          customer.default_source as string
        );
        defaultPaymentMethod = {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card
            ? {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                exp_month: paymentMethod.card.exp_month,
                exp_year: paymentMethod.card.exp_year,
              }
            : null,
        };
      }

      // If no default source, get the first payment method
      if (!defaultPaymentMethod) {
        const paymentMethods = await stripe.paymentMethods.list({
          customer: account.stripe_customer_id,
          type: "card",
          limit: 1,
        });

        if (paymentMethods.data.length > 0) {
          const paymentMethod = paymentMethods.data[0];
          defaultPaymentMethod = {
            id: paymentMethod.id,
            type: paymentMethod.type,
            card: paymentMethod.card
              ? {
                  brand: paymentMethod.card.brand,
                  last4: paymentMethod.card.last4,
                  exp_month: paymentMethod.card.exp_month,
                  exp_year: paymentMethod.card.exp_year,
                }
              : null,
          };
        }
      }

      return NextResponse.json({
        success: true,
        hasPaymentMethod: !!defaultPaymentMethod,
        paymentMethod: defaultPaymentMethod,
        message: defaultPaymentMethod
          ? "Payment method found"
          : "No payment method found",
      });
    } catch (stripeError) {
      console.error(
        "Error retrieving payment method from Stripe:",
        stripeError
      );
      return NextResponse.json({
        success: false,
        error: "Failed to retrieve payment method",
      });
    }
  } catch (error) {
    console.error("Error getting payment method:", error);
    return NextResponse.json(
      {
        error: "Failed to get payment method",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
