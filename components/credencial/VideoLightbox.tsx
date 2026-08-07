"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CredHero } from "./CredHero"
import { parseEmbedUrl } from "@/lib/embed"

/* ═══════════════════════════════════════════════════════════════════
 * AMPLIAR — o filme em tela cheia, no tamanho dele
 *
 * No slide o vídeo PREENCHE o quadro (cover): é assim que a peça
 * respira dentro da diagramação. Quando alguém quer ver o filme
 * inteiro, abre aqui — sem corte, sem moldura.
 *
 * Dois cuidados que fazem isso funcionar em sala:
 *   1. o teclado morre aqui dentro (captura + stopPropagation), senão
 *      Esc e as setas passariam o slide por baixo do overlay;
 *   2. o vídeo do slide pausa enquanto isto está aberto — dois
 *      players do mesmo arquivo dariam eco se o som estiver ligado.
 * ═══════════════════════════════════════════════════════════════════ */

const MONO = "var(--font-mono-jb), ui-monospace, monospace"

type Props = {
  src: string
  aberto: boolean
  onFechar: () => void
}

export function VideoLightbox({ src, aberto, onFechar }: Props) {
  // o teclado não vaza para o engine
  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === "Escape") onFechar()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [aberto, onFechar])

  // Rede de segurança: o slide que abriu o ampliado já desmonta a
  // própria mídia, mas um slide anterior ainda em transição de saída
  // pode estar tocando. Muta em vez de pausar — `play()` na volta pode
  // ser recusado pelo navegador e deixaria o filme congelado.
  useEffect(() => {
    if (!aberto) return
    const atras = Array.from(document.querySelectorAll("video")).filter(
      (v) => !v.closest("[data-cred-lightbox]"),
    )
    const antes = atras.map((v) => v.muted)
    atras.forEach((v) => {
      v.muted = true
    })
    return () => {
      atras.forEach((v, i) => {
        v.muted = antes[i]
      })
    }
  }, [aberto])

  const embed = parseEmbedUrl(src).kind !== "file"

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="cred-lightbox"
          data-cred-lightbox=""
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(6,6,6,0.94)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={(e) => {
            // clique no fundo fecha; nunca passa o slide
            e.stopPropagation()
            onFechar()
          }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
            }}
            style={
              embed
                ? // embed é sempre 16:9 — a caixa cabe na tela pelos dois lados
                  {
                    width: "min(92vw, calc(88vh * 16 / 9))",
                    aspectRatio: "16 / 9",
                  }
                : { width: "92vw", height: "88vh" }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <CredHero
              src={src}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </motion.div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFechar()
            }}
            style={{
              position: "absolute",
              top: "clamp(20px, 4vh, 44px)",
              right: "clamp(20px, 4vw, 56px)",
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--mute-2)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            fechar (esc) ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** O gatilho — mesmo tom do "ver no site". */
export function BotaoAmpliar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--paper)",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid var(--mute-3)",
        paddingBottom: 3,
        cursor: "pointer",
      }}
    >
      ampliar filme ⤢
    </button>
  )
}
