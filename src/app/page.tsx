import {
  validateSession,
  hasValidSubscription,
} from "@/lib/auth/session-utils";
import { Role } from "@/@types/enum";
import UserDashboard from "./(user)/page";
import { SubscriptionSection } from "@/component/business/user/SubscriptionSection";
import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { redirect } from "next/navigation";
import { Metadata } from "next";

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
  const session = await validateSession();

  // Admin users - redirect to admin dashboard
  if (session.user.role === Role.ADMIN) {
    redirect("/admin");
  }

  // Check subscription status for regular users
  if (!hasValidSubscription(session)) {
    return (
      <>
        <Header />
        <SubscriptionSection />
        <Footer />
      </>
    );
  }

  // User has valid subscription - show dashboard
  return (
    <>
      <Header />
      <UserDashboard />
      <Footer />
    </>
  );
}
