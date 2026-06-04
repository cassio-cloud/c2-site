"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";

type Props = {
  item: MediaItem;
  index: number;
};

/**
 * Mídia individual na stack de um case detail.
 * Clique abre a lightbox via evento custom `c2:lightbox`.
 * Vídeos têm autoplay/loop com play-on-view threshold 25%.
 */
export function CaseMedia({ item, index }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (item.type !== "video") return;
    const el = ref.current;
    if (!el) return;
    const srcIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoaded(true);
            srcIO.disconnect();
          }
        }
      },
      { rootMargin: "400px" },
    );
    srcIO.observe(el);
    return () => srcIO.disconnect();
  }, [item.type]);

  useEffect(() => {
    if (item.type !== "video" || !loaded) return;
    const v = videoRef.current;
    if (!v) return;
    const playIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 },
    );
    playIO.observe(v);
    return () => playIO.disconnect();
  }, [item.type, loaded]);

  const openLb = () =>
    window.dispatchEvent(
      new CustomEvent("c2:lightbox", { detail: { index } }),
    );

  return (
    <button
      ref={ref}
      type="button"
      onClick={openLb}
      className="block w-full cursor-zoom-in bg-ink-3 transition-opacity hover:opacity-95"
    >
      <div className="relative w-full">
        {item.type === "video" ? (
          <video
            ref={videoRef}
            src={loaded ? `/${item.src}` : undefined}
            muted
            loop
            playsInline
            preload="none"
            className="block h-auto w-full"
          />
        ) : (
          <Image
            src={`/${item.src}`}
            alt=""
            width={2400}
            height={1600}
            sizes="(max-width: 900px) 100vw, 70vw"
            className="block h-auto w-full"
            style={{ height: "auto" }}
          />
        )}
      </div>
    </button>
  );
}
