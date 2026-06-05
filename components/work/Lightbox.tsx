"use client";

import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { mediaSrc } from "@/lib/media-url";

type Props = {
  items: MediaItem[];
};

/**
 * Lightbox fullscreen disparada por clicks em <CaseMedia />.
 *
 * Escuta o evento custom `c2:lightbox` (window.dispatchEvent) com
 * `{ detail: { index: number } }` para abrir no item correto.
 * Setas, Esc e botões para navegar. Closes em click fora do conteúdo.
 */
export function Lightbox({ items }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback(
    (i: number) => {
      if (i < 0 || i >= items.length) return;
      setIndex(i);
    },
    [items.length],
  );

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const onLb = (e: Event) => {
      const ce = e as CustomEvent<{ index: number }>;
      open(ce.detail?.index ?? 0);
    };
    window.addEventListener("c2:lightbox", onLb);
    return () => window.removeEventListener("c2:lightbox", onLb);
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  if (index === null) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
      onClick={close}
    >
      <button
        aria-label="Fechar"
        onClick={close}
        className="absolute right-6 top-6 z-10 font-mono text-2xl text-paper hover:opacity-70"
      >
        ×
      </button>
      <button
        aria-label="Anterior"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 px-4 py-6 font-mono text-3xl text-paper hover:opacity-70"
      >
        ←
      </button>
      <button
        aria-label="Próxima"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 px-4 py-6 font-mono text-3xl text-paper hover:opacity-70"
      >
        →
      </button>

      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: "96vw", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <video
            src={mediaSrc(item.src)}
            controls
            autoPlay
            playsInline
            style={{ maxWidth: "96vw", maxHeight: "92vh" }}
          />
        ) : item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc(item.src)}
            alt=""
            style={{
              maxWidth: "96vw",
              maxHeight: "92vh",
              objectFit: "contain",
            }}
          />
        ) : null}
      </div>

      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-1">
        {index + 1} / {items.length}
      </span>
    </div>
  );
}
