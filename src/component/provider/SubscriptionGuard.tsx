import {
  validateSession,
  hasValidSubscription,
} from "@/lib/auth/session-utils";
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
  redirectTo = "/",
  allowNonSubscribed = false,
}: SubscriptionGuardProps) {
  const session = await validateSession();

  // Admin users bypass subscription check
  if (session.user.role === Role.ADMIN) {
    return <>{children}</>;
  }

  // If non-subscribed users are allowed, let them through
  if (allowNonSubscribed) {
    return <>{children}</>;
  }

  // Check subscription for regular users
  const hasValidSub = await hasValidSubscription(session);
  if (!hasValidSub) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
