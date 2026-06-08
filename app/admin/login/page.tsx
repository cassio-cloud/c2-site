import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { consume, getClientKey, reset } from "@/lib/rate-limit";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ error?: string; from?: string; retry?: string }>;

/** Rate limit: 5 tentativas por 5 minutos por IP. */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const session = await auth();
  if (session) redirect("/admin");

  const { error, from, retry } = await props.searchParams;

  /** Server Action — chama signIn no servidor com rate limit por IP. */
  async function login(formData: FormData) {
    "use server";
    const h = await headers();
    const ip = getClientKey(h);
    const key = `login:${ip}`;

    const rl = consume(key, MAX_ATTEMPTS, WINDOW_MS);
    if (!rl.ok) {
      const fromParam = from ? `&from=${from}` : "";
      redirect(
        `/admin/login?error=rate&retry=${rl.retryAfterSec}${fromParam}`,
      );
    }

    const password = String(formData.get("password") ?? "");
    try {
      await signIn("credentials", {
        password,
        redirectTo: from || "/admin",
      });
      // Sucesso → libera bucket
      reset(key);
    } catch (e) {
      // signIn lança redirect via NEXT_REDIRECT — re-throw
      if (e && typeof e === "object" && "digest" in e) {
        // O signIn em caso de sucesso lança NEXT_REDIRECT.
        // Se a senha tiver sido aceita, o digest tem padrão diferente
        // do erro de auth. Em ambos os casos, repassa.
        // Bonus: libera bucket no caminho de sucesso também.
        reset(key);
        throw e;
      }
      redirect(`/admin/login?error=invalid${from ? `&from=${from}` : ""}`);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6">
      <form
        action={login}
        className="w-full max-w-sm rounded border border-line bg-ink-2/40 p-8"
      >
        <Link
          href="/"
          className="font-bold tracking-tight"
          style={{ fontSize: "20px", letterSpacing: "-0.04em" }}
        >
          C2.
        </Link>
        <h1 className="mt-6 text-xl font-bold">Acesso admin</h1>
        <p className="mt-2 text-sm text-mute-2">
          Use a senha do painel.
        </p>

        <label className="mt-8 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
            Senha
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-paper outline-none focus:border-paper"
          />
        </label>

        {error === "invalid" ? (
          <p className="mt-4 text-xs text-accent">Senha incorreta.</p>
        ) : null}
        {error === "rate" ? (
          <p className="mt-4 text-xs text-accent">
            Muitas tentativas. Tente de novo em {retry ?? "alguns"} segundos.
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-8 w-full rounded bg-paper px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
