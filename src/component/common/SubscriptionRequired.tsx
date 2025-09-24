"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasValidSubscriptionClient } from "@/lib/auth/session-utils";
import LoadingSpinner from "./LoadingSpinner";

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

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!hasValidSubscriptionClient(session)) {
      router.push("/pricing");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (!hasValidSubscriptionClient(session)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
