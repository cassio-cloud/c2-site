"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ElencoItem = {
  slug: string;
  nome: string;
  frames: { src: string; legenda: string }[];
};

/** Intervalo entre os cortes das janelas inline e da prévia (ms). */
const CORTE = 1400;
const CORTE_PREVIA = 850;

/**
 * Índice de /diretores: os nomes correm como um parágrafo em corpo grande,
 * e entre um nome e outro fica uma janela 16:9 cortando entre os filmes
 * daquele diretor. O trabalho aparece antes do rosto — que nem está aqui.
 *
 * Com mouse: o nome sob o cursor fica, os outros apagam, e uma prévia maior
 * acompanha o cursor passando pelos filmes dele. Sem mouse (celular), a
 * prévia não existe e as janelas inline fazem o papel dela.
 *
 * A página não rola: o texto ocupa a tela inteira. Como a quebra de linha
 * muda com a largura, o corpo da letra é calculado — o maior que ainda
 * cabe inteiro no espaço disponível, recalculado a cada redimensionamento.
 */
export function Elenco({ itens }: { itens: ElencoItem[] }) {
  const [tick, setTick] = useState(0);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [previa, setPrevia] = useState(0);
  const peekRef = useRef<HTMLDivElement>(null);
  const caixaRef = useRef<HTMLDivElement>(null);
  const textoRef = useRef<HTMLParagraphElement>(null);
  const pos = useRef({ x: 0, y: 0, raf: 0 });

  const calmo = useCalmo();
  useCaber(caixaRef, textoRef);

  // relógio único para todas as janelas inline
  useEffect(() => {
    if (calmo) return;
    const t = setInterval(() => setTick((n) => n + 1), CORTE);
    return () => clearInterval(t);
  }, [calmo]);

  // a prévia corta mais rápido, e recomeça do primeiro filme a cada nome
  useEffect(() => {
    setPrevia(0);
    if (!ativo || calmo) return;
    const t = setInterval(() => setPrevia((n) => n + 1), CORTE_PREVIA);
    return () => clearInterval(t);
  }, [ativo, calmo]);

  // a prévia segue o cursor sem re-render: transform direto no elemento
  useEffect(() => {
    const mover = () => {
      pos.current.raf = 0;
      const el = peekRef.current;
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
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const atual = itens.find((d) => d.slug === ativo);
  const frameAtual = atual?.frames.length ? atual.frames[previa % atual.frames.length] : null;

  return (
    <div ref={caixaRef} className="flex h-full min-h-0 w-full items-end overflow-hidden">
      <p
        ref={textoRef}
        className="caber m-0 w-full font-extrabold lowercase"
        style={{
          // ponto de partida antes da medição — o useCaber ajusta e só
          // então mostra (senão os nomes pulam de tamanho: CLS no Google)
          fontSize: "clamp(40px, 8vw, 140px)",
          visibility: "hidden",
          letterSpacing: "-0.055em",
          lineHeight: 1.04,
          textWrap: "pretty",
        }}
        onMouseLeave={() => setAtivo(null)}
      >
        {itens.map((d, i) => {
          const apagado = ativo !== null && ativo !== d.slug;
          const ultimo = i === itens.length - 1;
          // a janela fica presa à última palavra do nome: a linha pode
          // terminar numa imagem, mas nunca começar com uma solta. No
          // celular a coluna é estreita demais para "porciúncula" + janela
          // juntas — lá a janela desce sozinha e a letra fica maior.
          const palavras = d.nome.toLowerCase().split(" ");
          const fim = palavras.pop();
          return (
            <span key={d.slug}>
              <Link
                href={`/diretores/${d.slug}`}
                onMouseEnter={() => setAtivo(d.slug)}
                onFocus={() => setAtivo(d.slug)}
                onBlur={() => setAtivo(null)}
                className="transition-colors duration-300"
                style={{ color: apagado ? "#d6d6da" : "#000000" }}
              >
                {palavras.length > 0 && <>{palavras.join(" ")} </>}
                <span className="sm:whitespace-nowrap">
                  {/* o ponto fecha cada nome e separa um do outro */}
                  {fim}.
                  {!ultimo && (
                    <Janela frames={d.frames} indice={tick + i * 2} apagada={apagado} />
                  )}
                </span>
              </Link>{" "}
            </span>
          );
        })}
      </p>

      {/* prévia que acompanha o cursor — só onde existe hover */}
      <div
        ref={peekRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden overflow-hidden bg-black transition-opacity duration-300 [@media(hover:hover)]:block"
        style={{
          width: "min(460px, 34vw)",
          aspectRatio: "16 / 9",
          opacity: frameAtual ? 1 : 0,
          transform: "translate3d(-9999px, -9999px, 0)",
        }}
      >
        {frameAtual && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frameAtual.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span
              className="absolute bottom-3 left-4 right-4 text-[13px] font-semibold text-white"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,.6)" }}
            >
              {frameAtual.legenda}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Maior corpo de letra em que o texto cabe inteiro na caixa, por busca
 * binária. Mede direto no elemento (sem estado, sem re-render) e refaz
 * quando a caixa muda de tamanho ou quando a Inter termina de carregar —
 * a fonte de fallback tem outra largura e daria uma medida errada.
 */
function useCaber(
  caixaRef: React.RefObject<HTMLDivElement | null>,
  textoRef: React.RefObject<HTMLParagraphElement | null>,
) {
  useLayoutEffect(() => {
    const caixa = caixaRef.current;
    const texto = textoRef.current;
    if (!caixa || !texto) return;

    const ajustar = () => {
      const H = caixa.clientHeight;
      const W = caixa.clientWidth;
      if (!H || !W) return;
      let lo = 16;
      let hi = 420;
      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        texto.style.fontSize = `${mid}px`;
        const cabe = texto.scrollHeight <= H && texto.scrollWidth <= W;
        if (cabe) lo = mid;
        else hi = mid;
      }
      // um respiro de 2% para a última linha não encostar na borda
      texto.style.fontSize = `${Math.floor(lo * 0.98)}px`;
    };

    const mostrar = () => {
      texto.style.visibility = "visible";
    };

    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(caixa);
    // aparece já no tamanho final, com a Inter carregada (ou em 800ms, no máximo)
    const prazo = window.setTimeout(mostrar, 800);
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ajustar();
        mostrar();
      });
    } else {
      mostrar();
    }
    return () => {
      ro.disconnect();
      window.clearTimeout(prazo);
    };
  }, [caixaRef, textoRef]);
}

/** Janela inline, do tamanho de uma letra maiúscula, cortando entre filmes. */
function Janela({
  frames,
  indice,
  apagada,
}: {
  frames: ElencoItem["frames"];
  indice: number;
  apagada: boolean;
}) {
  if (!frames.length) return null;
  const k = indice % frames.length;
  return (
    <span
      aria-hidden
      className="relative mx-[0.14em] inline-block overflow-hidden bg-[#ececee] align-[-0.06em] transition-[opacity,filter] duration-300"
      style={{
        height: "0.72em",
        aspectRatio: "16 / 9",
        opacity: apagada ? 0.25 : 1,
        filter: apagada ? "grayscale(1)" : "none",
      }}
    >
      {frames.map((f, n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={f.src}
          src={f.src}
          alt=""
          loading={n < 2 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: n === k ? 1 : 0 }}
        />
      ))}
    </span>
  );
}

function useCalmo() {
  const [calmo, setCalmo] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setCalmo(mq.matches);
    const on = () => setCalmo(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return calmo;
}
