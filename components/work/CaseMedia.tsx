"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { mediaSrc, posterSrc, webSrc } from "@/lib/media-url";
import { parseEmbedUrl } from "@/lib/embed";
import { useDepoisDoLoad } from "@/lib/depois-do-load";

type Props = {
  item: MediaItem;
  index: number;
  /** Título do case: vira o texto alternativo (Google Imagens, leitor de tela). */
  titulo?: string;
};

/**
 * Mídia individual na stack de um case detail.
 * Clique abre a lightbox via evento custom `c2:lightbox`.
 * Vídeos têm autoplay/loop com play-on-view threshold 25%.
 */
export function CaseMedia({ item, index, titulo }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  // o player do YouTube pesa ~2MB de JS e vídeo: entra depois do load
  const embedPronto = useDepoisDoLoad();
  const descricao = titulo ? `${titulo}, ${item.type === "video" ? "vídeo" : "imagem"} ${index + 1}` : "";

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

  // Embed (YouTube/Vimeo): renderiza iframe direto, sem lightbox.
  // Shorts são verticais (9:16) — outros embeds são 16:9.
  if (item.type === "embed") {
    const src = parseEmbedUrl(item.src);
    if (src.kind === "youtube" || src.kind === "vimeo") {
      const aspect = src.isVertical ? "9/16" : "16/9";
      const maxWidth = src.isVertical ? "min(420px, 60vw)" : undefined;
      return (
        <div className="flex w-full justify-center">
          <div
            className="relative w-full overflow-hidden bg-ink-3"
            style={{ aspectRatio: aspect, maxWidth }}
          >
            {embedPronto ? (
              <iframe
                src={src.embedUrl}
                title={titulo ? `${titulo}, vídeo` : "Vídeo do case"}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
            ) : (
              src.kind === "youtube" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://i.ytimg.com/vi/${src.videoId}/hqdefault.jpg`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  // Vídeo abre pra tocar inteiro, imagem abre ampliada — o cursor diz qual.
  const cursor = item.type === "video" ? "cursor-pointer" : "cursor-zoom-in";

  return (
    <button
      ref={ref}
      type="button"
      onClick={openLb}
      aria-label={item.type === "video" ? `Assistir ${descricao || "vídeo"}` : `Ampliar ${descricao || "imagem"}`}
      className={`block w-full bg-ink-3 transition-opacity hover:opacity-95 ${cursor}`}
    >
      <div className="relative w-full">
        {item.type === "video" ? (
          <video
            ref={videoRef}
            // Player inline roda a versão faststart (começa a tocar nos
            // primeiros KB). O clique abre a lightbox, que entrega o
            // arquivo original inteiro — com som e controles.
            src={loaded ? (webSrc(item.src) ?? mediaSrc(item.src)) : undefined}
            poster={posterSrc(item.src) ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            className="block h-auto w-full"
          />
        ) : (
          <Image
            src={mediaSrc(item.src)}
            alt={descricao}
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
