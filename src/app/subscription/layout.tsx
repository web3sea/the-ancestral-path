import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { ClientAuthGuard } from "@/component/provider/ClientAuthGuard";

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <main className="min-h-screen">
        <Header />
        {children}
        <Footer />
      </main>
    </ClientAuthGuard>
  );
}
