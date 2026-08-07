"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { time } from "@/data/credencial/time"
import { GradientBloom } from "../GradientBloom"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * TIME — lâminas verticais full-bleed
 *
 * Seis retratos B&W lado a lado, cada um uma lâmina de altura total.
 * Sobem com stagger (o baralho se monta), e a lâmina sob o ponteiro
 * abre — as outras cedem espaço. Nome grande só na lâmina ativa;
 * nas demais, o code mono vertical.
 *
 * Sem hierarquia entre fundador e time: todo mundo é uma lâmina igual.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideTime() {
  const [active, setActive] = useState<number | null>(null)
  // portrait: 6 lâminas lado a lado ficam espremidas — vira grade 3×2
  const portrait = usePortrait()

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: "var(--black)" }}
    >
      <GradientBloom x={30} y={80} size={70} intensity={0.14} breathe={false} />

      {/* título — faixa própria acima das lâminas, nada se sobrepõe */}
      <div
        className="absolute z-10 flex items-end justify-between"
        style={{
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          top: "clamp(58px, 9vh, 90px)",
        }}
      >
        <motion.h2
          className="cred-display"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.9, ease: EASE },
          }}
          style={{ fontSize: "clamp(30px, 3.6vw, 60px)", color: "var(--paper)" }}
        >
          nosso time.
        </motion.h2>
        <motion.span
          className="cred-mono uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.3 } }}
          style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--mute-3)", paddingBottom: 8 }}
        >
          {time.length} pessoas · direção, produção e pós
        </motion.span>
      </div>

      {/* lâminas — começam abaixo da faixa do título */}
      <div
        className="absolute flex"
        style={{
          top: "clamp(124px, 19vh, 180px)",
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          bottom: "clamp(48px, 7.5vh, 72px)",
          gap: portrait ? "clamp(6px, 1vw, 10px)" : "clamp(4px, 0.5vw, 8px)",
          flexWrap: portrait ? "wrap" : "nowrap",
        }}
        onMouseLeave={() => setActive(null)}
      >
        {time.map((p, i) => {
          const isActive = active === i
          const anyActive = active !== null
          return (
            <motion.div
              key={p.nome}
              className="relative min-w-0 cursor-pointer overflow-hidden"
              onMouseEnter={() => !portrait && setActive(i)}
              onClick={(e) => {
                // não deixa o clique da lâmina virar "próximo slide"
                e.stopPropagation()
                setActive(isActive ? null : i)
              }}
              initial={{ y: "16%", opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                flexGrow: portrait ? 1 : isActive ? 3.2 : anyActive ? 0.82 : 1,
                transition: {
                  y: { duration: 0.85, ease: EASE, delay: 0.12 + i * 0.08 },
                  opacity: { duration: 0.85, ease: EASE, delay: 0.12 + i * 0.08 },
                  flexGrow: { duration: 0.65, ease: EASE },
                },
              }}
              style={{
                flexBasis: portrait ? "31%" : 0,
                height: portrait ? "calc(50% - 5px)" : "100%",
                willChange: "flex-grow, transform",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.foto}
                alt={p.nome}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter: isActive
                    ? "grayscale(100%) contrast(1.06) brightness(1.04)"
                    : "grayscale(100%) contrast(1.05) brightness(0.72)",
                  objectPosition: "center 20%",
                  transition: "filter 600ms cubic-bezier(0.32,0.72,0,1)",
                }}
              />

              {/* véu que escurece as lâminas não-ativas */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.12) 45%, rgba(10,10,10,0.3) 100%)",
                  opacity: isActive ? 0.55 : 1,
                  transition: "opacity 600ms cubic-bezier(0.32,0.72,0,1)",
                }}
              />

              {/* code vertical — estado fechado */}
              <span
                className="cred-mono absolute uppercase"
                style={{
                  top: 14,
                  right: 12,
                  fontSize: 9,
                  writingMode: "vertical-rl",
                  letterSpacing: "0.28em",
                  color: "rgba(245,245,245,0.55)",
                  opacity: isActive ? 0 : 1,
                  transition: "opacity 400ms",
                }}
              >
                {p.code}
              </span>

              {/* nome + função — sempre no portrait, na lâmina aberta no desktop */}
              <motion.div
                className="absolute"
                style={{ left: 18, right: 14, bottom: 16, zIndex: 2 }}
                animate={{
                  opacity: portrait || isActive ? 1 : 0,
                  y: portrait || isActive ? 0 : 10,
                  transition: { duration: 0.45, ease: EASE, delay: isActive ? 0.18 : 0 },
                }}
              >
                <div
                  style={{
                    color: "var(--paper)",
                    fontWeight: 700,
                    fontSize: portrait ? "clamp(12px, 3vw, 18px)" : "clamp(16px, 1.5vw, 26px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.02,
                    whiteSpace: portrait ? "normal" : "nowrap",
                  }}
                >
                  {p.nome.toLowerCase()}.
                </div>
                <div
                  className="cred-mono uppercase"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.2em",
                    color: "rgba(245,245,245,0.6)",
                    marginTop: 6,
                    whiteSpace: portrait ? "normal" : "nowrap",
                  }}
                >
                  {p.funcao}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
