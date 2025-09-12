import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscriptionService } from "@/lib/supabase/subscription";
import { SubscriptionStatus, SubscriptionTier } from "@/@types/enum";
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

    // Get user's current subscription
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select(
        "subscription_tier, subscription_status, subscription_end_date, stripe_subscription_id"
      )
      .eq("id", token.accountId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Check if subscription is expired or about to expire
    const now = new Date();
    const endDate = account.subscription_end_date
      ? new Date(account.subscription_end_date)
      : null;
    const daysUntilExpiry = endDate
      ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    if (!endDate || daysUntilExpiry === null) {
      return NextResponse.json(
        { error: "No subscription end date found" },
        { status: 400 }
      );
    }

    // If subscription is already expired
    if (daysUntilExpiry <= 0) {
      return NextResponse.json({
        success: false,
        expired: true,
        message: "Subscription has expired",
        daysUntilExpiry: 0,
      });
    }

    // If subscription expires within 3 days, attempt renewal
    if (daysUntilExpiry <= 3 && account.stripe_subscription_id) {
      try {
        // Get the Stripe subscription
        const stripeSubscription = (await stripe.subscriptions.retrieve(
          account.stripe_subscription_id
        )) as unknown as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        };

        if (stripeSubscription.status === "active") {
          // Subscription is active in Stripe, update our database
          await subscriptionService.updateSubscriptionData(
            token.accountId,
            account.subscription_tier as SubscriptionTier,
            SubscriptionStatus.ACTIVE,
            stripeSubscription.customer as string,
            stripeSubscription.id,
            new Date(
              stripeSubscription.current_period_start * 1000
            ).toISOString(),
            new Date(stripeSubscription.current_period_end * 1000).toISOString()
          );

          return NextResponse.json({
            success: true,
            renewed: true,
            message: "Subscription renewed successfully",
            newEndDate: new Date(
              stripeSubscription.current_period_end * 1000
            ).toISOString(),
          });
        } else if (stripeSubscription.status === "past_due") {
          // Subscription is past due, try to collect payment
          try {
            await stripe.invoices.pay(
              stripeSubscription.latest_invoice as string
            );

            // Payment succeeded, update subscription
            const updatedSubscription = (await stripe.subscriptions.retrieve(
              account.stripe_subscription_id
            )) as unknown as Stripe.Subscription & {
              current_period_start: number;
              current_period_end: number;
            };
            await subscriptionService.updateSubscriptionData(
              token.accountId,
              account.subscription_tier as SubscriptionTier,
              SubscriptionStatus.ACTIVE,
              updatedSubscription.customer as string,
              updatedSubscription.id,
              new Date(
                updatedSubscription.current_period_start * 1000
              ).toISOString(),
              new Date(
                updatedSubscription.current_period_end * 1000
              ).toISOString()
            );

            return NextResponse.json({
              success: true,
              renewed: true,
              message: "Payment collected and subscription renewed",
              newEndDate: new Date(
                updatedSubscription.current_period_end * 1000
              ).toISOString(),
            });
          } catch (paymentError) {
            return NextResponse.json({
              success: false,
              paymentFailed: true,
              message: "Failed to collect payment",
              error:
                paymentError instanceof Error
                  ? paymentError.message
                  : "Unknown error",
            });
          }
        }
      } catch (stripeError) {
        console.error("Error checking Stripe subscription:", stripeError);
        return NextResponse.json({
          success: false,
          error: "Failed to check subscription status with Stripe",
        });
      }
    }

    // Subscription is still valid
    return NextResponse.json({
      success: true,
      valid: true,
      message: "Subscription is still valid",
      daysUntilExpiry,
      endDate: endDate.toISOString(),
    });
  } catch (error) {
    console.error("Error checking subscription renewal:", error);
    return NextResponse.json(
      {
        error: "Failed to check subscription renewal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
