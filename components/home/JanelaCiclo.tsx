"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Janela 16:9 do tamanho de uma letra, encaixada na linha de um título,
 * cortando entre fotos — a mesma ideia das janelas da aba /diretores.
 * `deslocamento` desencontra as janelas de um mesmo título.
 */
export function JanelaCiclo({
  fotos,
  deslocamento = 0,
  intervalo = 1500,
}: {
  fotos: string[];
  deslocamento?: number;
  intervalo?: number;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTick((n) => n + 1), intervalo);
    return () => clearInterval(t);
  }, [intervalo]);

  if (!fotos.length) return null;
  const k = (tick + deslocamento) % fotos.length;

  return (
    <span
      aria-hidden
      className="relative mx-[0.12em] inline-block overflow-hidden bg-ink-3 align-[-0.06em]"
      style={{ height: "0.72em", aspectRatio: "16 / 9" }}
    >
      {/* a janela tem ~150px: o otimizador entrega um arquivo desse
          tamanho em vez das fotos de 1920px (dezenas de KB, não centenas) */}
      {fotos.map((src, n) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 90px, 220px"
          className="object-cover transition-opacity duration-500"
          style={{ opacity: n === k ? 1 : 0 }}
        />
      ))}
    </span>
  );
}
