"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { RefractionSweep, type SweepFrom } from "./Refraction"

/* ═══════════════════════════════════════════════════════════════════
 * SISTEMA DE MOTION
 *
 * Cinco variantes, cada uma com função narrativa — não são cinco
 * enfeites intercambiáveis:
 *
 *   veil   virada de capítulo. A faixa de vidro atravessa e o slide
 *          que sai se DESFAZ dentro do que entra. É a assinatura.
 *   mask   entrada de case. Revelação por máscara, borda suave.
 *          (técnica da landscape.productions)
 *   type   tese e manifesto. A headline sobe em camadas, com blur
 *          de saída. (architects × sinyard)
 *   depth  grids. Empurra/puxa no eixo Z com perspectiva.
 *          (roshan-sahu, "Depth Scroll")
 *   fade   slides silenciosos. Com mais massa que o padrão.
 * ═══════════════════════════════════════════════════════════════════ */

const EASE_OUT = [0.32, 0.72, 0, 1] as const
const EASE_IN = [0.6, 0, 0.85, 0.35] as const
const EASE_GLASS = [0.65, 0, 0.35, 1] as const

const opposite = (s: SweepFrom): SweepFrom =>
  s === "left" ? "right" : s === "right" ? "left" : s === "top" ? "bottom" : "top"

export type TransitionVariant =
  | "slide"
  | "fade"
  | "veil"
  | "mask"
  | "type"
  | "depth"
  | "push"
  | "dive"
  | "hole"
  | "still"

type Props = {
  children: ReactNode
  direction: 1 | -1
  variant?: TransitionVariant
  /** Lado de onde a varredura do `veil` entra. Cada capítulo, um lado. */
  veilFrom?: SweepFrom
  /** Origem do zoom no `dive` — o centro do tile/foto em que se entra. */
  diveOrigin?: string
}

