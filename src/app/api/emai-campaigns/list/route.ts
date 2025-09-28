import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { UserEmailCampaignResponse } from "@/@types/email-campaign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate parameters
    const validSortFields = [
      "created_at",
      "updated_at",
      "email",
      "first_name",
      "last_name",
    ];
    const validSortOrders = ["asc", "desc"];

    const finalSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const finalSortOrder = validSortOrders.includes(sortOrder)
      ? sortOrder
      : "desc";
    const finalPage = Math.max(1, page);
    const finalLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page

    const supabase = createSupabaseAdmin();

    // Build query
    let query = supabase.from("user_email_campaign").select(
      `
        id,
        email,
        first_name,
        last_name,
        member_kajabi_id,
        kajabi_id,
        brevo_campaign_id,
        brevo_list_id,
        campaign_name,
        status,
        sent_at,
        created_at,
        updated_at,
        email_send_count,
        last_email_sent_at,
        meta,
        trial_started_at,
        upgraded_at
      `,
      { count: "exact" }
    );

    // Apply search filter
    if (search.trim()) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Apply sorting
    query = query.order(finalSortBy, { ascending: finalSortOrder === "asc" });

    // Apply pagination
    const from = (finalPage - 1) * finalLimit;
    const to = from + finalLimit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / finalLimit);
    const hasNextPage = finalPage < totalPages;
    const hasPreviousPage = finalPage > 1;

    const response: UserEmailCampaignResponse = {
      data: data || [],
      pagination: {
        totalItems,
        currentPage: finalPage,
        totalPages,
        itemsPerPage: finalLimit,
        hasNextPage,
        hasPreviousPage,
      },
    };

    return NextResponse.json(response);
  } catch (e: any) {
    console.error("Error fetching email campaigns:", e);
    const msg = e?.message || "Failed to list email campaigns";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
