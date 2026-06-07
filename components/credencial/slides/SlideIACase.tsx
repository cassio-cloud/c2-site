"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { IACase } from "@/data/credencial/ia"
import { SITE_URL } from "@/data/credencial/ia"
import { Grain } from "../Grain"
import { CredHero } from "../CredHero"
import { usePortrait, FACE_POSITION } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

type Props = { ia: IACase }

export function SlideIACase({ ia }: Props) {
  const portrait = usePortrait()
  const maxStills = portrait ? 3 : 6
  const stills = (ia.imagens ?? []).slice(0, maxStills)
  const hasStills = stills.length > 0
  const sideCols = stills.length > 3 ? 2 : 1
  const sideRows = Math.ceil(Math.max(stills.length, 1) / sideCols)
  const spanLast = sideCols === 2 && stills.length % 2 === 1

  const TextBlock = (
    <motion.div
      className="absolute z-10"
      style={{
        bottom: "clamp(60px, 9vh, 110px)",
        left: "clamp(32px, 5vw, 80px)",
        right: "clamp(32px, 5vw, 80px)",
        maxWidth: portrait ? "none" : "min(48vw, 560px)",
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.4 } }}
    >
      <div
        className="lowercase"
        style={{
          fontWeight: 700,
          fontSize: "clamp(26px, 3.2vw, 52px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.98,
        }}
      >
        {ia.cliente.toLowerCase()}.
        {ia.projeto && (
          <span style={{ color: "var(--mute-2)" }}> {ia.projeto.toLowerCase()}</span>
        )}
      </div>
      {ia.sobre && (
        <p
          className="font-mono"
          style={{
            color: "var(--mute-2)",
            fontSize: "clamp(11px, 0.85vw, 13px)",
            lineHeight: 1.55,
            margin: "14px 0 0",
            maxWidth: "42ch",
          }}
        >
          {ia.sobre}
        </p>
      )}
      <a
        href={`${SITE_URL}/trabalho/${ia.siteSlug ?? ia.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-mono"
        style={{
          display: "inline-block",
          marginTop: 14,
          color: "var(--paper)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          borderBottom: "1px solid var(--mute-3)",
          paddingBottom: 3,
        }}
      >
        ver no site ↗
      </a>
    </motion.div>
  )

  const Hero = (
    <motion.div
      className="relative overflow-hidden bg-ink-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE } }}
    >
      <CredHero
        src={ia.video}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center center" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "55%",
          background:
            "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0) 100%)",
        }}
      />
      {TextBlock}
    </motion.div>
  )

  const Stills = hasStills && (
    <div
      className="grid"
      style={{
        gap: 0,
        background: "var(--ink)",
        ...(portrait
          ? { gridTemplateColumns: `repeat(${stills.length > 3 ? 2 : stills.length}, 1fr)` }
          : {
              gridTemplateColumns: `repeat(${sideCols}, 1fr)`,
              gridTemplateRows: `repeat(${sideRows}, 1fr)`,
            }),
      }}
    >
      {stills.map((src, i) => (
        <motion.div
          key={src}
          className="relative overflow-hidden"
          style={
            spanLast && i === stills.length - 1
              ? { gridColumn: "1 / -1" }
              : undefined
          }
          initial={{ opacity: 0, x: portrait ? 0 : 20, y: portrait ? 20 : 0 }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.6, ease: EASE, delay: 0.15 + i * 0.08 },
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="33vw"
            className="object-cover"
            style={{ objectPosition: FACE_POSITION }}
          />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink text-paper">
      <div
        className="grid h-full w-full"
        style={
          !hasStills
            ? { gridTemplateColumns: "1fr" }
            : portrait
            ? { gridTemplateRows: "60% 40%" }
            : { gridTemplateColumns: "62% 38%" }
        }
      >
        {Hero}
        {Stills}
      </div>

      <div
        className="absolute z-20 flex items-center justify-between"
        style={{
          left: "clamp(32px, 5vw, 80px)",
          right: "clamp(32px, 5vw, 80px)",
          top: "clamp(72px, 9vh, 112px)",
        }}
      >
        <span
          className="font-mono uppercase"
          style={{ color: "var(--mute-2)", fontSize: 11, letterSpacing: "0.22em" }}
        >
          (→) {ia.tipo}
        </span>
        <span
          className="font-mono uppercase"
          style={{ color: "var(--mute-3)", fontSize: 11, letterSpacing: "0.22em" }}
        >
          ia · {ia.siteSlug?.replace("ia-", "")}
        </span>
      </div>

      <Grain />
    </div>
  )
}
