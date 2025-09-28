import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
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

    // Check if user is admin (you may need to adjust this based on your admin logic)
    // For now, we'll assume all authenticated users are admins

    const { conversationId } = await params;
    const supabase = createSupabaseAdmin();

    // Get conversation details with user information
    const { data: conversation, error: convError } = await supabase
      .from("oracle_conversations")
      .select(
        `
        *,
        accounts!oracle_conversations_user_id_fkey (
          id,
          email,
          name
        )
      `
      )
      .eq("id", conversationId)
      .single();

    if (convError) {
      console.error("Error fetching conversation:", convError);
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("oracle_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Transform messages for display
    const transformedMessages = messages?.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender_type: msg.sender_type,
      sender_id: msg.sender_id,
      metadata: msg.metadata,
      is_read: msg.is_read,
      created_at: msg.created_at,
    }));

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        user_id: conversation.user_id,
        user_email: conversation.accounts?.email,
        user_name: conversation.accounts?.name || conversation.accounts?.email,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
      },
      messages: transformedMessages,
      message_count: transformedMessages?.length || 0,
    });
  } catch (error) {
    console.error("Error in admin conversation details API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
