import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

// This endpoint receives AO responses from n8n
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== AO WEBHOOK RECEIVED ===");
    console.log("Received webhook body:", JSON.stringify(body, null, 2));

    // Handle both formats: direct response and array response
    let responseData;
    if (Array.isArray(body) && body.length > 0) {
      // Handle array format like [{ output: "...", timestamps: "..." }]
      responseData = body[0];
      responseData.bot_response = responseData.output;
    } else {
      // Handle direct format
      responseData = body;
    }

    const {
      conversation_id,
      message_id,
      bot_response,
      rag_context,
      confidence_score,
      sources,
    } = responseData;

    if (!conversation_id || !bot_response) {
      return NextResponse.json(
        { error: "Conversation ID and bot response are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Insert the AO response message
    const { data: botMessage, error } = await supabase
      .from("oracle_messages")
      .insert({
        conversation_id,
        message: bot_response,
        sender_type: "bot",
        sender_id: null,
        metadata: {
          rag_context,
          confidence_score,
          sources,
          original_message_id: message_id,
        },
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating AO response message:", error);
      return NextResponse.json(
        { error: "Failed to create AO response message" },
        { status: 500 }
      );
    }

    // Update conversation timestamp
    await supabase
      .from("oracle_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversation_id);

    // Mark user's message as read
    if (message_id) {
      await supabase
        .from("oracle_messages")
        .update({ is_read: true })
        .eq("id", message_id);
    }

    return NextResponse.json({
      success: true,
      message: botMessage,
    });
  } catch (error) {
    console.error("Error in n8n oracle webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
