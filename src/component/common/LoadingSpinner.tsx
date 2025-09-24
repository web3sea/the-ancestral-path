"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "text-primary-300",
    secondary: "text-white/80",
    accent: "text-gold",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[variant]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            animate={{
              strokeDashoffset: [31.416, 0, 31.416],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {text && (
        <motion.p
          className={`text-sm font-medium ${colorClasses[variant]} opacity-80`}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Specialized loading components for different contexts
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/70">
      <div className="text-center">
        <LoadingSpinner size="xl" variant="primary" />
        <motion.p
          className="mt-6 text-lg font-light"
          style={{ color: "#d8d2c6" }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}

export function CardLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <div className="animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-300/20 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-primary-300/20 rounded mb-2"></div>
                <div className="h-4 bg-primary-300/10 rounded w-20"></div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-primary-300/20 rounded"></div>
              <div className="h-4 bg-primary-300/10 rounded w-24"></div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-primary-300/10 rounded"></div>
              <div className="h-4 bg-primary-300/10 rounded w-5/6"></div>
              <div className="h-4 bg-primary-300/10 rounded w-4/6"></div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <div className="h-8 bg-primary-300/20 rounded w-20"></div>
              <div className="h-8 bg-white/10 rounded w-24"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white/5 border border-primary-300/20 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-primary-300/20 bg-black/20">
        <div className="h-6 bg-primary-300/20 rounded w-32 animate-pulse"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/40">
            <tr>
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="px-6 py-4">
                  <div className="h-4 bg-primary-300/20 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-300/10">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/5">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-primary-300/10 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" variant="primary" />
      {text && <span className="text-sm text-primary-300/80">{text}</span>}
    </div>
  );
}

export function RecordingsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <LoadingSpinner key={index} size="lg" variant="primary" />
      ))}
    </div>
  );
}
