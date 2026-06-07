"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Grain } from "../Grain"
import { GridLines, CropMarks, IndexLabel, EASE, ghostColor } from "../Editorial"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const INSET = "clamp(40px, 6vw, 110px)"

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
      style={{ transform: `rotate(${rotate}deg)`, zIndex: 1, ...style }}
    >
      <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
    </motion.div>
  )
}

export function SlideIAManifesto() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink text-paper">
      <GridLines theme="dark" cols={4} inset={INSET} />
      <CropMarks theme="dark" inset={INSET} />

      {/* fotos editoriais de cases IA */}
      <Foto
        src="/media/credencial/lib2/ia-goat/04.png"
        delay={0.45}
        rotate={2.4}
        style={{
          right: "calc(" + INSET + " + 2vw)",
          top: "18%",
          width: "clamp(140px, 16vw, 280px)",
          height: "clamp(110px, 12vw, 210px)",
        }}
      />
      <Foto
        src="/media/credencial/lib2/ia-carrano/01.jpg"
        delay={0.6}
        rotate={-2.2}
        style={{
          right: "calc(" + INSET + " + 15vw)",
          bottom: "13%",
          width: "clamp(110px, 12vw, 200px)",
          height: "clamp(140px, 16vw, 260px)",
        }}
      />

      {/* glyph ghost atrás */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2, ease: EASE, delay: 0.1 } }}
        className="pointer-events-none absolute z-0 lowercase"
        style={{
          right: INSET,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: "min(70vh, 55vw)",
          lineHeight: 0.8,
          letterSpacing: "-0.06em",
          color: ghostColor("dark"),
        }}
      >
        ia.
      </motion.div>

      {/* eyebrow + marcador */}
      <div
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.15 } }}
        >
          <IndexLabel theme="dark" strong>
            (→) inteligência artificial
          </IndexLabel>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.2 } }}
        >
          <IndexLabel theme="dark">// 04</IndexLabel>
        </motion.div>
      </div>

      {/* statement principal */}
      <div
        className="absolute z-10"
        style={{ left: INSET, right: INSET, top: "50%", transform: "translateY(-50%)" }}
      >
        <motion.p
          className="lowercase"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.25 } }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: "clamp(34px, 5.2vw, 100px)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            margin: 0,
            maxWidth: "15ch",
          }}
        >
          não é sobre <span style={{ fontWeight: 700 }}>usar ia.</span>
          <br />
          é sobre saber{" "}
          <span style={{ fontWeight: 700 }}>quando usar.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.5 } }}
          style={{
            marginTop: "clamp(24px, 4vh, 48px)",
            maxWidth: "42ch",
            fontFamily: "var(--font-mono-jb), ui-monospace, monospace",
            fontSize: "clamp(11px, 0.9vw, 14px)",
            lineHeight: 1.6,
            color: "var(--mute-2)",
          }}
        >
          Trabalhamos com IA antes dela virar assunto. Cada projeto pede uma
          decisão diferente — técnica, não modismo.
        </motion.p>
      </div>

      {/* rodapé — modos */}
      <div
        className="absolute z-10 flex items-end justify-between"
        style={{ left: INSET, right: INSET, bottom: "clamp(48px, 8vh, 120px)" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.7 } }}
          style={{ display: "flex", gap: "clamp(20px, 2vw, 36px)" }}
        >
          <IndexLabel theme="dark" strong>
            100% ia
          </IndexLabel>
          <IndexLabel theme="dark">·</IndexLabel>
          <IndexLabel theme="dark" strong>
            híbrido
          </IndexLabel>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.75 } }}
        >
          <IndexLabel theme="dark">manifesto · ia</IndexLabel>
        </motion.div>
      </div>

      <Grain />
    </div>
  )
}
