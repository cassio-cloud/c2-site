"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { mediaSrc } from "@/lib/media-url";
import { parseEmbedUrl } from "@/lib/embed";
import { useYouTubeClipLoop } from "@/lib/youtube-clip-loop";

type Props = {
  cover: MediaItem;
  alt: string;
};

/**
 * Mídia do tile: imagem otimizada via next/image, vídeo com lazy-load
 * + play-on-view, OU embed (YouTube/Vimeo) também lazy.
 *
 * Embeds usam params autoplay+mute+loop+sem-controles e cover trick
 * via container queries, mantendo letterboxing-free no tile.
 */
export function TileMedia({ cover, alt }: Props) {
  if (cover.type === "embed") {
    return <EmbedCover src={cover.src} />;
  }

  if (cover.type === "video") {
    return <VideoCover src={cover.src} />;
  }

  return (
    <Image
      src={mediaSrc(cover.src)}
      alt={alt}
      fill
      sizes="(max-width: 900px) 100vw, 50vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
    />
  );
}

// ── Embed ──────────────────────────────────────────────────────────

/** Duração do clip-preview no tile (segundos). */
const CLIP_LOOP_SECONDS = 10;

function EmbedCover({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const parsed = parseEmbedUrl(src);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Loop curto via YouTube Player API (só ativo quando o iframe
  // existe e a URL é YouTube com enablejsapi=1).
  const isYouTube = parsed.kind === "youtube";
  useYouTubeClipLoop(iframeRef, CLIP_LOOP_SECONDS, shouldLoad && isYouTube);

  if (parsed.kind !== "youtube" && parsed.kind !== "vimeo") {
    return null;
  }

  const isVertical = parsed.isVertical;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-ink-3"
      style={{ containerType: "size" }}
    >
      {shouldLoad ? (
        <>
          <iframe
            ref={iframeRef}
            src={parsed.embedUrl}
            title=""
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            tabIndex={-1}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={
              isVertical
                ? {
                    // Vídeo 9/16: encaixa pela altura; largura proporcional
                    width: "max(100cqw, 56.25cqh)",
                    height: "max(177.78cqw, 100cqh)",
                    border: 0,
                  }
                : {
                    // Vídeo 16/9: encaixa pela largura; altura proporcional
                    width: "max(100cqw, 177.78cqh)",
                    height: "max(56.25cqw, 100cqh)",
                    border: 0,
                  }
            }
          />
          {/*
            Scrim invisível por cima do iframe. Captura todos os toques
            e impede que o YouTube mostre seu overlay touch-controls em
            mobile. Não tem onClick — o click bubble naturalmente até
            o <Link> ancestor que envolve o tile inteiro.
          */}
          <div
            className="absolute inset-0 z-10"
            aria-hidden
            style={{ cursor: "pointer" }}
          />
        </>
      ) : null}
    </div>
  );
}

// ── Video local ────────────────────────────────────────────────────

function VideoCover({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const srcIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            srcIO.disconnect();
          }
        }
      },
      { rootMargin: "300px" },
    );
    srcIO.observe(el);
    return () => srcIO.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;
    const playIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    playIO.observe(v);
    return () => playIO.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={videoRef}
        src={shouldLoad ? mediaSrc(src) : undefined}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}
