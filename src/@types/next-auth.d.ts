import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role, SubscriptionTier, SubscriptionStatus } from "./enum";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      subscriptionTier: SubscriptionTier | null;
      subscriptionStatus: SubscriptionStatus | null;
      accountId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    subscriptionTier: SubscriptionTier | null;
    subscriptionStatus: SubscriptionStatus | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    subscriptionTier: SubscriptionTier | null;
    subscriptionStatus: SubscriptionStatus | null;
    accountId?: string;
  }
}
