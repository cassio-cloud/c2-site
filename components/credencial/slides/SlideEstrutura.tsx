"use client"

import { motion } from "motion/react"
import { CropMarks, GridLines, IndexLabel, ghostColor, usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const
const INSET = "clamp(40px, 6vw, 110px)"

type Studio = {
  nome: string
  local: string
  area: string
  coord: string
  status?: string
  descricao: string
}

const STUDIOS: Studio[] = [
  {
    nome: "311.",
    local: "Novo Hamburgo · RS",
    area: "300 m²",
    coord: "29°41′S 51°07′W",
    descricao:
      "300m² para campanha publicitária, conteúdo de marca e foto de produto.",
  },
  {
    nome: "909.",
    local: "São Paulo · SP",
    area: "Em breve",
    coord: "23°33′S 46°38′W",
    status: "Em breve",
    descricao:
      "Espaço de criação, reunião e produção de conteúdo no centro de SP.",
  },
]

/** Marcadores de canto (4 quadrados ink) que delimitam o card. */
function CornerMarks() {
  const cls = "absolute h-1.5 w-1.5 bg-ink/80 pointer-events-none"
  return (
    <>
      <span className={`${cls} -top-px -left-px`} />
      <span className={`${cls} -top-px -right-px`} />
      <span className={`${cls} -bottom-px -left-px`} />
      <span className={`${cls} -bottom-px -right-px`} />
    </>
  )
}

function Card({ s, i, portrait }: { s: Studio; i: number; portrait: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: EASE, delay: 0.2 + i * 0.12 },
      }}
      className="relative flex flex-col overflow-hidden"
      style={{
        background: "rgba(13,13,13,0.035)",
        boxShadow: "inset 0 0 0 1px rgba(13,13,13,0.06)",
        padding: portrait ? "clamp(16px, 4.5vw, 28px)" : "clamp(28px, 3vw, 52px)",
        minHeight: portrait ? "clamp(168px, 23vh, 260px)" : "clamp(420px, 38vw, 600px)",
      }}
    >
      <CornerMarks />

      {/* número ghost gigante atrás */}
      <span
        aria-hidden
        className="pointer-events-none absolute font-bold lowercase"
        style={{
          right: "-2%",
          bottom: "-12%",
          fontSize: portrait ? "clamp(120px, 36vw, 200px)" : "clamp(220px, 26vw, 460px)",
          lineHeight: 0.7,
          letterSpacing: "-0.06em",
          color: ghostColor("light"),
        }}
      >
        {s.nome.replace(".", "")}
      </span>

      <div
        className="relative z-10 flex items-baseline justify-between gap-2 border-b pb-3 font-mono"
        style={{
          borderColor: "rgba(13,13,13,0.14)",
          fontSize: portrait ? 10 : 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(13,13,13,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        <span>Studio · {s.nome.replace(".", "")}</span>
        <span>{s.coord}</span>
      </div>

      <p
        className="relative z-10 font-bold tracking-tight lowercase"
        style={{
          fontSize: portrait ? "clamp(52px, 16vw, 96px)" : "clamp(80px, 12vw, 200px)",
          letterSpacing: "-0.05em",
          lineHeight: 0.88,
          marginTop: "auto",
          marginBottom: 0,
        }}
      >
        {s.nome}
      </p>

      <div
        className="relative z-10 flex items-center gap-3"
        style={{ marginTop: 14 }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(13,13,13,0.85)" }}
        >
          {s.local}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "rgba(13,13,13,0.5)",
            border: "1px solid rgba(13,13,13,0.18)",
            padding: "3px 8px",
          }}
        >
          {s.area}
        </span>
      </div>

      <p
        className="relative z-10"
        style={{
          marginTop: 18,
          maxWidth: 400,
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(13,13,13,0.72)",
        }}
      >
        {s.descricao}
      </p>
    </motion.div>
  )
}

export function SlideEstrutura() {
  const portrait = usePortrait()
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-paper text-ink"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: portrait ? "flex-start" : "center",
        paddingInline: portrait ? "clamp(28px, 7vw, 120px)" : "clamp(60px, 8vw, 120px)",
        paddingTop: portrait ? "clamp(78px, 11vh, 120px)" : "clamp(80px, 12vh, 120px)",
        paddingBottom: portrait ? "clamp(34px, 5vh, 120px)" : "clamp(80px, 12vh, 120px)",
      }}
    >
      <GridLines theme="light" cols={portrait ? 1 : 2} inset={INSET} />
      <CropMarks theme="light" inset={INSET} />

      <div
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme="light" strong>
          (→) estúdios próprios
        </IndexLabel>
        <IndexLabel theme="light">a empresa · estrutura</IndexLabel>
      </div>

      <motion.h2
        className="lowercase"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE },
        }}
        style={{
          fontWeight: 700,
          fontSize: portrait ? "clamp(38px, 12vw, 80px)" : "clamp(48px, 8vw, 132px)",
          letterSpacing: "-0.045em",
          lineHeight: 0.96,
          margin: 0,
          marginBottom: portrait ? "clamp(14px, 2vh, 40px)" : "clamp(32px, 5vh, 64px)",
        }}
      >
        estrutura.
      </motion.h2>

      <div
        className={portrait ? "grid grid-cols-1" : "grid grid-cols-2"}
        style={{ gap: portrait ? "clamp(12px, 3vw, 40px)" : "clamp(16px, 2vw, 40px)" }}
      >
        {STUDIOS.map((s, i) => (
          <Card key={s.nome} s={s} i={i} portrait={portrait} />
        ))}
      </div>
    </div>
  )
}
