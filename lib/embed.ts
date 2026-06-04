/**
 * Normalização de URLs de YouTube e Vimeo para embeds full-screen
 * estilo "background video" — autoplay muted loop sem controles.
 *
 * Usar URL embed evita carregar 104MB de reel.mp4 do servidor e
 * delega o streaming pro player oficial.
 */

export type EmbedSource =
  | { kind: "youtube"; embedUrl: string; videoId: string }
  | { kind: "vimeo"; embedUrl: string; videoId: string }
  | { kind: "file"; src: string }
  | { kind: "none" };

const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;
const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function parseEmbedUrl(raw: string | undefined | null): EmbedSource {
  const input = (raw ?? "").trim();
  if (!input) return { kind: "none" };

  const yt = input.match(YT_REGEX);
  if (yt) {
    const id = yt[1];
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
    };
  }

  // Path local começando com media/...
  if (input.startsWith("media/") || input.startsWith("/media/")) {
    return { kind: "file", src: input.replace(/^\//, "") };
  }

  return { kind: "none" };
}
