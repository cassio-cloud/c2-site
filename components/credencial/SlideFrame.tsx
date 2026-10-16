import Image from "next/image"

/* ═══════════════════════════════════════════════════════════════════
 * MOLDURA — só os cantos
 *
 *   C2. ┐                    ┌
 *
 *   RS • SP ┘          └ 08 / 19
 *
 * A marca, a assinatura da casa e o contador, cada um num canto, com o
 * mesmo recuo curto — e nada atravessando a tela. Sem fios de ponta a
 * ponta, sem nome de seção: a área útil é do conteúdo.
 *
 * Os cantos são brancos com `mix-blend-mode: difference`: viram preto
 * sobre o branco e branco sobre o preto sozinhos — legíveis em slide
 * claro, escuro ou em cima de foto, sem depender do tema.
 * ═══════════════════════════════════════════════════════════════════ */

type Props = {
  idx: number
  total: number
  theme?: "dark" | "light"
}

/** Recuo dos cantos — mais perto da borda que a margem do conteúdo. */
const CANTO = "clamp(14px, 1.6vw, 30px)"

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono-jb), ui-monospace, monospace",
  fontSize: 10,
  letterSpacing: "0.22em",
  color: "rgba(255,255,255,0.55)",
  whiteSpace: "nowrap",
  mixBlendMode: "difference",
}

export function SlideFrame({ idx, total }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <>
      <div
        className="pointer-events-none fixed z-50"
        style={{ top: CANTO, left: CANTO, mixBlendMode: "difference" }}
      >
        <Image
          src="/media/credencial/brand/c2-wordmark-paper.svg"
          alt="C2."
          width={182}
          height={104}
          priority
          style={{ height: 17, width: "auto", display: "block" }}
        />
      </div>

      <span className="pointer-events-none fixed z-50" style={{ ...MONO, bottom: CANTO, left: CANTO }}>
        RS • SP
      </span>

      <span
        className="pointer-events-none fixed z-50"
        style={{ ...MONO, bottom: CANTO, right: CANTO, fontVariantNumeric: "tabular-nums" }}
      >
        {pad(idx + 1)} / {pad(total)}
      </span>
    </>
  )
}
