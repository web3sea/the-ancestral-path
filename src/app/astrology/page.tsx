import AstrologicalSection from "@/component/AstrologicalSection";

export const metadata = {
  title: "Astrological Ancestral Download - Sand Symes",
  description:
    "Unlock the cosmic wisdom encoded in your DNA and discover the sacred gifts passed down through your ancestral lineage.",
};

export default function AstrologyPage() {
  return (
    <div className="min-h-screen">
      <main>
        <AstrologicalSection />
      </main>
    </div>
  );
}
