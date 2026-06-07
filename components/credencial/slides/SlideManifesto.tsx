"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { GridLines, CropMarks, IndexLabel, EASE } from "../Editorial"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const INSET = "clamp(40px, 6vw, 110px)"

const ink = "var(--ink)"
const mute = "rgba(13,13,13,0.5)"

function Line({
  children,
  delay,
  style,
}: {
  children: React.ReactNode
  delay: number
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/** Foto editorial pequena com leve rotação (estilo moodboard). */
function Foto({
  src,
  delay,
  style,
  rotate = 0,
}: {
  src: string
  delay: number
  style: React.CSSProperties
  rotate?: number
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay } }}
      className="absolute overflow-hidden"
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
    </motion.div>
  )
}

export function SlideManifesto() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-paper text-ink">
      <GridLines theme="light" cols={4} inset={INSET} />
      <CropMarks theme="light" inset={INSET} />

      {/* fotos editoriais (estilo Visual Board) */}
      <Foto
        src="/media/credencial/moodboard/mb-03.jpg"
        delay={0.4}
        rotate={-2}
        style={{
          right: "calc(" + INSET + " + 2vw)",
          top: "16%",
          width: "clamp(120px, 14vw, 230px)",
          height: "clamp(150px, 18vw, 300px)",
        }}
      />
      <Foto
        src="/media/credencial/moodboard/mb-08.jpg"
        delay={0.55}
        rotate={2.5}
        style={{
          right: "calc(" + INSET + " + 13vw)",
          bottom: "16%",
          width: "clamp(100px, 11vw, 180px)",
          height: "clamp(120px, 14vw, 230px)",
        }}
      />

      {/* marcadores de grid no topo */}
      <div
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <Line delay={0.1}>
          <div style={{ display: "flex", gap: "clamp(40px, 22vw, 320px)" }}>
            <IndexLabel theme="light">A</IndexLabel>
            <IndexLabel theme="light">B</IndexLabel>
            <IndexLabel theme="light">C</IndexLabel>
          </div>
        </Line>
        <Line delay={0.16}>
          <IndexLabel theme="light" strong>
            (→) manifesto
          </IndexLabel>
        </Line>
      </div>

      {/* composição central assimétrica */}
      <div
        className="absolute z-10"
        style={{
          left: INSET,
          right: INSET,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Line delay={0.25}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: "clamp(34px, 5.4vw, 104px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              margin: 0,
              color: ink,
              maxWidth: "16ch",
            }}
          >
            a c2 nasce do{" "}
            <span style={{ fontWeight: 700 }}>conteúdo.</span>{" "}
            <br />
            mas pensa com <span style={{ fontWeight: 700 }}>craft.</span>
          </p>
        </Line>

        <Line
          delay={0.42}
          style={{
            marginTop: "clamp(24px, 4vh, 56px)",
            maxWidth: "26ch",
          }}
        >
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              color: ink,
            }}
          >
            on e off, com direção.
            <br />
            <span style={{ color: mute }}>da produção à ia.</span>
          </p>
        </Line>
      </div>

      {/* rodapé editorial */}
      <div
        className="absolute z-10 flex items-end justify-between"
        style={{ left: INSET, right: INSET, bottom: "clamp(48px, 8vh, 120px)" }}
      >
        <Line delay={0.58}>
          <IndexLabel theme="light">desde 2018</IndexLabel>
        </Line>
        <Line delay={0.62}>
          <IndexLabel theme="light" strong>
            01 — 03
          </IndexLabel>
        </Line>
      </div>
    </div>
  )
}
