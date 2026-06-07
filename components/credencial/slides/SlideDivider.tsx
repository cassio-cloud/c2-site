"use client"

import { motion } from "motion/react"
import { Grain } from "../Grain"
import { GridLines, CropMarks, IndexLabel, EASE, ghostColor } from "../Editorial"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const INSET = "clamp(40px, 6vw, 110px)"

type Props = {
  label: string
  titulo: string
  bg: "dark" | "light"
  glow?: boolean
}

export function SlideDivider({ label, titulo, bg, glow = false }: Props) {
  const isDark = bg === "dark"
  const theme = isDark ? "dark" : "light"
  // extrai o número de seção do label ("03 · TRABALHO" -> "03")
  const num = label.trim().split(/\s|·/)[0] || ""

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: isDark ? "var(--ink)" : "var(--paper)",
        color: isDark ? "var(--paper)" : "var(--ink)",
      }}
    >
      <GridLines theme={theme} cols={4} inset={INSET} />
      <CropMarks theme={theme} inset={INSET} />

      {/* número ghost gigante atrás */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2, ease: EASE, delay: 0.1 } }}
        className="pointer-events-none absolute z-0"
        style={{
          right: INSET,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: "min(70vh, 60vw)",
          lineHeight: 0.8,
          letterSpacing: "-0.06em",
          color: ghostColor(theme),
        }}
      >
        {num}
      </motion.div>

      {/* eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.15 } }}
        className="absolute z-10"
        style={{ left: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme={theme} strong>
          (→) {label}
        </IndexLabel>
      </motion.div>

      {/* marcador de canto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.2 } }}
        className="absolute z-10"
        style={{ right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme={theme}>// {num}</IndexLabel>
      </motion.div>

      {/* título massivo */}
      <div
        className="absolute z-10"
        style={{ left: INSET, right: INSET, top: "50%", transform: "translateY(-50%)" }}
      >
        <motion.h1
          className="lowercase"
          initial={{ opacity: 0, x: 60 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 1.0, ease: EASE, delay: 0.22 },
          }}
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "clamp(80px, 15vw, 280px)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            margin: 0,
            textShadow: glow ? "0 0 120px rgba(239,239,239,0.18)" : undefined,
          }}
        >
          {titulo}
        </motion.h1>
      </div>

      {isDark && <Grain />}
    </div>
  )
}
