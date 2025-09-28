"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface Notification {
  id: string;
  type: "oracle_message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  conversation_id?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  showNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  const supabase = createSupabaseClient();
  const pathname = usePathname();

  const accountId = session?.user?.accountId || session?.user?.id;

  // Check if user is currently on the Oracle page
  const isOnOraclePage = pathname === "/oracle";

  // Load initial unread count from database when user logs in
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!accountId || !session) {
        return;
      }

      try {
        const response = await fetch("/api/oracle/unread-count");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUnreadCount(data.unreadCount);

            // Store in localStorage for persistence
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `unread_count_${accountId}`,
                data.unreadCount.toString()
              );
            }
          }
        }
      } catch (error) {
        console.error("Error loading unread count:", error);

        // Fallback to localStorage if API fails
        if (typeof window !== "undefined") {
          const storedCount = localStorage.getItem(`unread_count_${accountId}`);
          if (storedCount) {
            setUnreadCount(parseInt(storedCount, 10));
          }
        }
      }
    };

    loadUnreadCount();

    // Also listen for when the user comes back online
    const handleOnline = () => {
      if (accountId && session) {
        loadUnreadCount();
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [accountId, session]);

  useEffect(() => {
    if (!accountId || !session) {
      return;
    }

    const channel = supabase
      .channel(`user_notifications_${accountId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "oracle_messages",
          filter: `sender_type=eq.bot`,
        },
        async (payload) => {
          const { data: conversation, error } = await supabase
            .from("oracle_conversations")
            .select("user_id")
            .eq("id", payload.new.conversation_id)
            .eq("user_id", accountId)
            .single();

          if (error || !conversation) {
            return;
          }

          const notification: Notification = {
            id: `oracle_${payload.new.id}`,
            type: "oracle_message",
            title: "New Oracle AI Response",
            message:
              payload.new.message.length > 100
                ? payload.new.message.substring(0, 100) + "..."
                : payload.new.message,
            timestamp: new Date(payload.new.created_at),
            read: false,
            conversation_id: payload.new.conversation_id,
          };

          setNotifications((prev) => [notification, ...prev]);

          // Only increment unread count if user is NOT on the Oracle page
          if (!isOnOraclePage) {
            setUnreadCount((prev) => {
              const newCount = prev + 1;

              // Update localStorage
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  `unread_count_${accountId}`,
                  newCount.toString()
                );
              }

              return newCount;
            });
          }

          // Show browser notification only if user is NOT on the Oracle page
          if (Notification.permission === "granted" && !isOnOraclePage) {
            new Notification("Oracle AI Response", {
              body: notification.message,
              icon: "/logo.ico",
              tag: notification.id,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, session, supabase, isOnOraclePage]);

  // Request notification permission on mount
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => {
        const newCount = Math.max(0, prev - 1);

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `unread_count_${accountId}`,
            newCount.toString()
          );
        }

        return newCount;
      });

      // Mark as read in database
      try {
        await fetch("/api/oracle/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageIds: [id] }),
        });
      } catch (error) {
        console.error("Error marking message as read in database:", error);
      }
    },
    [accountId]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`unread_count_${accountId}`, "0");
    }

    // Mark all as read in database
    try {
      await fetch("/api/oracle/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId: null, markAll: true }),
      });
    } catch (error) {
      console.error("Error marking all messages as read in database:", error);
    }
  }, [accountId]);

  const showNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `${notification.type}_${Date.now()}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    []
  );

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
