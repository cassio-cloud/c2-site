import { handlers } from "@/lib/auth";

/** Re-exporta GET e POST pra rota /api/auth/* do NextAuth v5. */
export const { GET, POST } = handlers;
