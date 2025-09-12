import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./nextauth";
import { Role, SubscriptionTier, SubscriptionStatus } from "@/@types/enum";
import type { Session } from "next-auth";

/**
 * Validates session and redirects to login if not authenticated
 */
export async function validateSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * Validates admin session and redirects to login if not admin
 */
export async function validateAdminSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login");
  }
  return session;
}

/**
 * Checks if user has valid subscription (TIER1 or TIER2 with ACTIVE status)
 */
export function hasValidSubscription(session: Session): boolean {
  if (!session?.user) {
    return false;
  }

  const subscriptionTier = session.user.subscriptionTier as SubscriptionTier;
  const subscriptionStatus = session.user
    .subscriptionStatus as SubscriptionStatus;

  return (
    subscriptionTier &&
    subscriptionStatus &&
    [SubscriptionTier.TIER1, SubscriptionTier.TIER2].includes(
      subscriptionTier
    ) &&
    subscriptionStatus === SubscriptionStatus.ACTIVE
  );
}
