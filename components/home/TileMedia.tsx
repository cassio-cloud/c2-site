"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";

type Props = {
  cover: MediaItem;
  alt: string;
};

/**
 * Mídia do tile: imagem otimizada via next/image OU vídeo com
 * lazy-load + play-on-view (paridade com legacy).
 *
 * O vídeo só carrega o `src` quando entra a 300px do viewport,
 * e só dá `.play()` quando >= 25% visível.
 */
export function TileMedia({ cover, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (cover.type !== "video") return;
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
  }, [cover.type]);

  useEffect(() => {
    if (cover.type !== "video" || !shouldLoad) return;
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
  }, [cover.type, shouldLoad]);

  if (cover.type === "video") {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <video
          ref={videoRef}
          src={shouldLoad ? `/${cover.src}` : undefined}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
    );
  }

  return (
    <Image
      src={`/${cover.src}`}
      alt={alt}
      fill
      sizes="(max-width: 900px) 100vw, 50vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
    />
  );
}
