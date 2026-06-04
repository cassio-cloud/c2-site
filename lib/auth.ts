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
        const expected = process.env.ADMIN_PASSWORD || "c2admin";
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
