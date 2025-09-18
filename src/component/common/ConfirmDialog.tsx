"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context;
}

function ConfirmDialogModal({
  isOpen,
  onClose,
  onConfirm,
  options,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  options: ConfirmDialogOptions;
}) {
  if (!isOpen) return null;

  const getTypeColors = () => {
    switch (options.type) {
      case "danger":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "warning":
        return "text-gold bg-gold/10 border-gold/20";
      case "info":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-gold bg-gold/10 border-gold/20";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-black/70 border border-primary-300/20 rounded-2xl w-full max-w-xl shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 p-2 rounded-lg border ${getTypeColors()}`}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-primary-300 mb-2">
                  {options.title}
                </h3>
                <p className="text-sm text-primary-300/70 mb-6">
                  {options.message}
                </p>

                <div className="flex gap-3 justify-end">
                  <button onClick={onClose} className="btn-secondary text-sm">
                    {options.cancelText || "Cancel"}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`btn-primary text-sm ${
                      options.type === "danger"
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                  >
                    {options.confirmText || "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: "",
    message: "",
  });
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(options);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialogModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        options={options}
      />
    </ConfirmDialogContext.Provider>
  );
}
