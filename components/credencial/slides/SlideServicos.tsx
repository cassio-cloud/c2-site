"use client"

import { motion } from "motion/react"
import { CropMarks, IndexLabel, EASE } from "../Editorial"

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

function Row({ s, i }: { s: Servico; i: number }) {
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
      {/* índice */}
      <span
        style={{
          fontFamily: MONO,
          fontSize: "clamp(12px, 1vw, 15px)",
          letterSpacing: "0.1em",
          color: "rgba(13,13,13,0.4)",
          paddingTop: "0.4em",
        }}
      >
        ({s.index})
      </span>

      {/* título massivo */}
      <h2
        className="lowercase"
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: "clamp(40px, 7.5vw, 118px)",
          lineHeight: 0.86,
          letterSpacing: "-0.05em",
          margin: 0,
        }}
      >
        {s.titulo}
      </h2>

      {/* ficha técnica */}
      <div
        style={{
          maxWidth: "clamp(180px, 22vw, 320px)",
          justifySelf: "end",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(13,13,13,0.4)",
            marginBottom: 10,
          }}
        >
          {s.tag}
        </div>
        <p
          style={{
            fontFamily: MONO,
            fontSize: "clamp(11px, 0.85vw, 13px)",
            lineHeight: 1.5,
            color: "rgba(13,13,13,0.7)",
            margin: 0,
          }}
        >
          {s.desc}
        </p>
      </div>
    </motion.div>
  )
}

export function SlideServicos() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-paper text-ink"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingInline: INSET,
        paddingTop: "clamp(80px, 13vh, 150px)",
        paddingBottom: "clamp(70px, 11vh, 130px)",
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
          <Row key={s.index} s={s} i={i} />
        ))}
        <div style={{ borderTop: "1px solid rgba(13,13,13,0.12)" }} />
      </div>
    </div>
  )
}
