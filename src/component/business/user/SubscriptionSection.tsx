"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Star,
  Loader2,
  Sparkles,
  Shield,
  Clock,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { StripePayment } from "@/component/common/StripePayment";
import { useSessionUpdate } from "@/component/common/useSessionUpdate";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "tier1",
    name: "Tier 1",
    price: 2900, // Price in cents for Stripe
    period: "month",
    features: [
      "All resources access",
      "Daily AO messaging (once per day only)",
      "Personal dashboard",
      "Guided breathwork sessions",
      "Basic meditation practices",
      "Oracle guidance",
      "Email support",
    ],
  },
  {
    id: "tier2",
    name: "Tier 2",
    price: 3900, // Price in cents for Stripe
    period: "month",
    features: [
      "Everything from Tier 1",
      "Voice calling capability",
      "Monthly Q&A sessions",
      "Advanced oracle AI",
      "Astrological insights",
      "Group workshops",
      "Priority support",
    ],
    popular: true,
  },
];

export function SubscriptionSection() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [showPayment, setShowPayment] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { updateSession } = useSessionUpdate();
  const router = useRouter();
  // Load plans from API
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await fetch("/api/subscription/plans");
        const data = await response.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error("Error loading plans:", error);
        // Fallback to hardcoded plans
        setPlans(PLANS);
      }
    };
    loadPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setError("");
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Please select a subscription plan");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.clientSecret) {
          // Set client secret and show payment form
          setClientSecret(data.clientSecret);
          setShowPayment(true);
        } else {
          setError("Payment form not available. Please try again.");
        }
      } else {
        setError(data.error || "Failed to create subscription");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: {
    id: string;
    client_secret?: string;
  }) => {
    try {
      console.log("Payment success - updating session and redirecting...");
      console.log("Payment intent data:", paymentIntent);

      // Update the session to reflect the new subscription
      try {
        await updateSession();
        console.log("Session updated successfully");
      } catch (error) {
        console.error("Error updating session:", error);
        // Continue anyway - session will update on next page load
      }

      // Wait a moment for session to propagate
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use the payment intent data from the API response
      const paymentIntentId = paymentIntent?.id || "";
      const paymentIntentClientSecret =
        paymentIntent?.client_secret || clientSecret;

      router.push(
        `/subscription/success?payment_intent=${paymentIntentId}&payment_intent_client_secret=${paymentIntentClientSecret}`
      );
    } catch (error) {
      console.error("Error after payment:", error);
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setShowPayment(false);
    setClientSecret("");
  };

  return (
    <div
      className="min-h-screen py-40 relative overflow-hidden"
      style={{
        backgroundImage: `url(/images/bg-image.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-primary-300/10 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-300/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary-300/5 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-300/15 rounded-full blur-lg animate-pulse delay-500" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary-300" />
            <span className="text-primary-300/80 text-sm font-medium">
              Transform Your Life
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-300 mb-6 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </h1>
          <p className="text-primary-300/70 text-xl max-w-3xl mx-auto leading-relaxed">
            Welcome to Sand Symes! Select a subscription plan to unlock your
            personalized wellness experience with guided practices, oracle
            guidance, and transformative content.
          </p>
        </motion.div>

        {!showPayment && !clientSecret && (
          <>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {plans.map((plan, index) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer flex flex-col transform hover:scale-105 hover:-translate-y-2 ${
                      isSelected
                        ? "border-primary-300 bg-gradient-to-br from-primary-300/20 via-primary-300/10 to-primary-300/5 shadow-2xl shadow-primary-300/20"
                        : "border-primary-300/20 bg-gradient-to-br from-primary-300/5 via-primary-300/3 to-primary-300/1 hover:border-primary-300/40 hover:bg-gradient-to-br hover:from-primary-300/10 hover:via-primary-300/5 hover:to-primary-300/2 hover:shadow-xl hover:shadow-primary-300/10"
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                    style={{
                      animationDelay: `${index * 200}ms`,
                    }}
                  >
                    {/* Enhanced Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-primary-300 to-primary-200 text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
                          <Star className="w-4 h-4 fill-current" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Enhanced Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-primary-300 mb-4 group-hover:text-primary-200 transition-colors">
                        {plan.name}
                      </h3>
                      <div className="mb-6">
                        <span className="text-5xl font-black text-primary-300 group-hover:text-primary-200 transition-colors">
                          ${(plan.price / 100).toFixed(0)}
                        </span>
                        <span className="text-primary-300/70 text-xl ml-2 font-medium">
                          /{plan.period}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-4 py-2">
                        <Clock className="w-4 h-4 text-primary-300/70" />
                        <span className="text-primary-300/70 text-sm font-medium">
                          Billed monthly, cancel anytime
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="space-y-5 mb-8 flex-1">
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 group/feature"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:bg-primary-300/30 transition-colors">
                            <CheckCircle className="w-4 h-4 text-primary-300" />
                          </div>
                          <span className="text-primary-300/80 group-hover/feature:text-primary-300 transition-colors leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Select Button */}
                    <div className="mt-auto">
                      <button
                        className={`w-full py-4 px-6 rounded-full font-medium text-lg transition-all duration-300 transform ${
                          isSelected
                            ? "btn-primary text-black border border-primary-300 shadow-lg hover:bg-primary-200"
                            : "btn-secondary hover:bg-white/10 hover:border-primary-300/50"
                        }`}
                        disabled={isLoading}
                      >
                        {isSelected ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Selected
                          </span>
                        ) : (
                          "Select Plan"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-center backdrop-blur-sm">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}
            {/* Enhanced Subscribe Button */}
            <div className="text-center">
              <button
                onClick={handleSubscribe}
                disabled={!selectedPlan || isLoading}
                className="group relative px-12 py-4 bg-primary-300/10 text-black rounded-full font-semibold text-lg hover:bg-primary-300/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Continue to Payment</span>
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Stripe Payment Form */}
        {showPayment && clientSecret && (
          <div className="mt-8 max-w-2xl mx-auto">
            <StripePayment
              clientSecret={clientSecret}
              planName={plans.find((p) => p.id === selectedPlan)?.name || ""}
              planPrice={plans.find((p) => p.id === selectedPlan)?.price || 0}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}

        {/* Show message if payment form should be visible but isn't */}
        {showPayment && !clientSecret && (
          <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">
              Payment form is ready but client secret is missing. Please try
              again.
            </p>
          </div>
        )}

        {/* Enhanced Additional Info */}
        <div className="mt-20 text-center">
          <div className="bg-primary-300/5 border border-primary-300/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-primary-300/70 text-lg mb-6 font-medium">
              Secure payment powered by Stripe • Cancel anytime • 30-day
              money-back guarantee
            </p>
            <div className="flex justify-center gap-12 text-sm text-primary-300/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <span>All major cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
