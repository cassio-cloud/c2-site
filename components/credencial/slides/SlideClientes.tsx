"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { clientes } from "@/data/credencial/clientes"
import { GradientBloom } from "../GradientBloom"
import { Asterisco } from "../Asterisco"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * CLIENTES — a carteira inteira numa tela
 *
 * As 20 marcas visíveis ao mesmo tempo, grade 5×4 sem células nem
 * fios — só as marcas no preto, todas na mesma escala perceptual.
 * A entrada é o evento: cada logo chega do fundo (z) em onda diagonal,
 * e depois o quadro respira parado — hover acende a marca.
 *
 * Democrático como manda o brandbook: sem hierarquia, sem destaque.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideClientes() {
  const portrait = usePortrait()
  const cols = portrait ? 3 : 5

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ background: "var(--black)" }}
    >
      <GradientBloom x={50} y={115} size={85} intensity={0.15} />

      {/* cabeçalho */}
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
          clientes.
        </motion.h2>

        <motion.div
          className="cred-mono flex items-center gap-3 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.35 } }}
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "var(--mute-3)",
            paddingBottom: 8,
          }}
        >
          <Asterisco size={10} />
          {clientes.length} marcas · sem hierarquia
        </motion.div>
      </div>

      {/* grade completa */}
      <div
        className="absolute grid"
        style={{
          top: "clamp(124px, 19vh, 180px)",
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          bottom: "clamp(48px, 7.5vh, 72px)",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridAutoRows: "1fr",
          columnGap: "clamp(20px, 3vw, 60px)",
          rowGap: "clamp(8px, 1.5vh, 20px)",
        }}
      >
        {clientes.map((logo, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          return (
            <motion.div
              key={logo.name}
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.86, y: 18 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: EASE,
                  // onda diagonal: linha + coluna definem a vez
                  delay: 0.15 + (row + col) * 0.07,
                },
              }}
            >
              <div
                className="relative h-full w-full"
                style={{
                  maxHeight: logo.large ? "58%" : "42%",
                  maxWidth: "82%",
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="18vw"
                  className="object-contain opacity-60 transition-opacity duration-500 hover:opacity-100"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
