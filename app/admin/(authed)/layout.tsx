import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Layout do route group (authed). Toda página dentro de
 * app/admin/(authed)/ exige sessão.
 *
 * O group não vira segmento de URL: /admin/(authed)/page.tsx → /admin
 */
export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b border-line">
        <div className="wrap flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold tracking-tight" style={{ letterSpacing: "-0.04em" }}>
              C2 · Admin
            </Link>
            <nav className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
              <Link href="/admin" className="hover:text-paper">Cases</Link>
              <Link href="/admin/site" className="hover:text-paper">Site</Link>
              <Link href="/admin/team" className="hover:text-paper">Time</Link>
              <Link href="/admin/logos" className="hover:text-paper">Logos</Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
            >
              Sair →
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
