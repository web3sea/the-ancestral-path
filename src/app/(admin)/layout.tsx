// import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import SidebarNav from "@/component/layout/admin/SidebarNav";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logout = async () => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
    redirect("/admin/login");
  };

  return (
    <div
      className={`min-h-screen bg-black text-primary-300 ${roboto.className}`}
    >
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-primary-300/20 bg-black/60 backdrop-blur flex flex-col">
          <div className="px-5 py-4 border-b border-primary-300/20 h-20">
            <h1 className="text-lg font-semibold">Admin</h1>
            <p className="text-xs text-primary-300/70">Sand Symes Platform</p>
          </div>
          <SidebarNav />
          <div className="mt-auto p-3">
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-primary-300"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </aside>

        <section className="flex-1">
          <header className="sticky top-0 z-10 border-b border-primary-300/20 bg-black/60 backdrop-blur px-6 py-3 h-20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-primary-300/80">Admin Panel</div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </section>
      </div>
    </div>
  );
}
