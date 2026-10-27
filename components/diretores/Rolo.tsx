"use client";

import Image from "next/image";
import { useState } from "react";

/** Player do Vimeo sem título, autor e retrato por cima do filme. */
export function vimeoPlayerUrl(id: string) {
  return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
}

/**
 * O rolo do diretor abrindo a página. Antes do clique é só o frame; o
 * clique troca o frame pelo player, no mesmo lugar e com som.
 */
export function Rolo({ vimeo, thumb, nome }: { vimeo: string; thumb: string; nome: string }) {
  const [tocando, setTocando] = useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16 / 9" }}>
      {tocando ? (
        <iframe
          src={vimeoPlayerUrl(vimeo)}
          title={`Rolo de ${nome}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setTocando(true)}
          aria-label={`Assistir ao rolo de ${nome}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer"
        >
          <Image
            src={thumb}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90 transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-[1.02] group-hover:opacity-100"
          />
          <Play />
        </button>
      )}
    </div>
  );
}

/** Triângulo fino num círculo de fio — aparece no hover e no foco. */
export function Play() {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-1/2 grid h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path d="M1 1.5v17L17 10 1 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
