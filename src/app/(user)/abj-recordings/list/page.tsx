import ABJRecordingsSection from "@/component/business/user/abj-recordings/ABJRecordingsSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import { SubscriptionRequired } from "@/component/common/SubscriptionRequired";

export default function ABJRecordingsListPage() {
  return (
    <SubscriptionRequired>
      <FullWidthImageSection
        imageUrl="/images/breathwork-2.png"
        altText="Sacred audio recordings and guided journeys for your spiritual
            practice. Each recording is crafted with intention to support your
            healing, growth, and connection to your authentic self."
      />
      <ABJRecordingsSection />
    </SubscriptionRequired>
  );
}
