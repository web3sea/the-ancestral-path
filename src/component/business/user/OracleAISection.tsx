"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useNotifications } from "@/component/provider/NotificationProvider";

interface Message {
  id: string;
  content: string;
  sender: "user" | "oracle";
  timestamp: Date;
  isAO?: boolean;
}

export default function OracleAISection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseClient();
  const { markAllAsRead } = useNotifications();

  // Scroll to show the latest message from the top
  const scrollToLatestMessage = () => {
    if (chatContainerRef.current && messagesEndRef.current) {
      const container = chatContainerRef.current;
      const messageElement = messagesEndRef.current
        .previousElementSibling as HTMLElement;

      if (messageElement) {
        // Scroll to show the top of the latest message
        const containerRect = container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        const scrollTop =
          container.scrollTop + (messageRect.top - containerRect.top);

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        // Fallback: scroll to bottom if we can't find the message element
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

  // Auto-stop loading when conversation is ready and messages are loaded
  useEffect(() => {
    if (conversationId && messages.length > 0 && isLoading) {
      // Stop loading when conversation is ready and messages are loaded
      console.log("Conversation ready with messages, stopping loading");
      setIsLoading(false);
    }
  }, [conversationId, messages.length, isLoading]);

  // Initialize conversation when component mounts
  useEffect(() => {
    initializeConversation();

    markAllAsRead();
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(fallbackTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up real-time subscription for AO responses
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`oracle_messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "oracle_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: {
          new: {
            id: string;
            message: string;
            sender_type: string;
            created_at: string;
            metadata?: { confidence_score?: number };
          };
        }) => {
          const newMessage = payload.new;

          if (newMessage.sender_type === "bot") {
            const oracleMessage: Message = {
              id: newMessage.id,
              content: newMessage.message,
              sender: "oracle",
              timestamp: new Date(newMessage.created_at),
              isAO: true,
            };
            setMessages((prev) => [...prev, oracleMessage]);
            setIsTyping(false);
          }
        }
      )
      .subscribe(() => {});

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  const initializeConversation = async () => {
    try {
      setIsLoading(true);

      // Get existing oracle conversations for this user
      const response = await fetch("/api/oracle/conversations", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get conversations");
      }

      const data = await response.json();
      let convId = conversationId;

      // Each user should have only ONE oracle conversation
      if (data.conversations && data.conversations.length > 0) {
        // Always use the first (and should be only) conversation
        convId = data.conversations[0].id;
      } else {
        const createResponse = await fetch("/api/oracle/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: "Oracle AI Guidance" }),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          convId = createData.conversation.id;
          console.log("Created new conversation:", convId);
        }
      }

      if (convId) {
        setConversationId(convId);
        // Load existing messages for this conversation
        await loadConversationHistory(convId);
        console.log("Conversation initialization completed successfully");
      } else {
        console.error("No conversation ID available");
      }
    } catch (error) {
      console.error("Error initializing oracle conversation:", error);
    } finally {
      console.log("Setting loading to false");
      // Use setTimeout to ensure state update happens
      setTimeout(() => {
        setIsLoading(false);
        console.log("Loading state set to false");
      }, 100);
    }
  };

  const loadConversationHistory = async (convId: string) => {
    try {
      console.log("Loading conversation history for:", convId);
      const response = await fetch(
        `/api/oracle/messages?conversation_id=${convId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("History response:", data);
        const historyMessages = data.messages || [];
        console.log("History messages count:", historyMessages.length);

        // Convert database messages to UI messages
        const uiMessages: Message[] = historyMessages.map(
          (msg: {
            id: string;
            message: string;
            sender_type: string;
            created_at: string;
            metadata?: { confidence_score?: number };
          }) => ({
            id: msg.id,
            content: msg.message,
            sender: msg.sender_type === "bot" ? "oracle" : "user",
            timestamp: new Date(msg.created_at),
            isAO: msg.sender_type === "bot",
            confidence_score: msg.metadata?.confidence_score,
          })
        );

        if (uiMessages.length > 0) {
          // User has message history - show their actual messages
          console.log("Setting UI messages:", uiMessages.length);
          setMessages(uiMessages);
        } else {
          // User has no message history - show welcome message
          const welcomeMessage: Message = {
            id: "welcome",
            content:
              "Welcome, sacred soul. I am AO, your ancestral guide. I am here to offer wisdom and support on your journey. What brings you to me today?",
            sender: "oracle",
            timestamp: new Date(),
            isAO: true,
          };
          setMessages([welcomeMessage]);
        }

        // Scroll to latest message after loading
        setTimeout(() => scrollToLatestMessage(), 100);
      } else {
        console.error(
          "Failed to load conversation history, status:",
          response.status
        );
        // Fallback: show welcome message if API fails
        const welcomeMessage: Message = {
          id: "welcome",
          content:
            "Welcome, sacred soul. I am AO, your ancestral guide. I am here to offer wisdom and support on your journey. What brings you to me today?",
          sender: "oracle",
          timestamp: new Date(),
          isAO: true,
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Error loading conversation history:", error);
      // Fallback: show welcome message on error
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Welcome, sacred soul. I am AO, your ancestral guide. I am here to offer wisdom and support on your journey. What brings you to me today?",
        sender: "oracle",
        timestamp: new Date(),
        isAO: true,
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Send message to n8n via oracle API
      const response = await fetch("/api/oracle/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await response.json();

      // The AO response will come via the real-time subscription
      // Fallback: Poll for new messages after 3 seconds if no real-time update
      setTimeout(() => {
        if (isTyping) {
          checkForNewMessages();
        }
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const checkForNewMessages = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/oracle/messages?conversation_id=${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        const latestMessages = data.messages || [];

        // Check if there are new bot messages
        const botMessages = latestMessages.filter(
          (msg: { sender_type: string }) => msg.sender_type === "bot"
        );
        const currentBotMessages = messages.filter(
          (msg) => msg.sender === "oracle" && msg.isAO
        );

        if (botMessages.length > currentBotMessages.length) {
          const newBotMessage = botMessages[botMessages.length - 1];
          const oracleMessage: Message = {
            id: newBotMessage.id,
            content: newBotMessage.message,
            sender: "oracle",
            timestamp: new Date(newBotMessage.created_at),
            isAO: true,
          };
          setMessages((prev) => [...prev, oracleMessage]);
          setIsTyping(false);
        }
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  return (
    <section id="oracle" className="pt-36 pb-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-light mb-6 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            DAILY CHECK-IN WITH AO
          </motion.h2>
          <motion.p
            className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Connect with the Oracle AI for daily guidance, wisdom, and support
            on your spiritual journey. Available 24/7 to offer insights and
            gentle guidance.
          </motion.p>
        </motion.div>

        <motion.div
          className="container mx-auto"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Chat interface preview/demo */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-primary-300/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Chat header */}
            <div
              className="bg-black/60 backdrop-blur-sm p-6 border-b border-primary-300/20"
              style={{ color: "#d8d2c6" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-300/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#d8d2c6" }}
                    >
                      Oracle AI
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span
                        className="text-sm"
                        style={{ color: "#d8d2c6", opacity: 0.8 }}
                      >
                        Always available
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="transition-colors hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {isOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={chatContainerRef}
              className={`overflow-y-auto h-[500px] transition-all duration-500 bg-black/20 backdrop-blur-sm`}
            >
              <div className="p-6 space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="flex items-center space-x-2 text-primary-300/60">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-300"></div>
                      <span>Loading conversation...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-primary-300/20 backdrop-blur-sm border border-primary-300/30"
                              : "bg-black/40 backdrop-blur-sm border border-primary-300/20"
                          }`}
                          style={{ color: "#d8d2c6" }}
                        >
                          {message.sender === "oracle" && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-primary-300/30 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-primary-300"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                                </svg>
                              </div>
                              <span
                                className="text-xs font-medium"
                                style={{ color: "#d8d2c6", opacity: 0.7 }}
                              >
                                Oracle AI
                              </span>
                              {message.isAO && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                                  AO
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-black/40 backdrop-blur-sm border border-primary-300/20 px-4 py-3 rounded-2xl max-w-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-primary-300/30 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-primary-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            </div>
                            <span className="text-sm text-primary-300/80 font-medium">
                              Oracle AI
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 bg-primary-300/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary-300/60 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary-300/60 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* Chat input */}
            <div className="p-6 bg-black/40 backdrop-blur-sm border-t border-primary-300/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your heart..."
                  className="flex-1 px-4 py-3 bg-black/30 backdrop-blur-sm border border-primary-300/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300/50 placeholder-primary-300/60"
                  style={{ color: "#d8d2c6" }}
                  disabled={isTyping || isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping || isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Oracle AI is here to support your journey with wisdom and
                compassion
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
              <p className="text-white/70 text-sm">
                The Oracle is always here when you need guidance, support, or a
                compassionate ear.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Compassionate Wisdom
              </h3>
              <p className="text-white/70 text-sm">
                Receive gentle guidance rooted in love, understanding, and
                spiritual insight.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Personalized Insights
              </h3>
              <p className="text-white/70 text-sm">
                Each interaction is tailored to your unique journey and current
                needs.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready for Your Daily Check-in?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Start each day with intention and guidance. The Oracle AI is
                waiting to support your journey with wisdom, love, and practical
                insights for your spiritual path.
              </p>
              <button className="bg-primary-300/20 text-primary-300 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-300/30 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Begin Your Daily Practice
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
