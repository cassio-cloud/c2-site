"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { GridLines, EASE } from "../Editorial"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const INSET = "clamp(40px, 6vw, 110px)"

const ink = "var(--ink)"
const mute = "rgba(21,21,21,0.42)"

/* ═══════════════════════════════════════════════════════════════════
 * MANIFESTO
 *
 * Tipografia como evento: cada linha nasce de trás da própria
 * baseline (clip + rise, ref sinyard), em escala descendente —
 *
 *   a c2 nasce do conteúdo.     (o grito, 300→700)
 *   mas pensa com craft.        (o "Cr" itálico — eco do lockup)
 *   on e off, com direção.      (a voz normal)
 *   da produção à ia.           (o sussurro, em mute)
 *
 * O único itálico do sistema é o Cr — Brandbook v2.0.
 *
 * Só o texto, as duas fotos e a grade de colunas, no branco: sem marcas
 * de corte, rótulos de coluna ou rodapé. A grade fica — é ela que dá
 * estrutura ao branco agora que a moldura não tem fios.
 * ═══════════════════════════════════════════════════════════════════ */

function MaskedLine({
  children,
  delay,
  style,
}: {
  children: React.ReactNode
  delay: number
  style?: React.CSSProperties
}) {
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "108%" }}
        animate={{ y: 0, transition: { duration: 0.85, ease: EASE, delay } }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
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
  // bold em tudo — a hierarquia vem da cor (ink × mute), não do peso
  const display: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 700,
    fontSize: "clamp(34px, 5.6vw, 112px)",
    lineHeight: 1.0,
    letterSpacing: "-0.045em",
    margin: 0,
    color: ink,
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper text-ink" data-theme="light">
      <GridLines theme="light" cols={4} inset={INSET} />
      {/* fotos editoriais — atrás do tipo */}
      <Foto
        src="/media/credencial/moodboard/mb-03.jpg"
        delay={0.75}
        rotate={-2}
        style={{
          right: "calc(" + INSET + " + 2vw)",
          top: "11%",
          width: "clamp(170px, 21vw, 400px)",
          height: "clamp(210px, 27vw, 520px)",
        }}
      />
      <Foto
        src="/media/credencial/moodboard/mb-08.jpg"
        delay={0.9}
        rotate={2.5}
        style={{
          right: "calc(" + INSET + " + 18vw)",
          bottom: "9%",
          width: "clamp(130px, 15vw, 290px)",
          height: "clamp(165px, 19vw, 370px)",
        }}
      />


      {/* o bloco — 4 linhas em escada, cada uma nascendo da baseline */}
      <div
        className="absolute z-10"
        style={{ left: INSET, right: INSET, top: "50%", transform: "translateY(-50%)" }}
      >
        <MaskedLine delay={0.15}>
          <p style={display}>
            a c2 nasce do <span style={{ color: mute }}>conteúdo.</span>
          </p>
        </MaskedLine>

        <MaskedLine delay={0.3} style={{ marginLeft: "clamp(24px, 4vw, 90px)" }}>
          <p style={display}>
            mas pensa com{" "}
            <span>
              <span className="cred-cr">Cr</span>aft.
            </span>
          </p>
        </MaskedLine>

        <MaskedLine
          delay={0.5}
          style={{ marginTop: "clamp(26px, 4.5vh, 60px)" }}
        >
          <p
            style={{
              ...display,
              fontSize: "clamp(22px, 2.6vw, 48px)",
              letterSpacing: "-0.02em",
            }}
          >
            on e off, com direção.
          </p>
        </MaskedLine>

        <MaskedLine delay={0.62}>
          <p
            style={{
              ...display,
              fontSize: "clamp(22px, 2.6vw, 48px)",
              letterSpacing: "-0.02em",
              color: mute,
            }}
          >
            da produção à ia.
          </p>
        </MaskedLine>
      </div>

    </div>
  )
}
