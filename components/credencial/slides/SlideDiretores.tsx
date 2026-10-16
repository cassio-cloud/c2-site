"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { diretores, type Diretor } from "@/data/credencial/diretores"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/** "John Porciúncula" → "JP". */
export function iniciais(nome: string) {
  const p = nome.trim().split(/\s+/)
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase()
}

/**
 * Retrato do diretor ou, sem foto, o placeholder com as iniciais.
 * Os retratos do padrão têm fundo branco — no slide branco eles se
 * fundem com a página; o placeholder segue o mesmo tom, um cinza claro.
 */
export function RetratoDiretor({
  d,
  posicao = "45% 40%",
  emBreve = false,
}: {
  d: Diretor
  posicao?: string
  /** Placeholder: "em breve" sob as iniciais. */
  emBreve?: boolean
}) {
  if (d.foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={d.foto}
        alt={d.nome}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: posicao, filter: "grayscale(100%) contrast(1.04)" }}
      />
    )
  }
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      // as iniciais medem o quadro (cqw), não a tela
      style={{ background: "#f1f1f1", containerType: "size" }}
    >
      <span
        className="cred-display"
        style={{
          fontSize: "clamp(22px, 40cqw, 180px)",
          color: "rgba(0,0,0,0.1)",
          textTransform: "uppercase",
          letterSpacing: "-0.06em",
        }}
      >
        {iniciais(d.nome)}
      </span>
      {emBreve && (
        <span className="cred-mono uppercase" style={{ fontSize: 8.5, color: "rgba(0,0,0,0.32)", marginTop: 10 }}>
          em breve
        </span>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
 * DIRETORES DE CENA — o elenco, no branco
 *
 * Retratos de ponta a ponta, quase a altura toda; o nome de cada um
 * fica sempre à vista, embaixo, como numa ficha de elenco. A coluna
 * sob o ponteiro abre e as outras cedem espaço.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideDiretores() {
  const [active, setActive] = useState<number | null>(null)
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
        diretores de cena.
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
        {diretores.map((d, i) => {
          const isActive = active === i
          const anyActive = active !== null
          return (
            <motion.div
              key={d.id}
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
                // retrato: 2 fileiras (4 + 3); a de baixo cresce para fechar
                flexBasis: portrait ? "24%" : 0,
                height: portrait ? "calc(50% - 9px)" : "100%",
                willChange: "flex-grow, transform",
              }}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <RetratoDiretor d={d} emBreve />
              </div>

              {/* ficha — sempre à vista. Altura FIXA: com a linha extra de
                  uma dupla ("Bruno e Gabi"), uma ficha maior encolhia a
                  foto da própria coluna e desalinhava a faixa */}
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
                  }}
                >
                  {d.nome.toLowerCase()}.
                </div>
                {(d.subCurto ?? d.sub) && (
                  <div
                    className="cred-mono uppercase"
                    style={{ fontSize: 9, color: "rgba(0,0,0,0.45)", marginTop: 5, letterSpacing: "0.18em" }}
                  >
                    {d.subCurto ?? d.sub}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
