import RetreatSection from "../../../component/business/RetreatSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Medicine Retreats - Sand Symes",
  description:
    "Transform your life through intimate healing journeys in sacred spaces. Join Sand for deeply transformative experiences that awaken your soul and heal your spirit.",
  keywords:
    "healing retreats, spiritual awakening, breathwork, meditation, Costa Rica, sacred ceremony, Sand Symes",
  authors: [{ name: "Sand Symes" }],
  openGraph: {
    title: "Medicine Retreats - Sand Symes",
    description:
      "Transform your life through intimate healing journeys in sacred spaces.",
    type: "website",
  },
};

export default function RetreatsPage() {
  return (
    <div className="min-h-screen">
      <RetreatSection />

      <FullWidthImageSection
        imageUrl="/images/retreats.png"
        altText="Transform your life through intimate healing journeys in sacred spaces and mystical locations"
      />

      <DescriptionVisualSection
        title="SACRED RETREAT EXPERIENCES"
        description="Step away from the ordinary and into the extraordinary. Our retreats are more than just getaways—they're sacred ceremonies of transformation, healing, and awakening. In these intimate gatherings, you'll experience deep healing, connect with like-minded souls, and return home forever changed."
        visualPosition="left"
      />
    </div>
  );
}
