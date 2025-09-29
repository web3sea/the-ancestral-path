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

    const { data: conversations, error } = await supabase
      .from("oracle_conversations")
      .select(
        `
        *,
        oracle_messages (
          id,
          message,
          sender_type,
          created_at
        )
      `
      )
      .eq("user_id", token.accountId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching oracle conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch oracle conversations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error in oracle conversations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { title } = body;

    const supabase = createSupabaseAdmin();

    // Check if user already has an oracle conversation
    const { data: existingConversations } = await supabase
      .from("oracle_conversations")
      .select("id")
      .eq("user_id", token.accountId);

    if (existingConversations && existingConversations.length > 0) {
      // Return the existing conversation instead of creating a new one
      const { data: existingConv } = await supabase
        .from("oracle_conversations")
        .select("*")
        .eq("id", existingConversations[0].id)
        .single();

      return NextResponse.json({
        success: true,
        conversation: existingConv,
      });
    }

    // Create new conversation only if none exists
    const { data: conversation, error } = await supabase
      .from("oracle_conversations")
      .insert({
        user_id: token.accountId,
        title: title || "Oracle AI Guidance",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating oracle conversation:", error);
      return NextResponse.json(
        { error: "Failed to create oracle conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error in create oracle conversation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
