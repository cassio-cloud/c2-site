"use client"

import { motion } from "motion/react"
import type { Diretor } from "@/data/credencial/diretores"
import { usePortrait } from "../Editorial"
import { RetratoDiretor } from "./SlideDiretores"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * DIRETOR — o perfil, no branco
 *
 * Metade da tela é o retrato, de cima a baixo (o fundo branco da foto
 * se funde com a página). Na outra metade, só o essencial: o nome
 * grande, a frase, uma bio curta, prêmios e marcas numa linha cada.
 * Sem dados, entra como placeholder ("perfil em breve").
 * ═══════════════════════════════════════════════════════════════════ */

const TEXTO = "rgba(0,0,0,0.78)"
const ROTULO = "rgba(0,0,0,0.42)"

function Linha({ rotulo, itens, delay }: { rotulo: string; itens: string[]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } }}
      style={{ fontSize: "clamp(12px, min(1vw, 2vh), 16px)", lineHeight: 1.5, color: TEXTO }}
    >
      <span className="cred-mono uppercase" style={{ fontSize: 9.5, color: ROTULO, marginRight: 12 }}>
        {rotulo}
      </span>
      {itens.join(" · ")}
    </motion.div>
  )
}

export function SlideDiretor({ d }: { d: Diretor }) {
  const portrait = usePortrait()
  const vazio = !d.bio && !d.foto && d.filmes.length === 0

  return (
    <div
      className="relative grid h-full w-full overflow-hidden"
      style={{
        background: "var(--paper)",
        ...(portrait ? { gridTemplateRows: "48% 52%" } : { gridTemplateColumns: "50% 50%" }),
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 1, ease: EASE } }}
      >
        <RetratoDiretor d={d} posicao={portrait ? "50% 36%" : "50% 40%"} emBreve={!d.foto} />
      </motion.div>

      <div
        className="relative flex min-h-0 flex-col justify-center"
        style={{
          paddingLeft: portrait ? "var(--cred-margin)" : "clamp(32px, 5vw, 110px)",
          paddingRight: "var(--cred-margin)",
          paddingTop: portrait ? 18 : "clamp(40px, 8vh, 72px)",
          paddingBottom: portrait ? "clamp(44px, 7vh, 64px)" : "clamp(40px, 8vh, 72px)",
        }}
      >
        <motion.h2
          className="cred-display"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.1 } }}
          style={{
            fontSize: portrait ? "clamp(34px, 10vw, 56px)" : "clamp(36px, min(6vw, 11vh), 112px)",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {d.nome.toLowerCase()}.
        </motion.h2>
        {d.sub && (
          <div style={{ color: ROTULO, fontSize: "clamp(15px, 1.4vw, 22px)", marginTop: 10 }}>{d.sub}</div>
        )}

        {vazio ? (
          <p className="cred-mono uppercase" style={{ fontSize: 10, color: ROTULO, marginTop: 24 }}>
            perfil em breve
          </p>
        ) : (
          <>
            {d.frase && (
              <motion.div
                className="cred-mono uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.3 } }}
                style={{ fontSize: 10, color: ROTULO, marginTop: portrait ? 12 : "clamp(10px, 2.6vh, 22px)", lineHeight: 1.7 }}
              >
                {d.frase}
              </motion.div>
            )}

            {d.bio && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.35 } }}
                style={{
                  color: TEXTO,
                  fontSize: portrait ? 13 : "clamp(12px, min(1.2vw, 2.3vh), 19px)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.01em",
                  maxWidth: "50ch",
                  margin: portrait ? "14px 0 0" : "clamp(12px, 3.6vh, 30px) 0 0",
                }}
              >
                {d.bio}
              </motion.p>
            )}

            <div style={{ display: "grid", gap: 6, marginTop: portrait ? 14 : "clamp(12px, 3.6vh, 32px)" }}>
              {d.premios?.length ? <Linha rotulo="prêmios" itens={d.premios} delay={0.45} /> : null}
              {d.marcas?.length ? <Linha rotulo="marcas" itens={d.marcas} delay={0.52} /> : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
