import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const { brevo_list_id, brevo_campaign_id, campaign_name, items } =
      await request.json();

    // Prepare all contacts for batch insert
    const contacts = items.map((item: any) => ({
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      kajabi_id: item.kajabi_id,
      member_kajabi_id: item.kajabi_member_id,
      brevo_list_id,
      brevo_campaign_id,
      campaign_name,
      status: "pending",
    }));

    // Get existing contacts for this campaign to identify duplicates (1 query)
    const { data: existingContacts, error: fetchError } = await supabase
      .from("user_email_campaign")
      .select("email")
      .eq("campaign_name", campaign_name);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const existingEmails = new Set(
      existingContacts?.map((c: any) => c.email) || []
    );

    // Filter out duplicates
    const newContacts = contacts.filter(
      (contact: any) => !existingEmails.has(contact.email)
    );
    const skippedCount = contacts.length - newContacts.length;

    let uploadedCount = 0;

    if (newContacts.length > 0) {
      // Batch insert all new contacts at once (1 query)
      const { error: insertError } = await supabase
        .from("user_email_campaign")
        .insert(newContacts);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      uploadedCount = newContacts.length;
    }

    return NextResponse.json({
      success: true,
      message: "Upload completed",
      data: {
        uploaded_count: uploadedCount,
        skipped_count: skippedCount,
        total_processed: items.length,
        brevo_list_id,
        brevo_campaign_id,
      },
    });
  } catch (e: any) {
    const msg = e?.message || "Failed to upload emails";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
