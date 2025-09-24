"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClientAuthGuardProps {
  children: React.ReactNode;
}

export function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading
    }

    if (!session) {
      router.push("/login");
      return;
    }

    // Allow all authenticated users (user, premium_user, admin)
    setIsChecking(false);
  }, [session, status, router]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
          <p className="text-primary-300/70">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
