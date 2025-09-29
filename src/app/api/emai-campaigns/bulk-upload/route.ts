import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getAppConfig } from "@/lib/config";
import { BulkUploadRequest } from "@/@types/email-campaign";
import { brevoImportContactsToList } from "@/lib/brevo/ultils";
import { Logger } from "@/lib/utils/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const loggerContext = "EmailCampaignsBulkUpload";
const DEFAULT_LIST_FREE_TRIAL_ID = getAppConfig().brevo.list_free_trial_id;
const BREVO_API_KEY = getAppConfig().brevo.apiKey;

export async function POST(request: Request) {
  try {
    const apiKey = BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    let { brevo_list_id, campaign_name, items }: BulkUploadRequest =
      await request.json();

    if (!brevo_list_id) {
      brevo_list_id = DEFAULT_LIST_FREE_TRIAL_ID || "";
    }

    Logger.log(
      `🚀 Starting bulk upload: ${items.length} contacts to list ${brevo_list_id}`,
      loggerContext
    );

    // Step 1: Upload to Brevo List using import API
    Logger.log("📤 Step 1: Uploading contacts to Brevo list...", loggerContext);
    const brevoResult = await uploadToBrevoList(brevo_list_id, items, apiKey);
    Logger.log(
      `✅ Brevo upload completed: ${brevoResult.processed} contacts processed`,
      loggerContext
    );

    // Step 3: Save to Supabase (with duplicate check)
    Logger.log("💾 Step 3: Saving to Supabase...", loggerContext);
    const supabaseResult = await handleSupabaseUpload(
      items,
      brevo_list_id,
      campaign_name
    );
    Logger.log(
      `✅ Supabase save completed: ${supabaseResult.saved} records saved`,
      loggerContext
    );

    return NextResponse.json({
      success: true,
      message: "Bulk upload completed",
      data: {
        total_processed: items.length,
        brevo_uploaded: brevoResult.processed,
        supabase_saved: supabaseResult.saved,
        errors: [...brevoResult.errors, ...supabaseResult.errors],
        total_errors: brevoResult.errors.length + supabaseResult.errors.length,
      },
    });
  } catch (e: any) {
    Logger.error("❌ Bulk upload error:", e);
    const msg = e?.message || "Failed to bulk upload contacts";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Step 1: Upload contacts to Brevo List
async function uploadToBrevoList(
  listId: string,
  contacts: any[],
  apiKey: string
) {
  const result = await brevoImportContactsToList(listId, contacts);
  if (result.errors?.length) {
    return { processed: 0, errors: result.errors };
  }
  return { processed: contacts.length, errors: [] };
}

// Step 3: Save to Supabase with duplicate check
async function handleSupabaseUpload(
  contacts: any[],
  brevo_list_id: string,
  campaign_name: string
) {
  const supabase = createSupabaseAdmin();
  let saved = 0;
  const errors: string[] = [];

  // Get existing emails from Supabase to avoid duplicates
  const emails = contacts.map((c) => c.email);
  const { data: existing } = await supabase
    .from("user_email_campaign")
    .select("email")
    .in("email", emails);

  const existingEmails = new Set(existing?.map((r) => r.email) || []);

  // Prepare new contacts (skip existing ones)
  const newContacts = contacts
    .filter((contact) => !existingEmails.has(contact.email))
    .map((contact) => ({
      email: contact.email,
      first_name: contact.first_name || null,
      last_name: contact.last_name || null,
      member_kajabi_id: contact.kajabi_member_id || null,
      kajabi_id: contact.kajabi_id || null,
      brevo_list_id,
      campaign_name,
      status: "pending",
    }));

  if (newContacts.length === 0) {
    Logger.log(
      "⚠️ No new contacts to save (all already exist in Supabase)",
      loggerContext
    );
    return { saved: 0, errors: [] };
  }

  // Bulk insert to Supabase
  try {
    const { data, error } = await supabase
      .from("user_email_campaign")
      .insert(newContacts)
      .select("id");

    if (error) {
      errors.push(`Supabase insert failed: ${error.message}`);
    } else {
      saved = data?.length || 0;
      Logger.log(`💾 Saved ${saved} new contacts to Supabase`, loggerContext);
    }
  } catch (error: any) {
    errors.push(`Supabase error: ${error.message}`);
  }

  return { saved, errors };
}
