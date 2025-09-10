"use client";

import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AuthErrorProps {
  message: string;
  type?: "error" | "warning" | "info";
}

export function AuthError({ message, type = "error" }: AuthErrorProps) {
  const styles = {
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  const icons = {
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div className={`mb-6 p-4 border rounded-lg ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

interface AuthInfoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "premium";
}

export function AuthInfoCard({
  title,
  description,
  children,
  variant = "default",
}: AuthInfoCardProps) {
  const styles = {
    default: "bg-primary-300/5 border-primary-300/20",
    success: "bg-green-500/5 border-green-500/20",
    premium:
      "bg-gradient-to-r from-primary-300/10 to-primary-300/5 border-primary-300/30",
  };

  return (
    <div className={`mb-6 p-5 border rounded-xl ${styles[variant]}`}>
      <div className="flex items-center gap-2 mb-3">
        {variant === "success" && (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
        {variant === "premium" && (
          <div className="w-2 h-2 rounded-full bg-primary-300"></div>
        )}
        <h3 className="text-primary-300 font-medium">{title}</h3>
      </div>
      <p className="text-primary-300/70 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}

interface FeatureListProps {
  features: string[];
  showCheckmarks?: boolean;
}

export function FeatureList({
  features,
  showCheckmarks = true,
}: FeatureListProps) {
  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          {showCheckmarks && (
            <div className="w-5 h-5 rounded-full bg-primary-300/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-primary-300" />
            </div>
          )}
          <span className="text-primary-300/80 text-sm">{feature}</span>
        </div>
      ))}
    </div>
  );
}

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export function PricingCard({
  tier,
  price,
  period,
  features,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isPopular
          ? "bg-primary-300/10 border-primary-300/30"
          : "bg-primary-300/5 border-primary-300/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-primary-300 font-medium">{tier}</h4>
        {isPopular && (
          <span className="text-xs bg-primary-300/20 text-primary-300 px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>
      <div className="mb-3">
        <span className="text-2xl font-semibold text-primary-300">{price}</span>
        <span className="text-primary-300/70 text-sm ml-1">/{period}</span>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary-300 flex-shrink-0" />
            <span className="text-primary-300/80 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
