"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/component/provider/NotificationProvider";
import { Bell, X, MessageCircle } from "lucide-react";

export function NotificationToast() {
  const { notifications, markAsRead } = useNotifications();
  const [showToast, setShowToast] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    conversation_id?: string;
  } | null>(null);

  useEffect(() => {
    const latestUnreadNotification = notifications.find((n) => !n.read);

    if (latestUnreadNotification) {
      if (
        !currentNotification ||
        latestUnreadNotification.id !== currentNotification.id
      ) {
        setCurrentNotification(latestUnreadNotification);
        setShowToast(true);

        const timer = setTimeout(() => {
          setShowToast(false);
        }, 8000);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    setShowToast(false);
    if (currentNotification) {
      markAsRead(currentNotification.id);
    }
  };

  return (
    <AnimatePresence>
      {showToast && currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-black/90 backdrop-blur-sm border border-primary-300/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-300/20 rounded-full flex items-center justify-center flex-shrink-0">
                {currentNotification.type === "oracle_message" ? (
                  <MessageCircle className="w-4 h-4 text-primary-300" />
                ) : (
                  <Bell className="w-4 h-4 text-primary-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-primary-300 mb-1">
                  {currentNotification.title}
                </h4>
                <p className="text-xs text-primary-300/80 line-clamp-3">
                  {currentNotification.message}
                </p>
                <p className="text-xs text-primary-300/60 mt-2">
                  {currentNotification.timestamp.toLocaleTimeString()}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-6 h-6 rounded-full bg-primary-300/10 hover:bg-primary-300/20 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-3 h-3 text-primary-300/60" />
              </button>
            </div>

            {currentNotification.conversation_id && (
              <div className="mt-3 pt-3 border-t border-primary-300/10">
                <button
                  onClick={() => {
                    window.location.href = "/oracle";
                    handleClose();
                  }}
                  className="text-xs text-primary-300 hover:text-primary-200 transition-colors"
                >
                  View Conversation →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
