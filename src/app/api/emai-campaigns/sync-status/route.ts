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
    const { campaign_id, list_id } = await request.json();

    Logger.log(
      `🔄 Starting sync for campaign: ${campaign_id}, list: ${list_id}`,
      loggerContext
    );

    // Step 1: Sync campaign status and statistics
    Logger.log("📊 Step 1: Syncing campaign status...", loggerContext);
    const campaignStatus = await getCampaignStatus(campaign_id);
    const listStats = await getListStatistics(list_id);

    // Step 2: Sync contacts list from Brevo
    Logger.log("👥 Step 2: Syncing contacts list...", loggerContext);
    const contactsSync = await syncContactsList(supabase, list_id, campaign_id);

    // Step 3: Update campaign status in Supabase
    Logger.log("💾 Step 3: Updating campaign status...", loggerContext);
    const campaignUpdate = await updateSupabaseCampaignStatus(
      supabase,
      campaign_id,
      campaignStatus,
      listStats
    );

    Logger.log(
      `✅ Sync completed: ${contactsSync.synced} contacts synced, ${contactsSync.removed} removed, ${campaignUpdate.updated_count} campaigns updated`,
      loggerContext
    );

    return NextResponse.json({
      success: true,
      message: "Campaign and contacts synced successfully",
      data: {
        campaign_status: campaignStatus,
        list_stats: listStats,
        contacts_synced: contactsSync.synced,
        contacts_removed: contactsSync.removed,
        campaigns_updated: campaignUpdate.updated_count,
        errors: [...contactsSync.errors, ...campaignUpdate.errors],
      },
    });
  } catch (e: any) {
    Logger.error("❌ Sync status error:", e);
    const msg = e?.message || "Failed to sync campaign status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function getCampaignStatus(campaignId: string) {
  try {
    const response = await fetch(
      `https://api.brevo.com/v3/emailCampaigns/${campaignId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey as string,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get campaign: ${response.status}`);
    }

    const campaign = await response.json();

    Logger.log(
      `Getting campaign statistics for campaign: ${campaignId}`,
      loggerContext
    );
    const statsResponse = await fetch(
      `https://api.brevo.com/v3/emailCampaigns/${campaignId}/report`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey as string,
        },
      }
    );

    let stats = null;
    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }

    return {
      campaign_id: campaignId,
      name: campaign.name,
      status: campaign.status, // draft, sent, archive, queued, suspended, in_process
      sent_at: campaign.sentDate,
      recipients_count: campaign.recipients?.total || 0,
      delivered_count: stats?.delivered || 0,
      opened_count: stats?.uniqueOpens || 0,
      clicked_count: stats?.uniqueClicks || 0,
      bounced_count: stats?.hardBounces || 0,
      unsubscribed_count: stats?.unsubscriptions || 0,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    Logger.error("Error getting campaign status:", error as string);
    throw error;
  }
}

