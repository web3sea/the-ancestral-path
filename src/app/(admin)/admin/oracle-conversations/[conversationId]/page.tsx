"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MessageCircle, Calendar, Bot } from "lucide-react";

interface Message {
  id: string;
  message: string;
  sender_type: "user" | "bot";
  sender_id: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  user_id: string;
  user_email: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export default function ConversationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversationDetails();
    }
  }, [conversationId]);

  const fetchConversationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/oracle-conversations/${conversationId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversation details");
      }

      const data = await response.json();
      setConversation(data.conversation);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
      setError("Failed to load conversation details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-primary-300/60">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-300"></div>
            <span>Loading conversation...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error || "Conversation not found"}</p>
          <Link
            href="/admin/oracle-conversations"
            className="mt-2 inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/oracle-conversations"
          className="inline-flex items-center text-primary-300/60 hover:text-primary-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Conversations
        </Link>

        <h1 className="text-2xl font-bold text-primary-300 mb-2">
          Oracle AI Conversation
        </h1>

        <div className="bg-black/20 backdrop-blur-sm border border-primary-300/20 rounded-lg p-4">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-10 h-10 bg-primary-300/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-300" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-primary-300">
                {conversation.user_name}
              </h2>
              <p className="text-primary-300/60">{conversation.user_email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-primary-300/80">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(conversation.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-black/20 backdrop-blur-sm border border-primary-300/20 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-primary-300/20">
          <h3 className="text-lg font-medium text-primary-300">
            Conversation History
          </h3>
        </div>

        <div className="overflow-y-auto max-h-[calc(68.5vh)]">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-primary-300/60">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No messages in this conversation</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-2xl ${
                      message.sender_type === "user"
                        ? "bg-primary-300/20 backdrop-blur-sm border border-primary-300/30"
                        : "bg-black/40 backdrop-blur-sm border border-primary-300/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.sender_type === "bot" ? (
                        <Bot className="w-4 h-4 text-primary-300" />
                      ) : (
                        <User className="w-4 h-4 text-primary-300" />
                      )}
                      <span className="text-sm font-medium text-primary-300">
                        {message.sender_type === "bot" ? "Oracle AI" : "User"}
                      </span>
                      {message.sender_type === "bot" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                          AO
                        </span>
                      )}
                      <span className="text-xs text-primary-300/60">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <div className="text-primary-300 whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
