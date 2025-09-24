import ResourcesSection from "@/component/business/user/ResourcesSection";
import { SubscriptionRequired } from "@/component/common/SubscriptionRequired";

export default function ResourcesPage() {
  return (
    <SubscriptionRequired>
      <ResourcesSection />
    </SubscriptionRequired>
  );
}
