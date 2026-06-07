"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Grain } from "../Grain"

const EASE = [0.32, 0.72, 0, 1] as const

/**
 * Capa minimalista — fundo ink sólido, logo SVG centralizado vertical
 * no centro da metade esquerda. Sem header/footer (hideFrame em SlideEngine).
 */
export function SlideCapa() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingLeft: "calc(25% - min(7vh, 70px))" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 1.1, ease: EASE, delay: 0.15 },
          }}
          style={{ lineHeight: 0 }}
        >
          <Image
            src="/media/credencial/c2-logo.svg"
            alt="C2"
            width={480}
            height={228}
            priority
            style={{
              height: "min(13vh, 130px)",
              width: "auto",
              display: "block",
            }}
          />
        </motion.div>
      </div>
      <Grain />
    </div>
  )
}
