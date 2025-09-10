"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignOutProps {
  callbackUrl?: string;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function SignOut({
  callbackUrl = "/login",
  className = "",
  children,
  showIcon = true,
}: SignOutProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback: redirect manually if signOut fails
      router.push(callbackUrl);
    }
  };

  if (children) {
    return (
      <button onClick={handleSignOut} className={className}>
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      Sign Out
    </button>
  );
}
