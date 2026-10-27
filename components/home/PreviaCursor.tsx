"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type Previa = { src: string; legenda: string };

/**
 * Enquanto o mouse está sobre o conteúdo, uma prévia 16:9 acompanha o
 * cursor passando pelos trabalhos — o mesmo gesto do índice de
 * /diretores. Sem mouse (celular) não aparece nada: o conteúdo fica
 * como está.
 */
export function PreviaCursor({
  previas,
  children,
  intervalo = 900,
}: {
  previas: Previa[];
  children: ReactNode;
  intervalo?: number;
}) {
  const [ativo, setAtivo] = useState(false);
  const [k, setK] = useState(0);
  const caixaRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, raf: 0 });

  useEffect(() => {
    if (!ativo) return;
    setK((n) => n + 1); // cada entrada começa num trabalho diferente
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setK((n) => n + 1), intervalo);
    return () => clearInterval(t);
  }, [ativo, intervalo]);

  // segue o cursor sem re-render: transform direto no elemento
  useEffect(() => {
    if (!ativo) return;
    const mover = () => {
      pos.current.raf = 0;
      const el = caixaRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = Math.min(pos.current.x + 32, window.innerWidth - w - 24);
      const y = Math.min(Math.max(pos.current.y - h / 2, 24), window.innerHeight - h - 24);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!pos.current.raf) pos.current.raf = requestAnimationFrame(mover);
    };
    window.addEventListener("mousemove", onMove);
    // já posiciona na entrada: quem entra e para o mouse também vê a prévia
    mover();
    return () => window.removeEventListener("mousemove", onMove);
  }, [ativo]);

  const atual = previas.length ? previas[k % previas.length] : null;

  return (
    <div
      onMouseEnter={(e) => {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        setAtivo(true);
      }}
      onMouseLeave={() => setAtivo(false)}
    >
      {children}
      <div
        ref={caixaRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden overflow-hidden bg-black transition-opacity duration-300 [@media(hover:hover)]:block"
        style={{
          width: "min(440px, 32vw)",
          aspectRatio: "16 / 9",
          opacity: ativo && atual ? 1 : 0,
          transform: "translate3d(-9999px, -9999px, 0)",
        }}
      >
        {previas.map((p, n) => (
          <Image
            key={p.src}
            src={p.src}
            alt=""
            fill
            sizes="440px"
            className="object-cover"
            style={{ opacity: atual && p.src === atual.src && n === k % previas.length ? 1 : 0 }}
          />
        ))}
        {atual && (
          <span
            className="absolute bottom-3 left-4 right-4 text-[13px] font-semibold text-white"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,.6)" }}
          >
            {atual.legenda}
          </span>
        )}
      </div>
    </div>
  );
}
