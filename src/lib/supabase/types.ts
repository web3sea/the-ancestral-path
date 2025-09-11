/**
 * Database types and interfaces
 * Based on the architecture document table structure
 */

export interface Account {
  id: string;
  name: string;
  phone?: string;
  email: string;
  role_id?: string;

  // Subscription information
  subscription_tier?: "tier1" | "tier2" | null;
  subscription_status?: "active" | "cancelled" | "paused" | "expired" | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;

  // Stripe integration
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  last_subscription_update?: string | null;

  // User preferences
  preferred_platform?: "web" | "sms" | "whatsapp";
  timezone?: string;
  language?: string;

  // Authentication
  auth_provider?: "google" | "email" | "phone";
  auth_provider_id?: string;

  // Profile completion
  profile_completed?: boolean;
  onboarding_completed?: boolean;

  // Engagement tracking
  last_active_at?: string | null;
  total_sessions?: number;
  streak_days?: number;
  last_streak_date?: string | null;

  // Communication preferences
  email_notifications?: boolean;
  sms_notifications?: boolean;
  whatsapp_notifications?: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UserProfile {
  id: string;
  account_id: string;
  questionnaire_responses: Record<string, unknown>;
  preferred_platform: "whatsapp" | "sms";
  created_at: string;
  updated_at: string;
}

export interface AOSession {
  id: string;
  account_id: string;
  session_type: "message" | "call";
  content: string;
  duration_minutes?: number;
  created_at: string;
}

export interface AOPhoneCall {
  id: string;
  account_id: string;
  duration_minutes: number;
  transcript?: string;
  created_at: string;
}

export interface AOMessage {
  id: string;
  account_id: string;
  message_content: string;
  response_content?: string;
  platform: "whatsapp" | "sms";
  created_at: string;
}

export interface GroupWorkshop {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  capacity: number;
  created_at: string;
}

export interface WorkshopAttendance {
  id: string;
  workshop_id: string;
  account_id: string;
  attended: boolean;
  created_at: string;
}

export interface MedicineRetreat {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  created_at: string;
}

export interface RetreatAttendance {
  id: string;
  retreat_id: string;
  account_id: string;
  attended: boolean;
  created_at: string;
}

// Database function return types
export interface SubscriptionDataForRefresh {
  subscription_tier: "tier1" | "tier2" | null;
  subscription_status: "active" | "cancelled" | "paused" | "expired" | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  last_subscription_update: string | null;
}

export interface UserSubscriptionData {
  subscription_tier: "tier1" | "tier2" | null;
  subscription_status: "active" | "cancelled" | "paused" | "expired" | null;
  role_name: string;
}
