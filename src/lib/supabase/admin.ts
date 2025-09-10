import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // In development, provide more helpful error message
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Missing SUPABASE service configuration. Please set the following environment variables:"
      );
      console.error("- SUPABASE_URL");
      console.error("- SUPABASE_SERVICE_ROLE_KEY");
    }
    throw new Error(
      "Missing SUPABASE service configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
