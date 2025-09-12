import {
  validateSession,
  hasValidSubscription,
} from "@/lib/auth/session-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { Role } from "@/@types/enum";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface SubscriptionGuardProps {
  children: ReactNode;
  redirectTo?: string;
  allowNonSubscribed?: boolean;
}

export async function SubscriptionGuard({
  children,
  redirectTo = "/pricing",
  allowNonSubscribed = false,
}: SubscriptionGuardProps) {
  // Use getServerSession when allowing non-subscribed users to avoid redirect loops
  const session = allowNonSubscribed
    ? await getServerSession(authOptions)
    : await validateSession();

  // If no session and we're not allowing non-subscribed users, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Admin users bypass subscription check
  if (session.user.role === Role.ADMIN) {
    return <>{children}</>;
  }

  // If non-subscribed users are allowed, let them through
  if (allowNonSubscribed) {
    return <>{children}</>;
  }

  // Check subscription for regular users
  const hasValidSub = hasValidSubscription(session);
  if (!hasValidSub) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
