"use client"

import { motion } from "motion/react"

type Props = {
  idx: number
  total: number
  theme?: "dark" | "light"
}

export function SlideProgress({ idx, total, theme = "dark" }: Props) {
  const pct = ((idx + 1) / total) * 100
  const fillBg = theme === "dark" ? "rgba(239,239,239,0.55)" : "rgba(13,13,13,0.55)"

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-50"
      // sem trilho: só o traço que cresce — nenhum fio de ponta a ponta
      style={{ height: 1 }}
    >
      <motion.div
        className="h-full"
        style={{ background: fillBg }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </div>
  )
}
