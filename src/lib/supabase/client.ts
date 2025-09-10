/**
 * Supabase client utilities
 * Centralized database connection and client management
 */

import { createClient } from "@supabase/supabase-js";
import { getAppConfig } from "../config/env";

/**
 * Creates a Supabase client instance
 */
export function createSupabaseClient() {
  const config = getAppConfig();
  const url = config.database.url;
  const anon = config.database.key;

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
    );
  }

  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}

/**
 * Database table names as constants
 */
export const TABLES = {
  ACCOUNTS: "accounts",
  ABJ_EVENTS: "abj_events",
  AO_SESSIONS: "ao_sessions",
  GROUP_WORKSHOPS: "group_workshops",
  ONE_ON_ONE_SESSIONS: "one_on_one_sessions",
  AO_PHONE_CALLS: "ao_phone_calls",
  AO_MESSAGES: "ao_messages",
  MEDICINE_RETREATS: "medicine_retreats",
  WISDOM_DRIPS: "wisdom_drips",
  MEDICINE_CONTAINERS: "medicine_containers",
  BREATHWORK: "breathwork",
  ASTROLOGICAL_DOWNLOADS: "astrological_downloads",
  MINI_CHALLENGES: "mini_challenges",
  GUIDED_MEDITATIONS: "guided_meditations",
  RESOURCES: "resources",
  USER_PROFILES: "user_profiles",
  RETREAT_ATTENDANCE: "retreat_attendance",
  ABJ_ATTENDANCE: "abj_attendance",
  MEDICINE_CONTAINER_ATTENDANCE: "medicine_container_attendance",
  ABJ_RECORDINGS: "abj_recordings",
} as const;
