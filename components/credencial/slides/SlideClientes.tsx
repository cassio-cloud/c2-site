"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { clientes } from "@/data/credencial/clientes"
import { GradientBloom } from "../GradientBloom"
import { Asterisco } from "../Asterisco"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const
/** Lado (em % da altura da célula) de uma marca quadrada — base da área. */
const AREA = 52

/* ═══════════════════════════════════════════════════════════════════
 * CLIENTES — a carteira inteira numa tela
 *
 * Todas as marcas visíveis ao mesmo tempo, grade sem células nem
 * fios — só as marcas no preto, todas na mesma escala perceptual.
 * 5 colunas até 20 marcas, 6 acima disso; a última linha, se ficar
 * incompleta, entra centralizada (cada marca ocupa 2 trilhas de uma
 * grade dobrada, e a sobra vira recuo dos dois lados).
 * A entrada é o evento: cada logo chega do fundo (z) em onda diagonal,
 * e depois o quadro respira parado — hover acende a marca.
 *
 * Democrático como manda o brandbook: sem hierarquia, sem destaque.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideClientes() {
  const portrait = usePortrait()
  const total = clientes.length
  const cols = portrait ? 3 : total > 20 ? 6 : 5
  const sobra = total % cols
  const cheias = total - sobra
  /** Posição na grade dobrada: 2 trilhas por marca, última linha centrada. */
  const coluna = (i: number) =>
    sobra && i >= cheias ? `${cols - sobra + 1 + 2 * (i - cheias)} / span 2` : "span 2"

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ background: "var(--black)" }}
    >
      <GradientBloom x={50} y={115} size={85} intensity={0.15} />

      {/* cabeçalho */}
      <div
        className="absolute z-10 flex justify-between"
        style={{
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          top: "clamp(58px, 9vh, 90px)",
          // no retrato não cabe lado a lado: o rótulo desce para baixo do
          // título, em vez de quebrar em duas linhas colado nele
          flexDirection: portrait ? "column" : "row",
          alignItems: portrait ? "flex-start" : "flex-end",
          gap: portrait ? 10 : 0,
        }}
      >
        <motion.h2
          className="cred-display"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.9, ease: EASE },
          }}
          style={{ fontSize: "clamp(30px, 3.6vw, 60px)", color: "var(--paper)" }}
        >
          clientes.
        </motion.h2>

        <motion.div
          className="cred-mono flex items-center gap-3 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.35 } }}
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "var(--mute-3)",
            paddingBottom: 8,
          }}
        >
          <Asterisco size={10} />
          {clientes.length} marcas · sem hierarquia
        </motion.div>
      </div>

      {/* grade completa */}
      <div
        className="absolute grid"
        style={{
          top: "clamp(124px, 19vh, 180px)",
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          bottom: "clamp(48px, 7.5vh, 72px)",
          gridTemplateColumns: `repeat(${cols * 2}, 1fr)`,
          gridAutoRows: "1fr",
          columnGap: "clamp(20px, 3vw, 60px)",
          rowGap: "clamp(8px, 1.5vh, 20px)",
        }}
      >
        {clientes.map((logo, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          return (
            <motion.div
              key={logo.name}
              className="relative flex items-center justify-center"
              // a célula vira container: cqw/cqh medem ela, não a tela
              style={{ gridColumn: coluna(i), containerType: "size" }}
              initial={{ opacity: 0, scale: 0.86, y: 18 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: EASE,
                  // onda diagonal: linha + coluna definem a vez
                  delay: 0.15 + (row + col) * 0.07,
                },
              }}
            >
              {/* Mesma ÁREA para todas: largura ∝ √proporção (e altura
                  ∝ 1/√proporção). Marca comprida não some, quadrada não
                  grita. Tetos de 92% da largura e 62% da altura da célula
                  garantem respiro em volta de qualquer uma. */}
              <div
                className="relative"
                style={{
                  width: `min(92cqw, ${(AREA * Math.sqrt(logo.ratio) * (logo.ajuste ?? 1)).toFixed(1)}cqh)`,
                  maxHeight: "62cqh",
                  aspectRatio: String(logo.ratio),
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="18vw"
                  className="object-contain opacity-60 transition-opacity duration-500 hover:opacity-100"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
