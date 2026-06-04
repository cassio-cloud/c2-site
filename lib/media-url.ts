/**
 * Normaliza uma referência de mídia pra URL utilizável no <img>/<video>.
 *
 * - Path local (`media/cases/foo/01.jpg`) → `/media/cases/foo/01.jpg`
 *   (servido por public/ na Vercel CDN)
 * - URL absoluta (Vercel Blob, Spaces, qualquer http(s)://) → retorna intacta
 * - Path com `/` no início → mantido
 */
export function mediaSrc(src: string | undefined | null): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}
