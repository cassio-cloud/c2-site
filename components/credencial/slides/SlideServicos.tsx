"use client"

import { motion } from "motion/react"
import { CropMarks, IndexLabel, EASE, usePortrait } from "../Editorial"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "var(--font-mono-jb), ui-monospace, monospace"
const INSET = "clamp(40px, 6vw, 110px)"

type Servico = {
  index: string
  titulo: string
  tag: string
  desc: string
}

const servicos: Servico[] = [
  {
    index: "01",
    titulo: "campanha.",
    tag: "produção audiovisual",
    desc: "Onde o conceito encontra o craft. Campanhas com direção apurada, intenção criativa e excelência técnica.",
  },
  {
    index: "02",
    titulo: "conteúdo.",
    tag: "always-on · projetos",
    desc: "Do always-on aos projetos especiais. Conteúdo audiovisual com intenção criativa, ritmo e craft.",
  },
  {
    index: "03",
    titulo: "ia.",
    tag: "100% ia · híbrido",
    desc: "Quando usar, como usar. Produção com IA sem mistificação — decisão técnica, não modismo.",
  },
]

function Row({ s, i, portrait }: { s: Servico; i: number; portrait: boolean }) {
  const index = (
    <span
      style={{
        fontFamily: MONO,
        fontSize: "clamp(12px, 1vw, 15px)",
        letterSpacing: "0.1em",
        color: "rgba(13,13,13,0.4)",
        paddingTop: portrait ? 0 : "0.4em",
      }}
    >
      ({s.index})
    </span>
  )

  const titulo = (
    <h2
      className="lowercase"
      style={{
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: portrait ? "clamp(38px, 12vw, 64px)" : "clamp(40px, 7.5vw, 118px)",
        lineHeight: 0.86,
        letterSpacing: "-0.05em",
        margin: 0,
      }}
    >
      {s.titulo}
    </h2>
  )

  const ficha = (
    <div
      style={
        portrait
          ? { maxWidth: "46ch" }
          : { maxWidth: "clamp(180px, 22vw, 320px)", justifySelf: "end", textAlign: "left" }
      }
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(13,13,13,0.4)",
          marginBottom: portrait ? 6 : 10,
        }}
      >
        {s.tag}
      </div>
      <p
        style={{
          fontFamily: MONO,
          fontSize: portrait ? 12 : "clamp(11px, 0.85vw, 13px)",
          lineHeight: 1.5,
          color: "rgba(13,13,13,0.7)",
          margin: 0,
        }}
      >
        {s.desc}
      </p>
    </div>
  )

  // portrait: empilha (índice+título numa linha, ficha embaixo full-width)
  if (portrait) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: EASE, delay: 0.2 + i * 0.16 },
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBlock: "clamp(14px, 2.4vh, 26px)",
          borderTop: "1px solid rgba(13,13,13,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          {index}
          {titulo}
        </div>
        {ficha}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: EASE, delay: 0.2 + i * 0.16 },
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "baseline",
        columnGap: "clamp(24px, 4vw, 72px)",
        paddingBlock: "clamp(14px, 2.2vh, 32px)",
        borderTop: "1px solid rgba(13,13,13,0.12)",
      }}
    >
      {index}
      {titulo}
      {ficha}
    </motion.div>
  )
}

export function SlideServicos() {
  const portrait = usePortrait()
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-paper text-ink"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: portrait ? "flex-start" : "center",
        paddingInline: INSET,
        paddingTop: portrait ? "clamp(96px, 15vh, 150px)" : "clamp(80px, 13vh, 150px)",
        paddingBottom: portrait ? "clamp(60px, 9vh, 130px)" : "clamp(70px, 11vh, 130px)",
      }}
    >
      <CropMarks theme="light" inset={INSET} />

      {/* eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }}
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme="light" strong>
          (→) o que fazemos
        </IndexLabel>
        <IndexLabel theme="light">serviços · 02</IndexLabel>
      </motion.div>

      <div style={{ position: "relative", zIndex: 10 }}>
        {servicos.map((s, i) => (
          <Row key={s.index} s={s} i={i} portrait={portrait} />
        ))}
        <div style={{ borderTop: "1px solid rgba(13,13,13,0.12)" }} />
      </div>
    </div>
  )
}
