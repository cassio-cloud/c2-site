"use client"

import { useEffect, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

export const EASE = [0.32, 0.72, 0, 1] as const

/** True quando a viewport está em retrato (altura > largura). */
export function usePortrait() {
  const [portrait, setPortrait] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)")
    const update = () => setPortrait(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return portrait
}

/** Crop que prioriza o rosto/topo do enquadramento. */
export const FACE_POSITION = "center 28%"

type Theme = "dark" | "light"

function tone(theme: Theme) {
  const base = theme === "dark" ? "239,239,239" : "13,13,13"
  return {
    line: `rgba(${base},0.10)`,
    mark: `rgba(${base},0.28)`,
    mute: `rgba(${base},0.45)`,
    ghost: `rgba(${base},0.05)`,
  }
}

/**
 * Linhas verticais hairline — grid editorial (estilo Visual Board).
 * `cols` define quantas divisões; desenha as linhas internas.
 */
export function GridLines({
  theme = "dark",
  cols = 4,
  inset = "clamp(20px, 2.4vw, 44px)",
}: {
  theme?: Theme
  cols?: number
  inset?: string
}) {
  const { line } = tone(theme)
  const verticals = Array.from({ length: cols - 1 }, (_, i) => (i + 1) / cols)
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {verticals.map((f) => (
        <div
          key={f}
          className="absolute"
          style={{
            left: `calc(${inset} + (100% - 2 * ${inset}) * ${f})`,
            top: inset,
            bottom: inset,
            width: 1,
            background: line,
          }}
        />
      ))}
    </div>
  )
}

/** Marcas de canto (crop ticks) — L-shape fino nos 4 cantos do frame. */
export function CropMarks({
  theme = "dark",
  inset = "clamp(20px, 2.4vw, 44px)",
  size = 14,
}: {
  theme?: Theme
  inset?: string
  size?: number
}) {
  const { mark } = tone(theme)
  const h: CSSProperties = { position: "absolute", background: mark }
  const corners = [
    { top: inset, left: inset, dx: 1, dy: 1 },
    { top: inset, right: inset, dx: -1, dy: 1 },
    { bottom: inset, left: inset, dx: 1, dy: -1 },
    { bottom: inset, right: inset, dx: -1, dy: -1 },
  ] as const
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {corners.map((c, i) => {
        const pos: CSSProperties = {}
        if ("top" in c && c.top) pos.top = c.top
        if ("bottom" in c && c.bottom) pos.bottom = c.bottom
        if ("left" in c && c.left) pos.left = c.left
        if ("right" in c && c.right) pos.right = c.right
        return (
          <div key={i} style={pos}>
            {/* horizontal arm */}
            <div style={{ ...h, width: size, height: 1, ...(c.dx < 0 ? { right: 0 } : { left: 0 }) }} />
            {/* vertical arm */}
            <div style={{ ...h, width: 1, height: size, ...(c.dy < 0 ? { bottom: 0 } : { top: 0 }) }} />
          </div>
        )
      })}
    </div>
  )
}

/** Label mono micro — uppercase, tracking largo. */
export function IndexLabel({
  children,
  theme = "dark",
  strong = false,
  style,
}: {
  children: ReactNode
  theme?: Theme
  strong?: boolean
  style?: CSSProperties
}) {
  const { mark, mute } = tone(theme)
  return (
    <span
      style={{
        fontFamily: "var(--font-mono-jb), ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: strong ? mark : mute,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function ghostColor(theme: Theme) {
  return tone(theme).ghost
}
