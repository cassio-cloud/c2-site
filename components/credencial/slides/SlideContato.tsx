"use client"

import { motion } from "motion/react"
import { Grain } from "../Grain"

const EASE = [0.2, 0.7, 0.2, 1] as const

function Linha({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE, delay },
      }}
    >
      {children}
    </motion.div>
  )
}

export function SlideContato() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-end bg-ink"
      style={{ paddingInline: "8vw", paddingBottom: "12vh" }}
    >
      <Linha delay={0.1}>
        <h2
          className="lowercase"
          style={{
            fontWeight: 700,
            fontSize: "clamp(48px, 8vw, 132px)",
            lineHeight: 0.96,
            letterSpacing: "-0.045em",
            margin: 0,
          }}
        >
          vamos trabalhar juntos.
        </h2>
      </Linha>

      <div style={{ marginTop: "clamp(24px, 4vh, 48px)", display: "grid", gap: 8 }}>
        <Linha delay={0.25}>
          <a
            href="mailto:contato@c2content.com.br"
            className="font-mono"
            style={{
              color: "var(--mute-1)",
              fontSize: 14,
              letterSpacing: "0.05em",
            }}
          >
            contato@c2content.com.br
          </a>
        </Linha>
        <Linha delay={0.35}>
          <a
            href="https://wa.me/5551995354727"
            className="font-mono"
            style={{
              color: "var(--mute-1)",
              fontSize: 14,
              letterSpacing: "0.05em",
            }}
          >
            +55 51 99535-4727
          </a>
        </Linha>
      </div>

      <Linha delay={0.5}>
        <div
          className="font-mono"
          style={{
            color: "var(--mute-3)",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: "clamp(24px, 4vh, 40px)",
            display: "flex",
            gap: 20,
          }}
        >
          <span>Instagram</span>
          <span>·</span>
          <span>LinkedIn</span>
          <span>·</span>
          <span>YouTube</span>
        </div>
      </Linha>

      <Linha delay={0.7}>
        <div
          className="font-mono"
          style={{
            color: "var(--mute-4)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: "clamp(40px, 6vh, 80px)",
          }}
        >
          C2 Content · 2026 · c2content.com.br
        </div>
      </Linha>

      <Grain />
    </div>
  )
}
