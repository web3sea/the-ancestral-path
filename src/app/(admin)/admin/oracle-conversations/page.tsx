"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, User, Calendar, MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  user_id: string;
  user_email: string;
  user_name: string;
  message_count: number;
  user_message_count: number;
  bot_message_count: number;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export default function OracleConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/oracle-conversations");

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();

      if (data.success && data.conversations) {
        setConversations(data.conversations);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations");
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
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2 text-primary-300/60">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-300"></div>
            <span>Loading conversations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchConversations}
          className="mt-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-300 mb-2">
          Oracle AI Conversations
        </h1>
        <p className="text-primary-300/70">
          View all conversations between users and Oracle AI
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-primary-300/30 mx-auto mb-4" />
          <p className="text-primary-300/60">No conversations found</p>
        </div>
      ) : (
        <div className="bg-black/20 backdrop-blur-sm border border-primary-300/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-primary-300/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-300/10 flex-1">
                {conversations.map((conversation) => (
                  <tr
                    key={conversation.id}
                    className="hover:bg-black/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-300/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary-300">
                            {conversation.user_name}
                          </div>
                          <div className="text-sm text-primary-300/60">
                            {conversation.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4 text-primary-300/60" />
                          <span className="text-primary-300">
                            {conversation.message_count}
                          </span>
                        </div>
                        <div className="text-primary-300/60">
                          ({conversation.user_message_count} user,{" "}
                          {conversation.bot_message_count} AO)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300/80">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(conversation.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300/80">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(conversation.last_message_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/oracle-conversations/${conversation.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-primary-300/20 text-primary-300 rounded-lg hover:bg-primary-300/30 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-primary-300/60">
        Total conversations: {conversations.length}
      </div>
    </div>
  );
}
