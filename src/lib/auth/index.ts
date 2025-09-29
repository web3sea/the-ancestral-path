import { getServerSession } from "next-auth/next";
import { authOptions } from "./nextauth";
import { NextRequest } from "next/server";
import { SubscriptionTier, SubscriptionStatus, Role } from "@/@types/enum";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Get the current user session on the server side
 */
export async function getSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session as Session | null;
}

/**
 * Require authentication and optionally a specific role
 */
export async function requireAuth(requiredRole?: Role): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error("Authentication required");
  }

  // Check if user has valid subscription
  if (!isValidSubscription(session.user)) {
    throw new Error("Valid subscription required");
  }

  if (
    requiredRole &&
    session.user.role !== requiredRole &&
    session.user.role !== Role.ADMIN
  ) {
    throw new Error(`Role '${requiredRole}' required`);
  }

  return session;
}

/**
 * Check if user has valid subscription (Free Trial, Tier 1 or Tier 2, active or cancelled status)
 * Note: For cancelled subscriptions, date validation should be done separately
 */
export function isValidSubscription(user: User): boolean {
  return (
    (user.subscriptionTier === SubscriptionTier.FREE_TRIAL ||
      user.subscriptionTier === SubscriptionTier.TIER1 ||
      user.subscriptionTier === SubscriptionTier.TIER2) &&
    (user.subscriptionStatus === SubscriptionStatus.ACTIVE ||
      user.subscriptionStatus === SubscriptionStatus.CANCELLED)
  );
}

/**
 * Check if user has specific subscription tier
 */
export function hasSubscriptionTier(
  user: User,
  tier: SubscriptionTier
): boolean {
  return (
    user.subscriptionTier === tier &&
    user.subscriptionStatus === SubscriptionStatus.ACTIVE
  );
}

/**
 * Protect API routes with authentication
 */
export async function withAuth(
  handler: (req: NextRequest, session: Session) => Promise<Response>,
  requiredRole?: Role
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireAuth(requiredRole);
      return await handler(req, session);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unauthorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
