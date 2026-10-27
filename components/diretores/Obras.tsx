"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Obra } from "@/lib/diretores";
import { Play, vimeoPlayerUrl } from "./Rolo";

/** Player do filme: Vimeo ou YouTube, sempre com autoplay ao abrir. */
function playerUrl(o: Obra): string | null {
  if (o.vimeo) return vimeoPlayerUrl(o.vimeo);
  if (o.youtube) return `https://www.youtube-nocookie.com/embed/${o.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  return null;
}

const legenda = (o: Obra) => (
  <>
    {o.marca}.
    {o.titulo ? <span className="font-normal opacity-60"> {o.titulo}</span> : null}
  </>
);

/**
 * Grade densa de filmes — a protagonista da página do diretor.
 * Filme do Vimeo abre o player por cima da página; case da C2 leva
 * para a página do case em /trabalho.
 */
export function Obras({ obras }: { obras: Obra[] }) {
  const [aberta, setAberta] = useState<Obra | null>(null);
  const fechar = useCallback(() => setAberta(null), []);

  useEffect(() => {
    if (!aberta) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberta, fechar]);

  return (
    <>
      <div className="grid grid-cols-1 gap-[6px] sm:grid-cols-2 lg:grid-cols-3">
        {obras.map((o, i) => {
          const miolo = (
            <>
              <span className="relative block overflow-hidden bg-ink-3" style={{ aspectRatio: "16 / 9" }}>
                <Image
                  src={o.thumb}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span
                  className="absolute inset-x-0 bottom-0 hidden translate-y-1.5 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-left text-[14px] font-semibold leading-snug text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:block"
                >
                  {legenda(o)}
                </span>
                {(o.vimeo || o.youtube) && <Play />}
              </span>
              {/* sem hover (celular), a legenda fica embaixo */}
              <span className="mt-2 block text-left text-[13px] font-semibold leading-snug [@media(hover:hover)]:hidden">
                {legenda(o)}
              </span>
            </>
          );
          return o.href ? (
            <Link key={o.id} href={o.href} className="group block">
              {miolo}
            </Link>
          ) : (
            <button
              key={o.id}
              type="button"
              onClick={() => setAberta(o)}
              aria-label={`${o.marca}${o.titulo ? `, ${o.titulo}` : ""}`}
              className="group block w-full cursor-pointer"
            >
              {miolo}
            </button>
          );
        })}
      </div>

      {aberta && playerUrl(aberta) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={aberta.marca}
          className="fixed inset-0 z-[200] grid place-items-center bg-black/95 p-[max(20px,3vw)]"
          onClick={fechar}
        >
          <div className="grid w-full max-w-[1280px] gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-baseline justify-between gap-6 text-paper">
              <p className="m-0 text-[clamp(18px,1.8vw,26px)] font-bold lowercase tracking-[-0.03em]">
                {legenda(aberta)}
              </p>
              <button
                type="button"
                onClick={fechar}
                autoFocus
                className="shrink-0 text-[14px] font-semibold text-paper/70 transition-colors hover:text-paper"
              >
                fechar
              </button>
            </div>
            <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={playerUrl(aberta)!}
                title={aberta.marca}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
