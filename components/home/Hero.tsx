"use client";

import { useEffect, useRef } from "react";
import { Grain } from "./Grain";
import { parseEmbedUrl, type EmbedSource } from "@/lib/embed";
import { mediaSrc } from "@/lib/media-url";

type Props = {
  /** URL embed YouTube/Vimeo OU path local (`/media/reel.mp4`). */
  videoSrc: string;
};

/**
 * Hero full-viewport.
 *
 * - YouTube/Vimeo → iframe full-screen com autoplay+mute+loop, sem controles
 * - Local file → <video> com lazy-load via IntersectionObserver
 * - Vazio → fundo ink puro (fallback)
 */
export function Hero({ videoSrc }: Props) {
  const source = parseEmbedUrl(videoSrc);

  return (
    <section className="relative overflow-hidden bg-ink" style={{ minHeight: "100dvh" }}>
      <BackgroundVideo source={source} />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.15) 50%, rgba(13,13,13,0.45) 100%)",
        }}
      />
      <Grain />

      <div
        className="wrap relative z-10 flex h-[100dvh] items-end"
        style={{ paddingBottom: "clamp(120px, 18vh, 220px)" }}
      >
        <h1
          className="font-bold lowercase tracking-tight"
          style={{
            fontSize: "clamp(36px, 8.4vw, 148px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          where content
          <br />
          meets craft.
        </h1>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div
          className="wrap flex items-center justify-between font-mono text-mute-1"
          style={{
            paddingBlock: "clamp(20px, 3vh, 36px)",
            fontSize: "clamp(10px, 0.85vw, 12px)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>Rio Grande do Sul · São Paulo</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}

/** Background video que cobre full-screen mantendo aspect-ratio (object-cover). */
function BackgroundVideo({ source }: { source: EmbedSource }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (source.kind !== "file") return;
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !v.src) {
            v.src = mediaSrc(source.src);
            v.load();
            io.disconnect();
          }
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [source]);

  if (source.kind === "youtube" || source.kind === "vimeo") {
    // Cover full-screen 16:9: container ocupa 100% e o iframe é
    // dimensionado pra max(largura, altura*16/9), centralizado.
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "max(100vw, 177.78dvh)",
            height: "max(56.25vw, 100dvh)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <iframe
            src={source.embedUrl}
            title="Reel"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="block h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    );
  }

  if (source.kind === "file") {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.92]"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
    );
  }

  return null;
}
