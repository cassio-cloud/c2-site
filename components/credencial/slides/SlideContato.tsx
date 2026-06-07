"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { cases } from "@/data/credencial/cases"
import { iaCases } from "@/data/credencial/ia"
import { Grain } from "../Grain"
import { FACE_POSITION } from "../Editorial"

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Pool de stills "hero" dos cases + IA (1ª imagem de cada), sem assets novos. */
const MONTAGE: string[] = [
  ...cases.map((c) => c.imagens[0]),
  ...iaCases.map((ia) => ia.imagens?.[0]).filter((s): s is string => Boolean(s)),
].filter(Boolean)

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

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

/** Montagem viva: stills de cases trocando em crossfade (Ken Burns sutil) atrás dos contatos. */
function MontagemFundo() {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced || MONTAGE.length <= 1) return
    const id = setInterval(() => {
      setI((p) => (p + 1) % MONTAGE.length)
    }, 3200)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-ink">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          <Image
            src={MONTAGE[i]}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
            style={{ objectPosition: FACE_POSITION }}
          />
        </motion.div>
      </AnimatePresence>

      {/* scrim escuro pra legibilidade (mais pesado embaixo, onde fica o texto) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(13,13,13,0.94) 0%, rgba(13,13,13,0.78) 38%, rgba(13,13,13,0.55) 100%)",
        }}
      />
    </div>
  )
}

export function SlideContato() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-end bg-ink text-paper"
      style={{ paddingInline: "8vw", paddingBottom: "12vh" }}
    >
      <MontagemFundo />

      <div className="relative z-10">
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
              href="mailto:luana@c2content.com.br"
              className="font-mono"
              style={{
                color: "var(--mute-1)",
                fontSize: 14,
                letterSpacing: "0.05em",
              }}
            >
              luana@c2content.com.br
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
      </div>

      <Grain />
    </div>
  )
}
