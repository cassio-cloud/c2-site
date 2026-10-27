"use client";

import Image from "next/image";
import { useId, useState } from "react";

/**
 * Bio, retrato e marcas ficam recolhidos: a página do diretor abre pelos
 * filmes. Quem quiser saber mais, abre.
 */
export function Sobre({
  nome,
  foto,
  frase,
  bio,
  marcas,
  canal,
}: {
  nome: string;
  foto?: string;
  frase?: string;
  bio?: string;
  marcas: string[];
  canal?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const id = useId();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px] font-semibold">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={id}
          onClick={() => setAberto((v) => !v)}
          className="toque transition-opacity hover:opacity-70"
        >
          sobre {aberto ? "−" : "+"}
        </button>
        {canal && (
          <a href={canal} target="_blank" rel="noopener" className="toque text-mute-2 transition-colors hover:text-paper">
            vimeo ↗
          </a>
        )}
      </div>

      <div id={id} hidden={!aberto} className="grid gap-8 border-t border-line pt-8 md:grid-cols-[160px_minmax(0,62ch)_minmax(0,1fr)]">
        {foto && (
          <div className="relative w-[120px] overflow-hidden bg-white md:w-[160px]" style={{ aspectRatio: "3 / 4" }}>
            <Image src={foto} alt={`Retrato de ${nome}`} fill sizes="160px" className="object-cover grayscale" />
          </div>
        )}
        <div className="grid gap-4">
          {frase && <p className="m-0 text-[17px] font-semibold lowercase tracking-[-0.01em]">{frase}</p>}
          {bio && <p className="m-0 text-[15px] leading-relaxed text-mute-1">{bio}</p>}
        </div>
        {marcas.length > 0 && (
          <div className="grid content-start gap-2">
            <p className="m-0 text-[13px] text-mute-2">marcas</p>
            <p className="m-0 text-[15px] leading-relaxed text-mute-1">{marcas.join(" · ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