export function SlideTransition({
  children,
  direction,
  variant = "slide",
  veilFrom,
  diveOrigin = "38% 46%",
}: Props) {
  const base = "absolute inset-0"

  /* ── VEIL ──────────────────────────────────────────────────────
   * O conteúdo entra em escala levemente maior e assenta, enquanto a
   * varredura de refração passa por cima. A distorção nasce e morre
   * junto com a faixa. */
  if (variant === "veil") {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 1.0, ease: EASE_GLASS },
        }}
        exit={{
          opacity: 0,
          scale: 0.99,
          transition: { duration: 0.5, ease: EASE_IN },
        }}
      >
        {children}
        <RefractionSweep
          direction={direction}
          from={direction === -1 && veilFrom ? opposite(veilFrom) : veilFrom}
          duration={1.0}
          peak={46}
          width={42}
        />
      </motion.div>
    )
  }

  /* ── HOLE ──────────────────────────────────────────────────────
   * Pra capa: na saída, o slide NÃO some — fica por cima (zIndex 40)
   * por 0.9s enquanto o próprio componente abre a máscara-buraco que
   * revela a próxima página já rodando por baixo. O tween de x é um
   * no-op numérico só pra segurar o unmount até a máscara terminar. */
  if (variant === "hole") {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } }}
        exit={{
          x: 0.01,
          zIndex: 40,
          transition: { duration: 0.9, ease: "linear" },
        }}
        style={{ willChange: "opacity" }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── STILL ─────────────────────────────────────────────────────
   * Entra praticamente instantâneo — pro slide já estar inteiro em
   * cena quando uma máscara (hole) o revela por cima. */
  if (variant === "still") {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15 } }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE_IN } }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── DIVE ──────────────────────────────────────────────────────
   * "O tile vira a página" (ref sakazuki.io). Ao avançar, o quadro
   * cresce com origem no tile escolhido até que ELE preencha a tela
   * — a opacidade segura quase até o fim, então o que se vê é o tile
   * tomando o quadro, não um fade. A próxima página se revela do
   * outro lado. Voltando, o caminho inverte. */
  if (variant === "dive") {
    const fwd = direction === 1
    return (
      <motion.div
        className={base}
        initial={
          fwd
            ? { scale: 0.96, opacity: 0 }
            : { scale: 4.2, opacity: 0, filter: "blur(9px)" }
        }
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE_GLASS },
        }}
        exit={
          fwd
            ? {
                scale: 4.2,
                opacity: [1, 1, 0],
                filter: "blur(9px)",
                transition: {
                  duration: 0.9,
                  ease: [0.55, 0, 0.7, 0.5],
                  opacity: { duration: 0.9, times: [0, 0.72, 1] },
                },
              }
            : {
                scale: 0.96,
                opacity: 0,
                transition: { duration: 0.5, ease: EASE_IN },
              }
        }
        style={{
          transformOrigin: diveOrigin,
          willChange: "transform, opacity, filter",
        }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── PUSH ──────────────────────────────────────────────────────
   * Viagem de câmera. Avançando: o slide novo nasce pequeno e fora
   * de foco no fundo e se aproxima até assentar; o que sai cresce e
   * passa pela câmera, desfocando. Voltando, o caminho inverte —
   * a câmera recua pra dentro do slide anterior. */
  if (variant === "push") {
    const fwd = direction === 1
    return (
      <motion.div
        className={base}
        initial={{
          scale: fwd ? 0.82 : 1.16,
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE_GLASS },
        }}
        exit={{
          scale: fwd ? 1.16 : 0.82,
          opacity: 0,
          filter: "blur(10px)",
          transition: { duration: 0.55, ease: EASE_IN },
        }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── MASK ──────────────────────────────────────────────────────
   * Wipe por clip-path. A imagem já está no lugar; o que se move é a
   * borda da revelação — por isso não há sensação de "slide entrando",
   * e sim de quadro sendo aberto. */
  if (variant === "mask") {
    const from = direction === 1 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"
    const to = direction === 1 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"
    return (
      <motion.div
        className={base}
        initial={{ clipPath: from, opacity: 0.6 }}
        animate={{
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          transition: { duration: 0.85, ease: EASE_GLASS },
        }}
        exit={{
          clipPath: to,
          opacity: 0.5,
          transition: { duration: 0.55, ease: EASE_IN },
        }}
        style={{ willChange: "clip-path, opacity" }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── TYPE ──────────────────────────────────────────────────────
   * Sobe com desfoque dissolvendo. O blur é curto de propósito: passa
   * de 8px a 0 no primeiro terço, então lê como foco sendo puxado, não
   * como efeito. */
  if (variant === "type") {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE_OUT },
        }}
        exit={{
          opacity: 0,
          y: -18,
          filter: "blur(6px)",
          transition: { duration: 0.45, ease: EASE_IN },
        }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── DEPTH ─────────────────────────────────────────────────────
   * Empurra no eixo Z. `perspective` no pai é o que faz a escala
   * parecer distância e não zoom. */
  if (variant === "depth") {
    return (
      <motion.div
        className={base}
        style={{ perspective: 1400, transformStyle: "preserve-3d", willChange: "transform, opacity" }}
        initial={{ opacity: 0, z: -260, scale: 0.9 }}
        animate={{
          opacity: 1,
          z: 0,
          scale: 1,
          transition: { duration: 0.95, ease: EASE_OUT },
        }}
        exit={{
          opacity: 0,
          z: 180,
          scale: 1.08,
          transition: { duration: 0.5, ease: EASE_IN },
        }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── FADE ── */
  if (variant === "fade") {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } }}
        exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE_IN } }}
      >
        {children}
      </motion.div>
    )
  }

  /* ── SLIDE (padrão) ── */
  const enterX = direction === 1 ? 80 : -80
  const exitX = direction === 1 ? -80 : 80

  return (
    <motion.div
      className={base}
      initial={{ x: enterX, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.5, ease: EASE_IN } }}
    >
      {children}
    </motion.div>
  )
}
