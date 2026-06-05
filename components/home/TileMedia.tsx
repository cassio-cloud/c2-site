"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { mediaSrc } from "@/lib/media-url";
import { parseEmbedUrl } from "@/lib/embed";

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

function EmbedCover({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
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
        <iframe
          src={parsed.embedUrl}
          title=""
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
