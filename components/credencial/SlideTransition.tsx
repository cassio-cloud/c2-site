"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

// Apple/Linear-tier easing (heavier mass on exit, snappy entry tail)
const EASE_OUT = [0.32, 0.72, 0, 1] as const
const EASE_IN = [0.6, 0, 0.85, 0.35] as const

export type TransitionVariant = "slide" | "fade"

type Props = {
  children: ReactNode
  direction: 1 | -1
  variant?: TransitionVariant
}

export function SlideTransition({ children, direction, variant = "slide" }: Props) {
  if (variant === "fade") {
    return (
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.7, ease: EASE_OUT },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.45, ease: EASE_IN },
        }}
      >
        {children}
      </motion.div>
    )
  }

  const enterX = direction === 1 ? 80 : -80
  const exitX = direction === 1 ? -80 : 80

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ x: enterX, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.7, ease: EASE_OUT },
      }}
      exit={{
        x: exitX,
        opacity: 0,
        transition: { duration: 0.5, ease: EASE_IN },
      }}
    >
      {children}
    </motion.div>
  )
}
