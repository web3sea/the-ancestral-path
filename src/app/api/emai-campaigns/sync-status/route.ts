import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getAppConfig } from "@/lib/config";
import { Logger } from "@/lib/utils/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const loggerContext = "EmailCampaignsSyncStatus";

const config = getAppConfig();
const apiKey = config.brevo.apiKey;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is not configured");
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const { list_id } = await request.json();
    Logger.log(
      `Start sync (Supabase -> Brevo) for list: ${list_id}`,
      loggerContext
    );

    const brevoContacts = await getBrevoListContactsLimited(list_id, 500);
    const brevoEmails = new Set(brevoContacts.map((c: any) => c.email));

    const { data: supabaseContacts } = await supabase
      .from("user_email_campaign")
      .select("email, created_at")
      .eq("brevo_list_id", list_id)
      .order("created_at", { ascending: false })
      .limit(500);

    const supabaseEmails = new Set(
      (supabaseContacts || []).map((c: any) => c.email)
    );

    const toAddToBrevo = Array.from(supabaseEmails).filter(
      (email) => !brevoEmails.has(email)
    );
    await addEmailsToBrevoList(list_id, toAddToBrevo);

    return NextResponse.json({
      success: true,
      message: "Sync completed (Supabase -> Brevo)",
      data: {
        added_to_brevo: toAddToBrevo.length,
        brevo_checked: brevoEmails.size,
        supabase_checked: supabaseEmails.size,
      },
    });
  } catch (e: any) {
    Logger.error("Sync status error:", e);
    const msg = e?.message || "Failed to sync campaign status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function getBrevoListContactsLimited(listId: string, max: number) {
  const limit = Math.min(500, Math.max(1, max));
  const response = await fetch(
    `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey as string,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to get contacts: ${response.status}`);
  }
  const data = await response.json();
  return data.contacts || [];
}

async function addEmailsToBrevoList(listId: string, emails: string[]) {
  if (!emails || emails.length === 0) return;
  const response = await fetch(
    `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey as string,
      },
      body: JSON.stringify({ emails }),
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to add emails to Brevo list: ${text}`);
  }
}
