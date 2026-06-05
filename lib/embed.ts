/**
 * Normalização de URLs de YouTube e Vimeo para embeds full-screen
 * estilo "background video" — autoplay muted loop sem controles.
 *
 * Usar URL embed evita carregar 104MB de reel.mp4 do servidor e
 * delega o streaming pro player oficial.
 */

export type EmbedSource =
  | {
      kind: "youtube";
      embedUrl: string;
      videoId: string;
      /** True quando a URL original é um Short (formato vertical 9:16). */
      isVertical: boolean;
    }
  | { kind: "vimeo"; embedUrl: string; videoId: string; isVertical: boolean }
  | { kind: "file"; src: string }
  | { kind: "none" };

/**
 * Captura YouTube em todos os formatos comuns:
 *   - youtube.com/watch?v=ABC
 *   - youtu.be/ABC
 *   - youtube.com/embed/ABC
 *   - youtube.com/v/ABC
 *   - youtube.com/shorts/ABC      ← Shorts (vertical)
 *   - m.youtube.com/... (mobile)
 *   - www.youtube.com/... (com subdomínio)
 */
const YT_REGEX =
  /(?:(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;

/** Detecta se a URL é um Short (vertical) antes de extrair o ID. */
const YT_SHORTS_REGEX = /youtube\.com\/shorts\//i;

const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function parseEmbedUrl(raw: string | undefined | null): EmbedSource {
  const input = (raw ?? "").trim();
  if (!input) return { kind: "none" };

  const yt = input.match(YT_REGEX);
  if (yt) {
    const id = yt[1];
    const isVertical = YT_SHORTS_REGEX.test(input);
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: id, // necessário pra loop funcionar
      controls: "0",
      rel: "0",
      showinfo: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return {
      kind: "youtube",
      videoId: id,
      embedUrl: `https://www.youtube.com/embed/${id}?${params.toString()}`,
      isVertical,
    };
  }

  const vimeo = input.match(VIMEO_REGEX);
  if (vimeo) {
    const id = vimeo[1];
    const params = new URLSearchParams({
      autoplay: "1",
      muted: "1",
      loop: "1",
      background: "1", // remove controles e UI
      controls: "0",
      playsinline: "1",
    });
    return {
      kind: "vimeo",
      videoId: id,
      embedUrl: `https://player.vimeo.com/video/${id}?${params.toString()}`,
      // Vimeo não tem flag de "shorts" — sempre 16/9 por default.
      // Se precisar marcar vertical no futuro, exige config manual.
      isVertical: false,
    };
  }

  // Path local começando com media/...
  if (input.startsWith("media/") || input.startsWith("/media/")) {
    return { kind: "file", src: input.replace(/^\//, "") };
  }

  return { kind: "none" };
}
