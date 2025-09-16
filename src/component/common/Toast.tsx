"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-sage" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-gold" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-400" />;
  }
};

const getToastColors = (type: ToastType) => {
  switch (type) {
    case "success":
      return "bg-sage/10 border-sage/20 text-sage";
    case "error":
      return "bg-red-400/10 border-red-400/20 text-red-400";
    case "warning":
      return "bg-gold/10 border-gold/20 text-gold";
    case "info":
      return "bg-blue-400/10 border-blue-400/20 text-blue-400";
  }
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();

  const handleRemove = useCallback(() => {
    removeToast(toast.id);
  }, [toast.id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm ${getToastColors(
        toast.type
      )}`}
    >
      <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-primary-300">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-sm text-primary-300/70 mt-1">{toast.message}</p>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-primary-300/50 hover:text-primary-300 transition-colors p-1 rounded-lg hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "success", title, message });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "error", title, message });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "warning", title, message });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "info", title, message });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
