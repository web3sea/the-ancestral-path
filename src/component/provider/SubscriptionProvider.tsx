import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSubscriptionStatus } from "@/component/hook/useSubscriptionStatus";
import { PaymentFailureNotification } from "@/component/common/PaymentFailureNotification";
import { UpdatePaymentMethod } from "@/component/common/UpdatePaymentMethod";

interface SubscriptionContextType {
  showPaymentFailureModal: boolean;
  setShowPaymentFailureModal: (show: boolean) => void;
  showPaymentMethodModal: boolean;
  setShowPaymentMethodModal: (show: boolean) => void;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }
  return context;
}

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { data: session } = useSession();
  const { isActive, isExpired, isInGracePeriod, refreshSubscription } =
    useSubscriptionStatus();

  const [showPaymentFailureModal, setShowPaymentFailureModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [hasShownGracePeriodWarning, setHasShownGracePeriodWarning] =
    useState(false);

  // Monitor subscription status and show appropriate modals
  useEffect(() => {
    if (!session?.user) return;

    // Show payment failure modal if in grace period
    if (isInGracePeriod && !hasShownGracePeriodWarning) {
      setShowPaymentFailureModal(true);
      setHasShownGracePeriodWarning(true);
      // Show a toast notification instead of alert
      console.warn(
        "Your subscription is in a grace period due to a payment failure."
      );
    }

    // Show payment method modal if expired
    if (isExpired && !isInGracePeriod) {
      setShowPaymentMethodModal(true);
      console.error(
        "Your subscription has expired. Please update your payment method."
      );
    }

    // Reset warning flag when subscription becomes active
    if (isActive) {
      setHasShownGracePeriodWarning(false);
    }
  }, [
    session?.user,
    isActive,
    isExpired,
    isInGracePeriod,
    hasShownGracePeriodWarning,
  ]);

  // Auto-refresh subscription status periodically
  useEffect(() => {
    if (!session?.user) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [session?.user, refreshSubscription]);

  const handlePaymentMethodSuccess = () => {
    console.log("Payment method updated successfully!");
    setShowPaymentMethodModal(false);
    setShowPaymentFailureModal(false);
    refreshSubscription();
  };

  const contextValue: SubscriptionContextType = {
    showPaymentFailureModal,
    setShowPaymentFailureModal,
    showPaymentMethodModal,
    setShowPaymentMethodModal,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}

      {/* Global Modals */}
      <PaymentFailureNotification
        visible={showPaymentFailureModal}
        onClose={() => setShowPaymentFailureModal(false)}
        onUpdatePaymentMethod={() => {
          setShowPaymentFailureModal(false);
          setShowPaymentMethodModal(true);
        }}
      />

      <UpdatePaymentMethod
        visible={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onSuccess={handlePaymentMethodSuccess}
      />
    </SubscriptionContext.Provider>
  );
}
