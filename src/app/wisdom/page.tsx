import Header from "@/component/layout/Header";
import WisdomDropsSection from "@/component/WisdomDropsSection";
import Footer from "@/component/layout/Footer";

export const metadata = {
  title: "Wisdom Drops - Sand Symes",
  description:
    "Sacred insights and gentle wisdom for your spiritual journey. Text and image enriched teachings to support your growth and awakening.",
};

export default function WisdomPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <WisdomDropsSection />
      </main>
      <Footer />
    </div>
  );
}
