"use client"

import { motion } from "motion/react"
import { FOGS_REEL, FOGS_SITE, FOGS_BIO } from "@/data/credencial/fogs"
import { Grain } from "../Grain"
import { CredHero } from "../CredHero"
import { usePortrait, FACE_POSITION, ghostColor, IndexLabel, EASE } from "../Editorial"

export function SlideFogs() {
  const portrait = usePortrait()

  const Texto = (
    <motion.div
      className="relative z-10 flex h-full w-full flex-col justify-center"
      style={{
        paddingInline: portrait ? "clamp(28px, 7vw, 80px)" : "clamp(40px, 5vw, 96px)",
        paddingBlock: portrait ? "clamp(28px, 5vh, 56px)" : "clamp(48px, 9vh, 120px)",
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.2 } }}
    >
      {/* eyebrow */}
      <div className="flex items-center justify-between" style={{ marginBottom: portrait ? 14 : 22 }}>
        <IndexLabel theme="dark" strong>
          (→) diretor parceiro
        </IndexLabel>
        {!portrait && <IndexLabel theme="dark">a empresa · direção</IndexLabel>}
      </div>

      <h2
        className="lowercase"
        style={{
          fontWeight: 700,
          fontSize: portrait ? "clamp(40px, 11vw, 64px)" : "clamp(44px, 4.6vw, 96px)",
          letterSpacing: "-0.045em",
          lineHeight: 0.96,
          margin: 0,
        }}
      >
        lucas fogs
      </h2>

      <div style={{ marginTop: portrait ? 16 : 26, display: "grid", gap: portrait ? 10 : 16, maxWidth: "46ch" }}>
        {FOGS_BIO.map((p, i) => (
          <p
            key={i}
            style={{
              color: i === FOGS_BIO.length - 1 ? "var(--paper)" : "var(--mute-2)",
              fontWeight: i === FOGS_BIO.length - 1 ? 600 : 400,
              fontSize: portrait ? "clamp(13px, 3.6vw, 15px)" : "clamp(14px, 1.1vw, 18px)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {p}
          </p>
        ))}
      </div>

      <a
        href={FOGS_SITE}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-mono"
        style={{
          display: "inline-block",
          marginTop: portrait ? 18 : 28,
          color: "var(--paper)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "lowercase",
          borderBottom: "1px solid var(--mute-3)",
          paddingBottom: 3,
          width: "fit-content",
        }}
      >
        lucasfogs.com ↗
      </a>
    </motion.div>
  )

  const Reel = (
    <motion.div
      className="relative overflow-hidden bg-ink-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE } }}
    >
      <CredHero
        src={FOGS_REEL}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: FACE_POSITION }}
      />
    </motion.div>
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink text-paper">
      <div
        className="grid h-full w-full"
        style={portrait ? { gridTemplateRows: "52% 48%" } : { gridTemplateColumns: "48% 52%" }}
      >
        {portrait ? (
          <>
            {Reel}
            {Texto}
          </>
        ) : (
          <>
            {Texto}
            {Reel}
          </>
        )}
      </div>

      {/* ghost "diretor de cena" — só no desktop */}
      {!portrait && (
        <span
          aria-hidden
          className="pointer-events-none absolute lowercase font-bold"
          style={{
            left: "clamp(28px, 4vw, 80px)",
            bottom: "clamp(40px, 7vh, 96px)",
            fontSize: "clamp(40px, 5.5vw, 96px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: ghostColor("dark"),
            zIndex: 5,
          }}
        >
          diretor de cena
        </span>
      )}

      <Grain />
    </div>
  )
}
