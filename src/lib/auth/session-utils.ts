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
 * Checks if user has valid subscription (FREE_TRIAL, TIER1 or TIER2 with ACTIVE status)
 * Note: Date-based validation is handled in middleware for better performance
 */
export function hasValidSubscription(session: Session): boolean {
  if (!session?.user) {
    return false;
  }

  const subscriptionTier = session.user.subscriptionTier as SubscriptionTier;
  const subscriptionStatus = session.user
    .subscriptionStatus as SubscriptionStatus;

  // Check if subscription tier and status are valid
  const hasValidTierAndStatus =
    subscriptionTier &&
    subscriptionStatus &&
    [
      SubscriptionTier.FREE_TRIAL,
      SubscriptionTier.TIER1,
      SubscriptionTier.TIER2,
    ].includes(subscriptionTier) &&
    (subscriptionStatus === SubscriptionStatus.ACTIVE ||
      subscriptionStatus === SubscriptionStatus.CANCELLED);

  return hasValidTierAndStatus;
}

/**
 * Checks if subscription is expired by date (requires database lookup)
 * This function should be used when date validation is needed
 */
export async function isSubscriptionExpiredByDate(
  accountId: string
): Promise<boolean> {
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
    const supabase = createSupabaseAdmin();

    const { data: account, error } = await supabase
      .from("accounts")
      .select("subscription_end_date")
      .eq("id", accountId)
      .single();

    if (error || !account?.subscription_end_date) {
      return false;
    }

    const endDate = new Date(account.subscription_end_date);
    const now = new Date();

    return now > endDate;
  } catch (error) {
    console.error("Error checking subscription expiry:", error);
    return false;
  }
}

/**
 * Checks if user has valid subscription based on tier, status, and end date
 * This function considers cancelled subscriptions as valid until their end date
 */
export async function hasValidSubscriptionWithDateCheck(
  session: Session
): Promise<boolean> {
  if (!session?.user) {
    return false;
  }

  const subscriptionTier = session.user.subscriptionTier as SubscriptionTier;
  const subscriptionStatus = session.user
    .subscriptionStatus as SubscriptionStatus;

  // Check if subscription tier and status are valid (including cancelled)
  const hasValidTierAndStatus =
    subscriptionTier &&
    subscriptionStatus &&
    [
      SubscriptionTier.FREE_TRIAL,
      SubscriptionTier.TIER1,
      SubscriptionTier.TIER2,
    ].includes(subscriptionTier) &&
    (subscriptionStatus === SubscriptionStatus.ACTIVE ||
      subscriptionStatus === SubscriptionStatus.CANCELLED);

  if (!hasValidTierAndStatus) {
    return false;
  }

  // For cancelled subscriptions, check if they haven't expired yet
  if (subscriptionStatus === SubscriptionStatus.CANCELLED) {
    if (!session.user.accountId) {
      return false;
    }
    const isExpired = await isSubscriptionExpiredByDate(session.user.accountId);
    return !isExpired;
  }

  // For active subscriptions, they are valid
  return true;
}

/**
 * Client-side function to check if user has valid subscription
 * This function works with session data and considers cancelled subscriptions as valid
 * Note: This doesn't check end date, use hasValidSubscriptionWithDateCheck for server-side date validation
 */
export function hasValidSubscriptionClient(session: Session | null): boolean {
  if (!session?.user) {
    return false;
  }

  const subscriptionTier = session.user.subscriptionTier as SubscriptionTier;
  const subscriptionStatus = session.user
    .subscriptionStatus as SubscriptionStatus;

  const hasValidTierAndStatus =
    subscriptionTier &&
    subscriptionStatus &&
    [
      SubscriptionTier.FREE_TRIAL,
      SubscriptionTier.TIER1,
      SubscriptionTier.TIER2,
    ].includes(subscriptionTier) &&
    (subscriptionStatus === SubscriptionStatus.ACTIVE ||
      subscriptionStatus === SubscriptionStatus.CANCELLED);

  return hasValidTierAndStatus;
}
