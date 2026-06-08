/**
 * Rate limit em memória para endpoints sensíveis do admin.
 *
 * Usado no /admin/login pra evitar brute force naive — sem isso,
 * a Vercel não tem rate-limit per-endpoint embutido.
 *
 * Limitações: cada function instance da Vercel tem seu próprio Map.
 * Em cold starts ou warm pool com múltiplas instâncias, atacante
 * coordenado pode esquivar parcialmente. Pra prod-grade, swap por
 * Upstash Redis. Pra single-admin como este caso, in-memory cobre
 * o cenário comum (script kiddie tentando senhas).
 */

type Bucket = {
  hits: number[];
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

/**
 * Tenta consumir uma "tentativa" do bucket associado a `key`.
 * Aceita se houver < `max` tentativas dentro da `windowMs`.
 */
export function consume(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  // Limpa hits que saíram da janela
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0];
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000),
    );
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

/** Limpa hits acumulados pra esse key (chamado em sucesso de login). */
export function reset(key: string) {
  buckets.delete(key);
}

/**
 * Extrai um identificador de IP do request da Vercel.
 * Headers em ordem de preferência: x-vercel-forwarded-for, x-forwarded-for, x-real-ip.
 */
export function getClientKey(headers: Headers): string {
  const fwd =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("x-forwarded-for") ??
    headers.get("x-real-ip") ??
    "anonymous";
  // x-forwarded-for pode vir "client, proxy1, proxy2" — pega o primeiro
  return fwd.split(",")[0].trim();
}
