import { validateSession } from "@/lib/auth/session-utils";
import { Role } from "@/@types/enum";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export async function AuthGuard({
  children,
  allowedRoles = [Role.USER],
  redirectTo = "/login",
}: AuthGuardProps) {
  const session = await validateSession();

  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    if (session.user.role === Role.ADMIN) {
      redirect("/admin");
    }
    redirect(redirectTo);
  }

  return <>{children}</>;
}
