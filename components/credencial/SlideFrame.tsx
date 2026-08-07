import Image from "next/image"
import { Asterisco } from "./Asterisco"

/* ═══════════════════════════════════════════════════════════════════
 * MOLDURA
 *
 * Brandbook v2.0 §08:
 *   topo    — C2. contentCraft à esquerda · seção à direita
 *   rodapé  — RS • SP · ✱ · contador
 *
 * Uma linha só embaixo, sem régua — os slides ficam com a área útil
 * inteira e o rodapé volta a ser o da casa: Rio Grande do Sul e
 * São Paulo assinando o canto esquerdo.
 * ═══════════════════════════════════════════════════════════════════ */

type Props = {
  idx: number
  total: number
  theme?: "dark" | "light"
  secao?: string
}

export function SlideFrame({ idx, total, theme = "dark", secao }: Props) {
  const isDark = theme === "dark"
  const pad = (n: number) => String(n).padStart(2, "0")

  const inline = "var(--cred-margin)"
  const block = "clamp(14px, 2.2vh, 26px)"

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono-jb), ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "lowercase",
    color: "var(--mute-2)",
    whiteSpace: "nowrap",
  }

  return (
    <>
      {/* ── TOPO ── */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{ top: block, paddingInline: inline }}
      >
        <div className="flex items-center justify-between">
          <Image
            src={
              isDark
                ? "/media/credencial/brand/c2-wordmark-paper.svg"
                : "/media/credencial/brand/c2-wordmark-ink.svg"
            }
            alt="C2."
            width={182}
            height={104}
            priority
            style={{ height: 17, width: "auto", display: "block" }}
          />
          {secao && (
            <span style={{ ...mono, textTransform: "uppercase" }}>{secao}</span>
          )}
        </div>
        <div
          style={{
            marginTop: 10,
            height: 1,
            background: "var(--line-22)",
            width: "100%",
          }}
        />
      </div>

      {/* ── RODAPÉ — RS • SP · ✱ · contador ── */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{ bottom: block, paddingInline: inline }}
      >
        <div
          style={{
            marginBottom: 9,
            height: 1,
            background: "var(--line-22)",
            width: "100%",
          }}
        />
        <div className="flex items-center justify-between">
          <span style={{ ...mono, textTransform: "uppercase" }}>RS • SP</span>

          <Asterisco size={11} style={{ color: "var(--mute-3)", flexShrink: 0 }} />

          <span style={mono}>
            {pad(idx + 1)} / {pad(total)}
          </span>
        </div>
      </div>
    </>
  )
}
