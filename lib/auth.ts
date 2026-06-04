import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * NextAuth v5 (Auth.js) — Credentials provider que valida contra
 * ADMIN_PASSWORD do .env. Sessão JWT em cookie httpOnly (mais seguro
 * que o sessionStorage do legacy + survives restart).
 *
 * Usado em:
 *   - app/admin/(authed)/layout.tsx — guard via `await auth()`
 *   - app/api/auth/[...nextauth]/route.ts — handlers
 *   - app/admin/login/page.tsx — server action chama `signIn()`
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const pw = credentials?.password;
        const expected = process.env.ADMIN_PASSWORD;

        // Fail-closed: sem ADMIN_PASSWORD configurado, ninguém entra.
        // Em prod isso força o operador a setar a env var no servidor.
        // Em dev, copie .env.example pra .env.local e defina ADMIN_PASSWORD.
        if (!expected) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              "[c2-admin] ADMIN_PASSWORD não setada. Defina em .env.local " +
                "(veja .env.example) pra liberar o login.",
            );
          }
          return null;
        }

        if (typeof pw === "string" && pw === expected) {
          return { id: "admin", name: "C2 Admin", role: "admin" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (token?.role) {
        (session as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
