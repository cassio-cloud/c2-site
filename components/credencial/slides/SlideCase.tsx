"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { Case } from "@/data/credencial/cases"
import { SITE_URL } from "@/data/credencial/cases"
import { Grain } from "../Grain"
import { CredVideo } from "../CredVideo"
import { usePortrait, FACE_POSITION } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

type Props = { case: Case }

export function SlideCase({ case: c }: Props) {
  const portrait = usePortrait()
  const hasVideo = Boolean(c.video)
  // hero (grande) = vídeo, senão a 1ª imagem; resto vai no grid lateral (até 6)
  const stills = (hasVideo ? c.imagens : c.imagens.slice(1)).slice(0, 6)
  const mainImg = hasVideo ? undefined : c.imagens[0]
  // grid lateral: 1 coluna até 3 fotos, 2 colunas de 4 a 6
  const sideCols = stills.length > 3 ? 2 : 1
  const sideRows = Math.ceil(stills.length / sideCols)
  // última foto ocupa 2 colunas quando o total é ímpar (evita buraco)
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
        {c.cliente.toLowerCase()}.
        {c.projeto && (
          <span style={{ color: "var(--mute-2)" }}> {c.projeto.toLowerCase()}</span>
        )}
      </div>
      <div
        className="font-mono"
        style={{
          color: "var(--mute-3)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginTop: 10,
        }}
      >
        {c.tags.join(" · ")}
      </div>
      {c.sobre && (
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
          {c.sobre}
        </p>
      )}
      <a
        href={`${SITE_URL}/trabalho/${c.siteSlug ?? c.id}`}
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
      {hasVideo ? (
        <CredVideo
          src={c.video!}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: FACE_POSITION }}
        />
      ) : (
        mainImg && (
          <Image
            src={mainImg}
            alt={c.cliente}
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ objectPosition: FACE_POSITION }}
          />
        )
      )}
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

  const Stills = stills.length > 0 && (
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
          stills.length === 0
            ? { gridTemplateColumns: "1fr" }
            : portrait
            ? { gridTemplateRows: "60% 40%" }
            : { gridTemplateColumns: "62% 38%" }
        }
      >
        {Hero}
        {Stills}
      </div>
      <Grain />
    </div>
  )
}
