import { signOut } from "next-auth/react";

export interface SignOutOptions {
  callbackUrl?: string;
  redirect?: boolean;
}

/**
 * Utility function to handle user sign out
 * @param options - Sign out configuration options
 * @returns Promise that resolves when sign out is complete
 */
export async function handleSignOut(options: SignOutOptions = {}) {
  const { 
    callbackUrl = "/login", 
    redirect = true 
  } = options;

  try {
    await signOut({ 
      callbackUrl,
      redirect 
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Sign out with custom redirect URL
 * @param redirectUrl - URL to redirect to after sign out
 */
export async function signOutWithRedirect(redirectUrl: string) {
  return handleSignOut({ callbackUrl: redirectUrl });
}

/**
 * Sign out without redirect (useful for programmatic sign out)
 */
export async function signOutWithoutRedirect() {
  return handleSignOut({ redirect: false });
}
