import MiniChallengesSection from "@/component/business/MiniChallengesSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Mini Challenges - Sand Symes",
  description:
    "Transform your life one small step at a time. Mini challenges with text instructions and video explanations from Sand.",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen">
      <MiniChallengesSection />

      <FullWidthImageSection
        imageUrl="/images/challenge.png"
        altText="Transform your life one small step at a time with guided challenges and video explanations"
      />

      <DescriptionVisualSection
        title="SMALL STEPS, BIG TRANSFORMATIONS"
        description="Every challenge is an invitation to grow, heal, and transform. These mini challenges are designed to be accessible yet profound, guiding you through small but meaningful changes that create lasting impact on your life and spiritual journey."
        visualPosition="right"
      />
    </div>
  );
}
