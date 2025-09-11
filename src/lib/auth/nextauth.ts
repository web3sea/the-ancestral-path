import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAppConfig } from "../config/env";
import { createSupabaseAdmin } from "../supabase/admin";
import { SubscriptionTier, SubscriptionStatus, Role } from "@/@types/enum";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getAppConfig().auth.google.clientId,
      clientSecret: getAppConfig().auth.google.clientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      // Only allow Google OAuth
      if (account?.provider !== "google") {
        return false;
      }

      // Allow all Google OAuth users to sign in
      // Subscription validation will be handled by middleware
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        // Get user subscription details using Supabase admin client
        try {
          const supabase = createSupabaseAdmin();

          const { data: existingAccount, error } = await supabase
            .from("accounts")
            .select(
              `
              id,
              email,
              subscription_tier,
              subscription_status,
              subscription_start_date,
              subscription_end_date,
              stripe_customer_id,
              stripe_subscription_id,
              last_subscription_update,
              role_id,
              profile_completed,
              onboarding_completed,
              user_roles(name, permissions)
            `
            )
            .eq("email", user.email!)
            .is("deleted_at", null)
            .single();

          if (!error && existingAccount) {
            // User exists - get their data
            const userRole = existingAccount.user_roles;
            if (
              userRole &&
              typeof userRole === "object" &&
              "name" in userRole
            ) {
              token.role = userRole.name as Role;
            } else {
              token.role = Role.USER;
            }
            token.subscriptionTier =
              existingAccount.subscription_tier as SubscriptionTier;
            token.subscriptionStatus =
              existingAccount.subscription_status as SubscriptionStatus;
            token.accountId = existingAccount.id;
          } else {
            // Get default user role
            const { data: userRole } = await supabase
              .from("user_roles")
              .select("id")
              .eq("name", "user")
              .single();

            if (!userRole) {
              throw new Error("Default user role not found");
            }

            // Create new account
            const { data: newAccount, error: createError } = await supabase
              .from("accounts")
              .insert({
                email: user.email!,
                name: user.name || "",
                role_id: userRole.id,
                auth_provider: "google",
                auth_provider_id: account.providerAccountId,
                subscription_tier: null, // No subscription yet
                subscription_status: null, // No subscription yet
                stripe_customer_id: null,
                stripe_subscription_id: null,
                last_subscription_update: null,
              })
              .select("id")
              .single();

            if (createError || !newAccount) {
              console.error("Error creating account:", createError);
              throw new Error("Failed to create account");
            }

            // Create user profile
            await supabase.from("user_profiles").insert({
              account_id: newAccount.id,
            });

            // Create user preferences
            await supabase.from("user_preferences").insert({
              account_id: newAccount.id,
              email_notifications: true,
              reminder_times: ["09:00:00", "17:00:00"],
            });

            // Set token data for new user
            token.role = Role.USER;
            token.subscriptionTier = null; // No subscription yet
            token.subscriptionStatus = null; // No subscription yet
            token.accountId = newAccount.id;
          }
        } catch (error) {
          console.error("Error getting user subscription data:", error);
          console.error("Error details:", error);
          token.role = Role.USER;
          token.subscriptionTier = null; // No subscription yet
          token.subscriptionStatus = null; // No subscription yet
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as Role;
        session.user.subscriptionTier =
          token.subscriptionTier as SubscriptionTier;
        session.user.subscriptionStatus =
          token.subscriptionStatus as SubscriptionStatus;
        session.user.accountId = token.accountId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If it's the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: getAppConfig().auth.secret,
  debug: process.env.NODE_ENV === "development",
};
