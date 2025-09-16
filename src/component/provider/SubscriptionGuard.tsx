import {
  validateSession,
  hasValidSubscriptionWithDateCheck,
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

export default async function SubscriptionGuard({
  children,
  redirectTo = "/pricing",
  allowNonSubscribed = false,
}: SubscriptionGuardProps) {
  const session = allowNonSubscribed
    ? await getServerSession(authOptions)
    : await validateSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === Role.ADMIN) {
    return <>{children}</>;
  }

  if (allowNonSubscribed) {
    return <>{children}</>;
  }

  // Use the new function that checks date for cancelled subscriptions
  const hasValidSub = await hasValidSubscriptionWithDateCheck(session);

  if (!hasValidSub) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
