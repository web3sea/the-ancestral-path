import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub || !token?.accountId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Get all unread bot messages for the user
    const { data: unreadMessages, error } = await supabase
      .from("oracle_messages")
      .select(`
        id,
        conversation_id,
        oracle_conversations!inner(user_id)
      `)
      .eq("oracle_conversations.user_id", token.accountId)
      .eq("sender_type", "bot")
      .eq("is_read", false);

    if (error) {
      console.error("Error fetching unread oracle messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch unread count" },
        { status: 500 }
      );
    }

    const unreadCount = unreadMessages?.length || 0;

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Error in oracle unread count API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
