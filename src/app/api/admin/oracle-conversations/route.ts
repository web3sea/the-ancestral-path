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

    // Check if user is admin (you may need to adjust this based on your admin logic)
    // For now, we'll assume all authenticated users are admins
    // You can add role-based access control here if needed

    const supabase = createSupabaseAdmin();

    // Get all Oracle conversations with user information and message counts
    const { data: conversations, error } = await supabase
      .from("oracle_conversations")
      .select(
        `
        *,
        accounts!oracle_conversations_user_id_fkey (
          id,
          email,
          name
        ),
        oracle_messages (
          id,
          sender_type,
          created_at
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching Oracle conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch Oracle conversations" },
        { status: 500 }
      );
    }

    // Transform the data to include message counts
    const conversationsWithStats = conversations?.map((conv) => {
      const messages = conv.oracle_messages || [];
      const userMessages = messages.filter(
        (msg: { sender_type: string }) => msg.sender_type === "user"
      );
      const botMessages = messages.filter(
        (msg: { sender_type: string }) => msg.sender_type === "bot"
      );

      return {
        id: conv.id,
        title: conv.title,
        user_id: conv.user_id,
        user_email: conv.accounts?.email,
        user_name: conv.accounts?.name || conv.accounts?.email,
        message_count: messages.length,
        user_message_count: userMessages.length,
        bot_message_count: botMessages.length,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        last_message_at:
          messages.length > 0
            ? messages.sort(
                (a: { created_at: string }, b: { created_at: string }) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0].created_at
            : conv.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      conversations: conversationsWithStats,
      total: conversationsWithStats?.length || 0,
    });
  } catch (error) {
    console.error("Error in admin Oracle conversations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
