import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getAppConfig } from "@/lib/config";
import {
  brevoAddEmailsToList,
  brevoGetContactsFromList,
} from "@/lib/brevo/ultils";
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

    const brevoContacts = await brevoGetContactsFromList(list_id, 500);
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
    await brevoAddEmailsToList(list_id, toAddToBrevo);

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
