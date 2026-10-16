"use client"

import { useState } from "react"
import { motion } from "motion/react"
import type { Diretor, Filme } from "@/data/credencial/diretores"
import { CredHero } from "../CredHero"
import { VideoLightbox, BotaoAmpliar } from "../VideoLightbox"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * FILME DO DIRETOR — um por slide, em tela cheia
 *
 * O filme ocupa o quadro inteiro; filmes em scope (2.39, 2.76…) chegam
 * com a tarja do próprio player, que se perde no preto do deck. A ficha
 * fica no pé: quem dirigiu, a marca, a posição na sequência. Para ver
 * com controles e som, "ampliar" — e o player daqui sai do DOM, senão
 * tocariam dois.
 * ═══════════════════════════════════════════════════════════════════ */

export function SlideDiretorFilme({ d, f, i }: { d: Diretor; f: Filme; i: number }) {
  const portrait = usePortrait()
  const [ampliado, setAmpliado] = useState(false)

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "var(--black)" }}>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, ease: EASE } }}
      >
        {!ampliado && <CredHero src={f.video} className="absolute inset-0 h-full w-full object-cover" />}
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "42%",
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <motion.div
        className="absolute z-10"
        style={{
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          bottom: "clamp(60px, 9vh, 110px)",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.35 } }}
      >
        <div className="cred-mono uppercase" style={{ fontSize: 10, color: "var(--mute-2)" }}>
          (→) {d.nome.toLowerCase()} · filme {i + 1}/{d.filmes.length}
        </div>
        <div
          className="cred-display"
          style={{
            fontSize: portrait ? "clamp(28px, 8vw, 44px)" : "clamp(30px, 3.6vw, 60px)",
            color: "var(--paper)",
            marginTop: 10,
          }}
        >
          {f.marca.toLowerCase()}.
          {f.titulo && (
            <>
              {" "}
              <span style={{ color: "var(--mute-2)", whiteSpace: "nowrap" }}>{f.titulo.toLowerCase()}</span>
            </>
          )}
        </div>
        <span style={{ display: "inline-block", marginTop: 14 }}>
          <BotaoAmpliar onClick={() => setAmpliado(true)} />
        </span>
      </motion.div>

      <VideoLightbox src={f.video} aberto={ampliado} onFechar={() => setAmpliado(false)} />
    </div>
  )
}
