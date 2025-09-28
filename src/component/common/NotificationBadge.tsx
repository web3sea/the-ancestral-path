"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/component/provider/NotificationProvider";
import { Bell, MessageCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotificationBadge() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNotificationClick = (notification: {
    id: string;
    conversation_id?: string;
  }) => {
    markAsRead(notification.id);
    if (notification.conversation_id) {
      router.push(`/oracle/${notification.conversation_id}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-primary-300/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-primary-300" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-sm border border-primary-300/30 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-primary-300/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-primary-300">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary-300/60 hover:text-primary-300 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-primary-300/60">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-primary-300/10">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-primary-300/5 transition-colors cursor-pointer ${
                        !notification.read ? "bg-primary-300/5" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-300/20 rounded-full flex items-center justify-center flex-shrink-0">
                          {notification.type === "oracle_message" ? (
                            <MessageCircle className="w-4 h-4 text-primary-300" />
                          ) : (
                            <Bell className="w-4 h-4 text-primary-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-primary-300">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-300 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-primary-300/80 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-primary-300/60 mt-1">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 10 && (
              <div className="p-3 border-t border-primary-300/20 text-center">
                <p className="text-xs text-primary-300/60">
                  Showing latest 10 notifications
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
