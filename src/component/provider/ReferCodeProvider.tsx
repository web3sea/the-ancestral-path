"use client";

import { useReferCode } from "@/component/hook/useReferCode";

interface ReferCodeProviderProps {
  children: React.ReactNode;
}

export function ReferCodeProvider({ children }: ReferCodeProviderProps) {
  // This hook will automatically process referCode when user is authenticated
  useReferCode();

  return <>{children}</>;
}