async function getListStatistics(listId: string) {
  try {
    const response = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey as string,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get list: ${response.status}`);
    }

    const list = await response.json();

    return {
      list_id: listId,
      name: list.name,
      total_contacts: list.uniqueSubscribers || 0,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    Logger.error("Error getting list statistics:", error as string);
    throw error;
  }
}

async function updateSupabaseCampaignStatus(
  supabase: any,
  campaignId: string,
  campaignStatus: any,
  listStats: any
) {
  let updated_count = 0;
  const errors: string[] = [];

  try {
    Logger.log(
      `Updating campaign status: ${campaignStatus.status}`,
      loggerContext
    );
    const { error: campaignError } = await supabase
      .from("user_email_campaign")
      .update({
        status: mapBrevoStatusToLocal(campaignStatus.status),
        sent_at: campaignStatus.sent_at,
        email_send_count: campaignStatus.delivered_count || 0,
        last_email_sent_at: campaignStatus.sent_at,
        meta: {
          brevo_campaign_status: campaignStatus.status,
          recipients_count: campaignStatus.recipients_count,
          delivered_count: campaignStatus.delivered_count,
          opened_count: campaignStatus.opened_count,
          clicked_count: campaignStatus.clicked_count,
          bounced_count: campaignStatus.bounced_count,
          unsubscribed_count: campaignStatus.unsubscribed_count,
          list_total_contacts: listStats.total_contacts,
          last_synced: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("brevo_campaign_id", campaignId)
      .not("id", "is", null); // Only update existing records

    if (campaignError) {
      errors.push(`Campaign update error: ${campaignError.message}`);
    } else {
      updated_count++;
    }

    Logger.log(
      `Getting count of updated records for campaign: ${campaignId}`,
      loggerContext
    );
    const { count } = await supabase
      .from("user_email_campaign")
      .select("*", { count: "exact", head: true })
      .eq("brevo_campaign_id", campaignId);

    updated_count = count || 0;
  } catch (error: any) {
    errors.push(`Supabase update error: ${error.message}`);
  }

  return { updated_count, errors };
}

// Step 2: Sync contacts list from Brevo to Supabase
async function syncContactsList(
  supabase: any,
  listId: string,
  campaignId: string
) {
  let synced = 0;
  let removed = 0;
  const errors: string[] = [];

  try {
    // Get all contacts from Brevo list
    Logger.log(
      `📥 Fetching contacts from Brevo list: ${listId}`,
      loggerContext
    );
    const brevoContacts = await getBrevoListContacts(listId);

    // Get current contacts from Supabase for this campaign
    const { data: supabaseContacts } = await supabase
      .from("user_email_campaign")
      .select("email")
      .eq("brevo_list_id", listId)
      .eq("brevo_campaign_id", campaignId);

    const brevoEmails = new Set(brevoContacts.map((c: any) => c.email));
    const supabaseEmails = new Set(
      supabaseContacts?.map((c: any) => c.email) || []
    );

    // Remove contacts that are no longer in Brevo list
    const emailsToRemove = Array.from(supabaseEmails).filter(
      (email) => !brevoEmails.has(email)
    );

    if (emailsToRemove.length > 0) {
      Logger.log(
        `🗑️ Removing ${emailsToRemove.length} contacts from Supabase`,
        loggerContext
      );
      const { error: deleteError } = await supabase
        .from("user_email_campaign")
        .delete()
        .eq("brevo_list_id", listId)
        .eq("brevo_campaign_id", campaignId)
        .in("email", emailsToRemove);

      if (deleteError) {
        errors.push(`Delete error: ${deleteError.message}`);
      } else {
        removed = emailsToRemove.length;
      }
    }

    // Add new contacts from Brevo (if any)
    const emailsToAdd = Array.from(brevoEmails).filter(
      (email) => !supabaseEmails.has(email)
    );

    if (emailsToAdd.length > 0) {
      Logger.log(
        `➕ Adding ${emailsToAdd.length} new contacts to Supabase`,
        loggerContext
      );
      const newContacts = emailsToAdd.map((email) => {
        const brevoContact = brevoContacts.find((c: any) => c.email === email);
        return {
          email,
          first_name: brevoContact?.attributes?.FIRSTNAME || null,
          last_name: brevoContact?.attributes?.LASTNAME || null,
          member_kajabi_id: brevoContact?.attributes?.KAJABI_MEMBER_ID || null,
          kajabi_id: brevoContact?.attributes?.KAJABI_ID || null,
          brevo_campaign_id: campaignId,
          brevo_list_id: listId,
          campaign_name: `Synced Campaign ${
            new Date().toISOString().split("T")[0]
          }`,
          status: "pending" as const,
        };
      });

      const { error: insertError } = await supabase
        .from("user_email_campaign")
        .insert(newContacts);

      if (insertError) {
        errors.push(`Insert error: ${insertError.message}`);
      } else {
        synced = emailsToAdd.length;
      }
    }

    Logger.log(
      `📊 Contacts sync summary: ${synced} added, ${removed} removed, ${brevoContacts.length} total in Brevo`,
      loggerContext
    );
  } catch (error: any) {
    errors.push(`Contacts sync error: ${error.message}`);
    Logger.error("Error syncing contacts:", error);
  }

  return { synced, removed, errors };
}

// Helper: Get all contacts from Brevo list
async function getBrevoListContacts(listId: string) {
  const allContacts: any[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const response = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?offset=${offset}`,
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
    const contacts = data.contacts || [];

    if (contacts.length === 0) break;

    allContacts.push(...contacts);
    offset += limit;
  }

  return allContacts;
}

function mapBrevoStatusToLocal(brevoStatus: string): string {
  const statusMap: { [key: string]: string } = {
    draft: "pending",
    sent: "sent",
    archive: "sent",
    queued: "pending", // Map queued to pending instead of scheduled
    suspended: "failed",
    in_process: "pending", // Map in_process to pending instead of scheduled
  };

  return statusMap[brevoStatus] || "pending";
}
