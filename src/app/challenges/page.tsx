import MiniChallengesSection from "@/component/MiniChallengesSection";

export const metadata = {
  title: "Mini Challenges - Sand Symes",
  description:
    "Transform your life one small step at a time. Mini challenges with text instructions and video explanations from Sand.",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen">
      <MiniChallengesSection />
    </div>
  );
}
