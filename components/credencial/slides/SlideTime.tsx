"use client"

import { motion } from "motion/react"
import { time } from "@/data/credencial/time"
import { CropMarks, GridLines, IndexLabel, usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const
const INSET = "clamp(40px, 6vw, 110px)"

/**
 * Time — retratos B&W grandes com nome/função sobrepostos (editorial),
 * grid 3×2, intro e moldura de grid pra ganhar peso visual.
 */
export function SlideTime() {
  const portrait = usePortrait()
  return (
    <div
      className="relative flex h-full w-full flex-col bg-paper text-ink"
      style={{
        paddingInline: portrait ? "clamp(24px, 6vw, 120px)" : "clamp(60px, 8vw, 120px)",
        paddingTop: portrait ? "clamp(92px, 13vh, 130px)" : "clamp(80px, 12vh, 130px)",
        paddingBottom: portrait ? "clamp(40px, 6vh, 110px)" : "clamp(60px, 9vh, 110px)",
      }}
    >
      <GridLines theme="light" cols={portrait ? 2 : 3} inset={INSET} />
      <CropMarks theme="light" inset={INSET} />

      {/* eyebrow */}
      <div
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme="light" strong>
          (→) quem faz
        </IndexLabel>
        <IndexLabel theme="light">a empresa · time</IndexLabel>
      </div>

      {/* título + intro */}
      <div
        className="relative z-10 flex justify-between"
        style={{
          flexDirection: portrait ? "column" : "row",
          alignItems: portrait ? "flex-start" : "flex-end",
          gap: portrait ? "clamp(8px, 1.5vh, 16px)" : "clamp(20px, 4vw, 80px)",
          marginBottom: "clamp(16px, 3vh, 36px)",
        }}
      >
        <motion.h2
          className="lowercase"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } }}
          style={{
            fontWeight: 700,
            fontSize: "clamp(48px, 8vw, 132px)",
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
            margin: 0,
          }}
        >
          nosso time.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, transition: { duration: 0.6 } }}
          animate={{ opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.2 } }}
          style={{
            maxWidth: "34ch",
            fontSize: "clamp(13px, 1vw, 17px)",
            lineHeight: 1.45,
            color: "rgba(13,13,13,0.6)",
            paddingBottom: 8,
          }}
        >
          Direção, produção e pós num só time. Desde 2018.
        </motion.p>
      </div>

      {/* grid de retratos — 3×2 no desktop, 2×3 no portrait */}
      <div
        className="relative z-10 grid flex-1"
        style={{
          gridTemplateColumns: portrait ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gridAutoRows: "1fr",
          gap: portrait ? "clamp(8px, 2vw, 18px)" : "clamp(10px, 1vw, 18px)",
          minHeight: 0,
        }}
      >
        {time.map((p, i) => (
          <motion.div
            key={p.nome}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.7, ease: EASE, delay: 0.2 + (i % 3) * 0.08 + Math.floor(i / 3) * 0.06 },
            }}
            className="group relative overflow-hidden bg-[rgba(13,13,13,0.06)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.foto}
              alt={p.nome}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ filter: "grayscale(100%) contrast(1.05)", objectPosition: "center 22%" }}
            />
            {/* gradiente */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "55%",
                background:
                  "linear-gradient(to top, rgba(13,13,13,0.82) 0%, rgba(13,13,13,0) 100%)",
              }}
            />
            {/* code topo-direita */}
            <span
              className="absolute font-mono"
              style={{
                top: 12,
                right: 12,
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "rgba(239,239,239,0.7)",
              }}
            >
              {p.code}
            </span>
            {/* nome + função */}
            <div className="absolute" style={{ left: 16, right: 16, bottom: 14 }}>
              <div
                style={{
                  color: "var(--paper)",
                  fontWeight: 700,
                  fontSize: "clamp(14px, 1.2vw, 20px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                }}
              >
                {p.nome}
              </div>
              <div
                style={{
                  color: "rgba(239,239,239,0.72)",
                  fontStyle: "italic",
                  fontSize: "clamp(11px, 0.85vw, 14px)",
                  marginTop: 3,
                  lineHeight: 1.2,
                  overflowWrap: "break-word",
                }}
              >
                {p.funcao}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
