import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { ClientAuthGuard } from "@/component/provider/ClientAuthGuard";
import { NotificationProvider } from "@/component/provider/NotificationProvider";
import { NotificationToast } from "@/component/common/NotificationToast";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <NotificationProvider>
        <main className="min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-8">{children}</div>
          <Footer />
          <NotificationToast />
        </main>
      </NotificationProvider>
    </ClientAuthGuard>
  );
}
