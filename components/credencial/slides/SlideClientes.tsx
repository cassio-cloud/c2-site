"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { clientes } from "@/data/credencial/clientes"
import { Grain } from "../Grain"
import { CropMarks, IndexLabel } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const
const INSET = "clamp(40px, 6vw, 110px)"

export function SlideClientes() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-center bg-ink"
      style={{
        paddingInline: "clamp(40px, 6vw, 110px)",
        paddingTop: "clamp(120px, 17vh, 190px)",
        paddingBottom: "clamp(60px, 9vh, 110px)",
      }}
    >
      <CropMarks theme="dark" inset={INSET} />

      <div
        className="absolute z-10 flex items-center justify-between"
        style={{ left: INSET, right: INSET, top: "clamp(48px, 8vh, 120px)" }}
      >
        <IndexLabel theme="dark" strong>
          (→) parceiros
        </IndexLabel>
        <IndexLabel theme="dark">a empresa · clientes</IndexLabel>
      </div>

      <motion.h2
        className="lowercase"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
        style={{
          fontWeight: 700,
          fontSize: "clamp(48px, 8vw, 132px)",
          letterSpacing: "-0.045em",
          lineHeight: 0.96,
          marginBottom: "clamp(24px, 4vh, 48px)",
        }}
      >
        clientes.
      </motion.h2>

      <div className="grid grid-cols-5 gap-px border-t border-b border-line bg-line">
        {clientes.map((logo, i) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, ease: EASE, delay: (i % 5) * 0.05 + Math.floor(i / 5) * 0.04 },
            }}
            className="relative flex items-center justify-center bg-ink"
            style={{ aspectRatio: "5 / 3" }}
          >
            <span
              className="absolute left-3 top-3 font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "var(--mute-3)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative h-1/2 w-3/5">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="14vw"
                className={
                  "object-contain opacity-70 " + (logo.large ? "scale-[1.4]" : "")
                }
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <Grain />
    </div>
  )
}
