"use client"

import { motion } from "motion/react"

/* ═══════════════════════════════════════════════════════════════════
 * LÂMINAS
 *
 * Uma imagem revelada em fatias verticais. Cada lâmina mostra a SUA
 * fatia da mesma imagem (background-position calculado), sobe com
 * stagger e assenta — o quadro se monta como um baralho de vidro.
 *
 * É a régua de formatos virando gesto: a imagem chega em colunas de
 * cinema, não em bloco.
 * ═══════════════════════════════════════════════════════════════════ */

const EASE = [0.32, 0.72, 0, 1] as const

type Props = {
  src: string
  /** Número de lâminas. 5–7 lê como lâminas; acima vira persiana. */
  count?: number
  /** Atraso base antes da primeira lâmina. */
  delay?: number
  /** Stagger entre lâminas. */
  step?: number
  /** Direção de onde as lâminas sobem. */
  from?: "bottom" | "top"
  /** Filtro aplicado à imagem (ex.: grayscale pro time). */
  filter?: string
  /** Vão entre lâminas, px. 0 = imagem contínua. */
  gap?: number
  className?: string
  style?: React.CSSProperties
}

export function Laminas({
  src,
  count = 6,
  delay = 0.1,
  step = 0.07,
  from = "bottom",
  filter,
  gap = 0,
  className = "",
  style,
}: Props) {
  const y0 = from === "bottom" ? "14%" : "-14%"

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden ${className}`}
      style={{ gap, ...style }}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="relative h-full min-w-0 flex-1 overflow-hidden"
          initial={{ y: y0, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.85, ease: EASE, delay: delay + i * step },
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${count * 100}% 100%`,
              backgroundPosition: `${count === 1 ? 0 : (i / (count - 1)) * 100}% 50%`,
              filter,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
