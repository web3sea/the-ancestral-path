"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { UpdatePaymentMethod } from "./UpdatePaymentMethod";

interface UpdatePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdatePaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
}: UpdatePaymentMethodModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
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
          className="relative bg-black/95 border border-primary-300/20 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-300">
                Update Payment Method
              </h2>
              <button
                onClick={onClose}
                className="text-primary-300/50 hover:text-primary-300 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <UpdatePaymentMethod onSuccess={handleSuccess} onCancel={onClose} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
