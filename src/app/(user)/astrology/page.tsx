import AstrologicalSection from "@/component/business/user/AstrologicalSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Astrological Ancestral Download - Sand Symes",
  description:
    "Unlock the cosmic wisdom encoded in your DNA and discover the sacred gifts passed down through your ancestral lineage.",
};

export default function AstrologyPage() {
  return (
    <div className="min-h-screen">
      <AstrologicalSection />

      <FullWidthImageSection
        imageUrl="/images/astrology.png"
        altText="Unlock cosmic wisdom encoded in your DNA and discover your ancestral gifts"
      />

      <DescriptionVisualSection
        title="COSMIC ANCESTRAL WISDOM"
        description="Your birth chart is a sacred map of your soul's journey, revealing the cosmic wisdom encoded in your DNA. Through astrological insights, you'll discover the gifts passed down through your ancestral lineage and understand your unique role in the grand tapestry of creation."
        visualPosition="left"
      />
    </div>
  );
}
