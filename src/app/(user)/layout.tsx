import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
