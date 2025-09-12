import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { Role } from "@/@types/enum";
import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import SandSymesExperienceSection from "@/component/business/user/home/SandSymesExperienceSection";
import SandsTripleE from "@/component/business/user/home/SandsTripleESection";
import StickySection from "@/component/business/user/home/StickySection";
import TripleEMethodologySection from "@/component/business/user/home/TripleEMethodologySection";
import UniqueApproachSection from "@/component/business/user/home/UniqueApproachSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata: Metadata = {
  title: "Sand Symes Wellness AO Platform",
  description:
    "Experience guided breathwork rituals, meditations, wisdom drops, and daily check-ins with the Oracle AI. Your journey to healing and transformation starts here.",
  keywords:
    "breathwork, meditation, wellness, healing, oracle, astrology, spiritual guidance",
  authors: [{ name: "Sand Symes" }],
  openGraph: {
    title: "Sand Symes Wellness AO Platform",
    description:
      "Experience guided breathwork rituals, meditations, wisdom drops, and daily check-ins with the Oracle AI.",
    type: "website",
  },
  icons: {
    icon: "/logo.ico",
  },
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Admin users - redirect to admin dashboard
  if (session?.user?.role === Role.ADMIN) {
    redirect("/admin");
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <SandSymesExperienceSection />
        <StickySection />
        <SandsTripleE />
        <TripleEMethodologySection />
        <UniqueApproachSection />

        <FullWidthImageSection
          imageUrl="https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg"
          altText="Transform your life through sacred healing practices and ancestral wisdom"
        />

        <DescriptionVisualSection
          title="EMBRACE YOUR SACRED PATH"
          description="Every step on your healing journey is guided by ancient wisdom and modern understanding. Through breathwork, meditation, and spiritual practices, you'll discover the profound connection between your body, mind, and soul. This is not just healing—it's a sacred transformation that honors your ancestors and prepares you for the future."
          visualPosition="left"
        />
      </div>
      <Footer />
    </>
  );
}
