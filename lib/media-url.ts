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

/* ── Variantes de vídeo ──────────────────────────────────────────────
 *
 * `scripts/media-variants.sh` gera, ao lado de cada vídeo em
 * `public/media/cases`, três arquivos derivados por convenção de nome:
 *
 *   01.mp4          original — intocado, é o que a lightbox entrega
 *   01.preview.mp4  ~1 Mbps, mudo — tile da home
 *   01.poster.jpg   primeiro frame — preenche o tile antes do vídeo carregar
 *   02.web.mp4      só para fontes `.mov` (ver `webSrc` abaixo)
 *
 * A convenção só vale para vídeos locais sob `media/cases/`: são os que o
 * script varre e que vão versionados no deploy. Upload feito pelo admin em
 * produção cai no Vercel Blob como URL absoluta, e aí não há variante — os
 * helpers devolvem `null` e o componente cai de volta no arquivo original.
 */

const VIDEO_LOCAL = /^\/?media\/cases\/.+\.(mp4|mov|webm|m4v)$/i;

/** Troca a extensão do path por outro sufixo (`01.mov` → `01.web.mp4`). */
function variante(src: string, sufixo: string): string | null {
  if (!VIDEO_LOCAL.test(src)) return null;
  return mediaSrc(src.replace(/\.[^.]+$/, sufixo));
}

/** Versão leve e muda pro tile da home. `null` → usar o original. */
export function previewSrc(src: string): string | null {
  return variante(src, ".preview.mp4");
}

/**
 * Versão web do player inline do case — existe só para fontes `.mov`.
 *
 * Todos os `.mp4` do projeto já saem do editor com o índice no início do
 * arquivo (faststart), então o próprio original já começa a tocar nos
 * primeiros KB: gerar uma cópia seria só peso a mais no deploy. O `.mov`
 * é o caso à parte — índice no fim e container que Chrome e Firefox
 * suportam mal —, e aí a variante `.web.mp4` vale a pena.
 */
export function webSrc(src: string): string | null {
  if (!/\.mov$/i.test(src)) return null;
  return variante(src, ".web.mp4");
}

/** Primeiro frame — evita o retângulo cinza enquanto o vídeo baixa. */
export function posterSrc(src: string): string | null {
  return variante(src, ".poster.jpg");
}
