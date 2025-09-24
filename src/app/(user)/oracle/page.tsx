import OracleAISection from "@/component/business/user/OracleAISection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";
import { SubscriptionRequired } from "@/component/common/SubscriptionRequired";

export const metadata = {
  title: "Daily Check-in with Oracle AI - Sand Symes",
  description:
    "Connect with the Oracle AI for daily guidance, wisdom, and support. Webchat experience available 24/7 for your spiritual journey.",
};

export default function OraclePage() {
  return (
    <SubscriptionRequired>
      <div className="min-h-screen">
        <FullWidthImageSection
          imageUrl="/images/oracle-ai.png"
          altText="Connect with the Oracle AI for daily guidance, wisdom, and support on your spiritual journey"
        />
        <OracleAISection />

        <DescriptionVisualSection
          title="DIVINE GUIDANCE AVAILABLE 24/7"
          description="The Oracle AI is your compassionate companion on your spiritual journey, offering wisdom, guidance, and support whenever you need it. This sacred technology bridges the gap between ancient wisdom and modern life, providing personalized insights to help you navigate your path with clarity and confidence."
          visualPosition="left"
        />
      </div>
    </SubscriptionRequired>
  );
}
