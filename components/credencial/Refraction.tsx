"use client"

import { motion } from "motion/react"
import { useId } from "react"

/* ═══════════════════════════════════════════════════════════════════
 * REFRAÇÃO CROMÁTICA
 *
 * Território 04 do Brandbook v2.0 — "textura generativa: dispersão,
 * iridescência, refração" — executado em filtro SVG.
 *
 * A técnica (mesma do creativeglu.ai): o mapa de deslocamento é
 * aplicado TRÊS vezes sobre o mesmo SourceGraphic, com escalas
 * ligeiramente diferentes. Cada passagem é reduzida a um canal por
 * `feColorMatrix` e as três voltam a se somar em `screen`. Como cada
 * canal se deslocou uma distância diferente, as bordas se separam em
 * espectro — é a dispersão de um prisma, não um degradê pintado.
 *
 * É daí que vem a cor do deck. Por isso o sistema segue monocromático:
 * a iridescência nasce da luz atravessando o vidro, nunca de um bloco
 * de cor chapada (Brandbook v2.0 §07).
 *
 * Diferença para o glu: lá o mapa vem de um `feImage` externo; aqui é
 * `feTurbulence` procedural — sem asset, e animável pela frequência.
 * ═══════════════════════════════════════════════════════════════════ */

const MotionDisp = motion.feDisplacementMap
const MotionTurb = motion.feTurbulence

type DefsProps = {
  /** Deslocamento do canal vermelho, em px. Os outros derivam dele. */
  scale?: number
  /** Frequência do ruído: baixo = ondas largas, alto = vidro picotado. */
  frequency?: number
  /** Octaves do fractal — 1 é mais líquido, 3 mais cristalino. */
  octaves?: number
  seed?: number
  animated?: boolean
}

/**
 * Monta o `<filter>`. Devolve o id para aplicar via `filter: url(#id)`.
 * Use o hook `useRefractionFilter` para pegar id + elemento juntos.
 */
export function RefractionDefs({
  id,
  scale = 18,
  frequency = 0.008,
  octaves = 2,
  seed = 7,
  animated = false,
}: DefsProps & { id: string }) {
  // Dispersão: o vermelho desloca mais, o azul menos. A diferença entre
  // os três é o que abre o espectro nas bordas.
  const sR = scale
  const sG = scale * 0.72
  const sB = scale * 0.44

  return (
    <svg
      aria-hidden
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter
          id={id}
          colorInterpolationFilters="sRGB"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          {animated ? (
            <MotionTurb
              type="fractalNoise"
              numOctaves={octaves}
              seed={seed}
              stitchTiles="stitch"
              result="map"
              initial={{ baseFrequency: frequency }}
              animate={{ baseFrequency: [frequency, frequency * 1.9, frequency] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <feTurbulence
              type="fractalNoise"
              baseFrequency={frequency}
              numOctaves={octaves}
              seed={seed}
              stitchTiles="stitch"
              result="map"
            />
          )}

          {/* — canal vermelho — */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={sR}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispR"
          />
          <feColorMatrix
            in="dispR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chR"
          />

          {/* — canal verde — */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={sG}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispG"
          />
          <feColorMatrix
            in="dispG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chG"
          />

          {/* — canal azul — */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={sB}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispB"
          />
          <feColorMatrix
            in="dispB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="chB"
          />

          {/* recomposição — screen soma a luz dos três canais */}
          <feBlend in="chR" in2="chG" mode="screen" result="rg" />
          <feBlend in="rg" in2="chB" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════
 * VARREDURA — a transição-assinatura
 *
 * Uma faixa de vidro atravessa o quadro. Onde ela passa, o conteúdo
 * atrás é deslocado e disperso: o slide que sai se desfaz dentro do
 * que entra, em vez de deslizar para o lado.
 *
 * A intensidade sobe e desce ao longo do trajeto (0 → pico → 0), então
 * a distorção nasce e morre com a passagem da faixa — não aparece
 * cortada nas pontas.
 * ═══════════════════════════════════════════════════════════════════ */

export type SweepFrom = "left" | "right" | "top" | "bottom"

type SweepProps = {
  /** 1 = esquerda→direita, -1 = direita→esquerda (quando horizontal). */
  direction?: 1 | -1
  /** Lado de onde a faixa entra. Sobrepõe `direction`. */
  from?: SweepFrom
  duration?: number
  /** Pico de deslocamento em px. */
  peak?: number
  /** Largura da faixa, em % da viewport. */
  width?: number
}

export function RefractionSweep({
  direction = 1,
  from,
  duration = 0.9,
  peak = 42,
  width = 38,
}: SweepProps) {
  const uid = useId().replace(/:/g, "")
  const filterId = `cred-sweep-${uid}`

  const side: SweepFrom = from ?? (direction === 1 ? "left" : "right")
  const vertical = side === "top" || side === "bottom"

  // trajeto da faixa no eixo dela
  const start = side === "left" || side === "top" ? `-${width}%` : "100%"
  const end = side === "left" || side === "top" ? "100%" : `-${width}%`

  // o ruído acompanha o eixo: ondas alongadas na transversal
  const freq = vertical ? "0.011 0.004" : "0.004 0.011"
  const gradAngle = vertical ? "180deg" : "90deg"

  return (
    <>
      <svg
        aria-hidden
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={freq}
              numOctaves={2}
              seed={11}
              stitchTiles="stitch"
              result="map"
            />
            <MotionDisp
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
              initial={{ scale: 0 }}
              animate={{ scale: [0, peak, 0] }}
              transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="chR"
            />
            <MotionDisp
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
              initial={{ scale: 0 }}
              animate={{ scale: [0, peak * 0.72, 0] }}
              transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="chG"
            />
            <MotionDisp
              in="SourceGraphic"
              in2="map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
              initial={{ scale: 0 }}
              animate={{ scale: [0, peak * 0.44, 0] }}
              transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="chB"
            />
            <feBlend in="chR" in2="chG" mode="screen" result="rg" />
            <feBlend in="rg" in2="chB" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* a faixa de vidro — o que dá corpo visível à passagem */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute z-40 ${vertical ? "inset-x-0" : "inset-y-0"}`}
        style={{
          [vertical ? "height" : "width"]: `${width}%`,
          filter: `url(#${filterId})`,
          background: `linear-gradient(${gradAngle}, rgba(245,245,245,0) 0%, rgba(245,245,245,0.055) 35%, rgba(224,83,31,0.07) 50%, rgba(245,245,245,0.055) 65%, rgba(245,245,245,0) 100%)`,
          backdropFilter: "blur(10px) saturate(1.2)",
          WebkitBackdropFilter: "blur(10px) saturate(1.2)",
          mixBlendMode: "screen",
        }}
        initial={{ [vertical ? "top" : "left"]: start } as Record<string, string>}
        animate={{ [vertical ? "top" : "left"]: end } as Record<string, string>}
        transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
      />
    </>
  )
}
