import BreathworkSection from "@/component/business/breathwork/BreathworkSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";
import StickySection from "@/component/business/breathwork/StickySection";
import TestimonialSection from "@/component/business/breathwork/TestimonialSection";
import BreathworkDetailsSection from "@/component/business/breathwork/BreathworkDetailsSection";

export const metadata = {
  title: "Guided Breathwork Rituals - Sand Symes",
  description:
    "Transform your life through conscious breathing. Recorded Zoom video sessions designed to help you release stress, process emotions, and support healing.",
};

export default function BreathworkPage() {
  return (
    <div className="min-h-screen">
      <StickySection />
      <BreathworkDetailsSection />
      <BreathworkSection />
      <TestimonialSection />
      <FullWidthImageSection
        imageUrl="/images/breathwork.png"
        altText="Transform your life through conscious breathing and sacred breathwork practices"
      />

      <DescriptionVisualSection
        title="BREATHE INTO TRANSFORMATION"
        description="Every breath is a sacred opportunity to release what no longer serves you and invite in the healing energy of transformation. Through conscious breathing, you connect with your body's innate wisdom and unlock the door to profound healing and spiritual awakening."
        visualPosition="right"
      />
    </div>
  );
}
