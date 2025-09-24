"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/component/provider/SubscriptionContext";

interface SubscriptionRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionRequired({
  children,
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-300 mb-4">
          Subscription Required
        </h1>
        <p className="text-primary-300/70 mb-6">
          Please subscribe to access this content.
        </p>
        <a
          href="/pricing"
          className="px-6 py-3 bg-primary-300 text-black rounded-full font-semibold hover:bg-primary-300/80 transition-colors"
        >
          View Pricing
        </a>
      </div>
    </div>
  ),
}: SubscriptionRequiredProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { subscriptionData, isLoading } = useSubscription();

  // Handle loading states
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
          <p className="text-primary-300/70">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  // Handle authentication
  if (!session) {
    router.push("/login");
    return null;
  }

  // Handle subscription validation
  if (!subscriptionData) {
    return <>{fallback}</>;
  }

  const hasValidSubscription =
    subscriptionData.success &&
    (subscriptionData.isActive ||
      subscriptionData._mock ||
      subscriptionData._message === "Account not found in database");

  if (!hasValidSubscription) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
