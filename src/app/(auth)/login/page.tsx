import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextValue = typeof params?.next === "string" ? params.next : "";
  const hasError = params?.error === "1" || params?.error === "true";
  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password");
    const next = (formData.get("next") as string | null) ?? null;

    if (password !== process.env.ADMIN_PASSWORD) {
      redirect(
        `/login${
          next ? `?next=${encodeURIComponent(next)}&error=1` : "?error=1"
        }`
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });

    redirect(next && next.startsWith("/admin") ? next : "/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm bg-black/80 border border-primary-300/20 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-primary-300 mb-4">
          Admin Login
        </h1>
        <form action={login} className="space-y-3">
          <input type="hidden" name="next" defaultValue={nextValue} />
          {hasError && <p className="text-red-400 text-sm">Invalid password</p>}
          <div>
            <label className="block text-sm text-primary-300/80 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300"
              required
            />
          </div>
          <button type="submit" className="btn-secondary w-full">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
