type Props = {
  idx: number
  total: number
  theme?: "dark" | "light"
}

/**
 * Moldura gráfica fixa em todos os slides:
 *   header: C2.   ·   where content   ·   2026     (linha 1px embaixo)
 *   footer: RS • SP  ·  meets craft  ·  2026 / NN  (linha 1px em cima)
 *
 * Sem réguas verticais — só duas hairlines horizontais (top e bottom),
 * como no PDF de referência.
 */
export function SlideFrame({ idx, total, theme = "dark" }: Props) {
  const isDark = theme === "dark"
  const ink = isDark ? "var(--paper)" : "var(--ink)"
  const line = isDark ? "rgba(239,239,239,0.18)" : "rgba(13,13,13,0.18)"
  const mute = isDark ? "rgba(239,239,239,0.55)" : "rgba(13,13,13,0.55)"
  const pad = (n: number) => String(n).padStart(2, "0")

  const barInline = "clamp(20px, 2.4vw, 44px)"
  const barTop = "clamp(16px, 2vh, 28px)"
  const barBottom = "clamp(16px, 2vh, 28px)"
  const monoCSS: React.CSSProperties = {
    fontFamily: "var(--font-mono-jb), ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "lowercase",
    color: mute,
  }

  return (
    <>
      {/* HEADER */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{ top: barTop, paddingInline: barInline }}
      >
        <div className="flex items-center justify-between">
          <span
            style={{
              color: ink,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.02em",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            C2.
          </span>
          <span style={monoCSS}>where content</span>
          <span style={monoCSS}>2026</span>
        </div>
        <div
          style={{ marginTop: 10, height: 1, background: line, width: "100%" }}
        />
      </div>

      {/* FOOTER */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{ bottom: barBottom, paddingInline: barInline }}
      >
        <div
          style={{ marginBottom: 10, height: 1, background: line, width: "100%" }}
        />
        <div className="flex items-center justify-between">
          <span style={monoCSS}>RS • SP</span>
          <span style={monoCSS}>meets craft</span>
          <span style={monoCSS}>
            {pad(idx + 1)} / {pad(total)}
          </span>
        </div>
      </div>
    </>
  )
}
