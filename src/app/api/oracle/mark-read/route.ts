import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { conversationId, messageIds, markAll } = body;

    const supabase = createSupabaseAdmin();

    if (markAll) {
      // First get all conversation IDs for the user
      const { data: conversations, error: convError } = await supabase
        .from("oracle_conversations")
        .select("id")
        .eq("user_id", token.accountId);

      if (convError) {
        console.error("Error fetching user conversations:", convError);
        return NextResponse.json(
          { error: "Failed to fetch conversations" },
          { status: 500 }
        );
      }

      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map((conv) => conv.id);

        // Mark all unread bot messages for the user as read
        const { error: updateError } = await supabase
          .from("oracle_messages")
          .update({ is_read: true })
          .eq("sender_type", "bot")
          .eq("is_read", false)
          .in("conversation_id", conversationIds);

        if (updateError) {
          console.error("Error marking all messages as read:", updateError);
          return NextResponse.json(
            { error: "Failed to mark all messages as read" },
            { status: 500 }
          );
        }
      }
    } else if (conversationId) {
      // Verify user has access to the conversation
      const { data: conversation, error: convError } = await supabase
        .from("oracle_conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", token.accountId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json(
          { error: "Oracle conversation not found" },
          { status: 404 }
        );
      }

      // Mark all unread bot messages in this conversation as read
      const { error: updateError } = await supabase
        .from("oracle_messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("sender_type", "bot")
        .eq("is_read", false);

      if (updateError) {
        console.error("Error marking messages as read:", updateError);
        return NextResponse.json(
          { error: "Failed to mark messages as read" },
          { status: 500 }
        );
      }
    } else if (messageIds && Array.isArray(messageIds)) {
      // Mark specific messages as read
      const { error: updateError } = await supabase
        .from("oracle_messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .eq("sender_type", "bot");

      if (updateError) {
        console.error("Error marking specific messages as read:", updateError);
        return NextResponse.json(
          { error: "Failed to mark messages as read" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Either conversationId, messageIds, or markAll is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in mark oracle messages as read API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
