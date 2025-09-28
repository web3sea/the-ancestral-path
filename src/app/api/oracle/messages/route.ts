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

    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversation_id");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Verify user has access to this conversation
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

    const { data: messages, error } = await supabase
      .from("oracle_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching oracle messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch oracle messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error in oracle messages API:", error);
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
    const { conversation_id, message, metadata = {} } = body;

    if (!conversation_id || !message) {
      return NextResponse.json(
        { error: "Conversation ID and message are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Verify user has access to this conversation
    const { data: conversation, error: convError } = await supabase
      .from("oracle_conversations")
      .select("id")
      .eq("id", conversation_id)
      .eq("user_id", token.accountId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Oracle conversation not found" },
        { status: 404 }
      );
    }

    // Insert the message
    const { data: newMessage, error } = await supabase
      .from("oracle_messages")
      .insert({
        conversation_id,
        message,
        sender_type: "user",
        sender_id: token.accountId,
        metadata,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating oracle message:", error);
      return NextResponse.json(
        { error: "Failed to create oracle message" },
        { status: 500 }
      );
    }

    // Update conversation timestamp
    await supabase
      .from("oracle_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversation_id);

    // Check if webhook URL is configured
    if (!process.env.N8N_RAG_AGENT_WEBHOOK_URL) {
      console.error("N8N_RAG_AGENT_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    // Trigger n8n webhook for AO response (awaited)
    const webhookPayload = {
      conversation_id,
      message_id: newMessage.id,
      message,
      user_id: token.accountId,
    };

    console.log("Calling n8n webhook:", process.env.N8N_RAG_AGENT_WEBHOOK_URL);
    console.log("Webhook payload:", webhookPayload);

    try {
      const webhookResponse = await fetch(
        `${process.env.N8N_RAG_AGENT_WEBHOOK_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      if (!webhookResponse.ok) {
        throw new Error(
          `Webhook request failed with status: ${webhookResponse.status}`
        );
      }

      const data = await webhookResponse.json();

      // Handle the AO response directly since n8n is returning it instead of calling our webhook
      if (data && data.output) {
        // Create AO response message in database
        const { data: botMessage, error: botError } = await supabase
          .from("oracle_messages")
          .insert({
            conversation_id,
            message: data.output,
            sender_type: "bot",
            sender_id: null,
            metadata: {
              sources: data.sources,
              timestamps: data.timestamps,
              original_message_id: newMessage.id,
            },
          })
          .select()
          .single();

        if (botError) {
          console.error("Error creating AO response message:", botError);
          return NextResponse.json(
            { error: "Failed to create bot response" },
            { status: 500 }
          );
        }

        // Update conversation timestamp
        await supabase
          .from("oracle_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversation_id);

        // Mark user message as read
        await supabase
          .from("oracle_messages")
          .update({ is_read: true })
          .eq("id", newMessage.id);

        return NextResponse.json({
          success: true,
          message: newMessage,
          botMessage: botMessage,
        });
      } else {
        console.error("No valid output received from webhook:", data);
        return NextResponse.json(
          { error: "Invalid response from AI service" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error calling n8n webhook:", error);
      return NextResponse.json(
        { error: "Failed to process message with AI service" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in create oracle message API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
