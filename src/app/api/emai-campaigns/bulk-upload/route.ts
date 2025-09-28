import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getAppConfig } from "@/lib/config";
import { BulkUploadRequest } from "@/@types/email-campaign";
import { handleApiError } from "@/lib/utils/errors";
import { Logger } from "@/lib/utils/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const loggerContext = "EmailCampaignsBulkUpload";

export async function POST(request: Request) {
  try {
    const apiKey = getAppConfig().brevo.apiKey;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const {
      brevo_list_id,
      brevo_campaign_id,
      campaign_name,
      items,
    }: BulkUploadRequest = await request.json();

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

    // Step 2: Move contacts to Campaign
    Logger.log("🎯 Step 2: Moving contacts to campaign...", loggerContext);
    const campaignResult = await addContactsToCampaign(
      brevo_campaign_id,
      brevo_list_id,
      apiKey
    );
    Logger.log(
      `✅ Campaign update completed: ${campaignResult} contacts added to campaign`,
      loggerContext
    );

    // Step 3: Save to Supabase (with duplicate check)
    Logger.log("💾 Step 3: Saving to Supabase...", loggerContext);
    const supabaseResult = await handleSupabaseUpload(
      items,
      brevo_list_id,
      brevo_campaign_id,
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
        campaign_updated: campaignResult,
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
  const jsonBody = contacts.map((contact) => ({
    email: contact.email,
    attributes: {
      FIRSTNAME: contact.first_name || "",
      LASTNAME: contact.last_name || "",
      KAJABI_ID: contact.kajabi_id || "",
      KAJABI_MEMBER_ID: contact.kajabi_member_id || "",
    },
  }));

  const response = await fetch("https://api.brevo.com/v3/contacts/import", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      listIds: [parseInt(listId)],
      updateExistingContacts: true,
      emptyContactsAttributes: false,
      jsonBody: jsonBody,
    }),
  });

  if (!response.ok) {
    handleApiError(response);
    return { processed: 0, errors: ["Brevo import failed"] };
  }

  const result = await response.json();
  return {
    processed: contacts.length,
    errors: result.errors || [],
  };
}

// Step 2: Add contacts to Campaign
async function addContactsToCampaign(
  campaignId: string,
  listId: string,
  apiKey: string
) {
  const response = await fetch(
    `https://api.brevo.com/v3/emailCampaigns/${campaignId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        recipients: {
          listIds: [parseInt(listId)],
        },
      }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
    return 0;
  }

  return 1; // Campaign updated successfully
}

// Step 3: Save to Supabase with duplicate check
async function handleSupabaseUpload(
  contacts: any[],
  brevo_list_id: string,
  brevo_campaign_id: string,
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
      brevo_campaign_id,
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
