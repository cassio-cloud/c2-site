"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { time } from "@/data/credencial/time"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * TIME — o mesmo desenho do elenco de diretores, no branco
 *
 * No branco porque os retratos do time têm fundo claro de estúdio —
 * no preto eles viravam uma colcha de cinzas diferentes.
 *
 * Retratos B&W de ponta a ponta, quase a altura toda; nome e função
 * sempre à vista, embaixo, como numa ficha de elenco. A coluna sob o
 * ponteiro abre e as outras cedem espaço.
 *
 * Sem hierarquia entre fundador e time: todo mundo é uma coluna igual.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideTime() {
  const [active, setActive] = useState<number | null>(null)
  // portrait: 6 colunas lado a lado ficam espremidas — vira grade 3×2
  const portrait = usePortrait()

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "var(--paper)" }}>
      <motion.h2
        className="cred-display absolute z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }}
        style={{
          left: "var(--cred-margin)",
          top: "clamp(52px, 8vh, 84px)",
          fontSize: portrait ? "clamp(30px, 9vw, 48px)" : "clamp(30px, 3.4vw, 58px)",
          color: "var(--ink)",
          margin: 0,
        }}
      >
        nosso time.
      </motion.h2>

      <div
        className="absolute flex"
        style={{
          top: portrait ? "clamp(120px, 17vh, 160px)" : "clamp(118px, 18vh, 170px)",
          left: 0,
          right: 0,
          bottom: portrait ? "clamp(40px, 6vh, 56px)" : "clamp(44px, 6.5vh, 64px)",
          flexWrap: portrait ? "wrap" : "nowrap",
          rowGap: portrait ? 18 : 0,
        }}
        onMouseLeave={() => setActive(null)}
      >
        {time.map((p, i) => {
          const isActive = active === i
          const anyActive = active !== null
          return (
            <motion.div
              key={p.nome}
              className="relative flex min-w-0 cursor-pointer flex-col"
              onMouseEnter={() => !portrait && setActive(i)}
              onClick={(e) => {
                // a coluna abre; o clique não vira "próximo slide"
                e.stopPropagation()
                setActive(isActive ? null : i)
              }}
              initial={{ y: 28, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                flexGrow: portrait ? 1 : isActive ? 2.6 : anyActive ? 0.85 : 1,
                transition: {
                  y: { duration: 0.85, ease: EASE, delay: 0.1 + i * 0.07 },
                  opacity: { duration: 0.85, ease: EASE, delay: 0.1 + i * 0.07 },
                  flexGrow: { duration: 0.65, ease: EASE },
                },
              }}
              style={{
                flexBasis: portrait ? "31%" : 0,
                height: portrait ? "calc(50% - 9px)" : "100%",
                willChange: "flex-grow, transform",
              }}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.foto}
                  alt={p.nome}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center 20%", filter: "grayscale(100%) contrast(1.05)" }}
                />
              </div>

              {/* ficha — sempre à vista, altura fixa (alinha a faixa) */}
              <div
                style={{
                  padding: portrait ? "8px 6px 0" : "14px 14px 0",
                  height: portrait ? 46 : 64,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    color: "var(--ink)",
                    fontWeight: 700,
                    fontSize: portrait ? "clamp(10px, 2.7vw, 14px)" : "clamp(13px, 1.25vw, 22px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.nome.toLowerCase()}.
                </div>
                <div
                  className="cred-mono uppercase"
                  style={{
                    fontSize: 9,
                    color: "rgba(0,0,0,0.45)",
                    marginTop: 5,
                    letterSpacing: "0.18em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.funcao}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
