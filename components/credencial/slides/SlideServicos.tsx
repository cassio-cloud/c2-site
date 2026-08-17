"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { EASE, usePortrait } from "../Editorial"
import { servicos, type Servico } from "@/data/credencial/servicos"

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "var(--font-mono-jb), ui-monospace, monospace"

/* ═══════════════════════════════════════════════════════════════════
 * O QUE FAZEMOS — as três linhas
 *
 * A linha é a unidade de leitura: fio, índice, título. Elas entram
 * uma a uma, de cima para baixo, e a que está acesa abre — a
 * descrição desce e a imagem acende na lateral.
 *
 * Sem hover (projetor, tablet) o slide gira sozinho até alguém
 * encostar o mouse; a partir daí quem manda é a mão.
 * ═══════════════════════════════════════════════════════════════════ */

/** Altura da caixa no horizontal: a imagem e a coluna de texto dividem
 *  exatamente esta medida — é o que trava a geometria do slide. */
const CAIXA = "clamp(400px, 62vh, 560px)"

/** Ritmo do repertório: de quanto em quanto tempo a caixa troca de
 *  quadro DENTRO da mesma categoria. */
const QUADRO_MS = 1900

/* ── o (+) na ponta da linha — gira quando a linha abre ── */
function Sinal() {
  const barra = {
    position: "absolute" as const,
    background: "var(--mute-1)",
    borderRadius: 1,
  }
  return (
    <span
      className="cred-row-sinal relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: 22, height: 22, border: "1px solid var(--line-10)" }}
      aria-hidden
    >
      <span style={{ ...barra, width: 8, height: 1 }} />
      <span style={{ ...barra, width: 1, height: 8 }} />
    </span>
  )
}

/* ── uma linha ── */
function Linha({
  s,
  i,
  on,
  portrait,
  onEnter,
}: {
  s: Servico
  i: number
  on: boolean
  portrait: boolean
  onEnter: () => void
}) {
  const d = 0.22 + i * 0.17
  const recuo = portrait ? 30 : 44
  const vao = portrait ? 14 : "clamp(16px, 2.4vw, 44px)"

  return (
    <div
      className="cred-row"
      data-on={on ? "1" : "0"}
      onMouseEnter={onEnter}
      style={{
        // respiro igual em cima e embaixo: o texto nunca encosta no fio
        paddingTop: portrait ? 15 : "clamp(15px, 2vh, 28px)",
        paddingBottom: portrait ? 10 : "clamp(15px, 2vh, 28px)",
        /* No horizontal a coluna casa com a altura da imagem — mas em
         * terços iguais a linha aberta não tinha onde caber e a
         * descrição ia parar em cima do fio de baixo. Agora a acesa
         * puxa mais banda e as fechadas cedem; a soma continua fixa,
         * então a coluna e a imagem seguem fechando juntas. */
        flex: portrait ? undefined : on ? "1.6 1 0" : "1 1 0",
        transition: "flex-grow 620ms cubic-bezier(0.32,0.72,0,1)",
        minHeight: 0,
      }}
    >
      {/* o fio — desenhado da esquerda, uma linha por vez */}
      <motion.div
        className="absolute left-0 right-0 top-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: d } }}
        style={{ height: 1, background: "var(--line-22)", transformOrigin: "left center" }}
      />
      {/* a varredura de luz que corre o fio quando a linha acende */}
      <div className="cred-row-luz" />

      {/* índice · título · sinal */}
      <div className="flex items-baseline" style={{ gap: vao }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, delay: d + 0.34 } }}
          style={{
            fontFamily: MONO,
            fontSize: portrait ? 10 : 11,
            letterSpacing: "0.2em",
            color: on ? "var(--mute-1)" : "var(--mute-3)",
            transition: "color 480ms cubic-bezier(0.32,0.72,0,1)",
            width: recuo,
            flexShrink: 0,
          }}
        >
          {s.index}
        </motion.span>

        {/* título — sobe mascarado na entrada, rola no hover */}
        <div className="min-w-0 flex-1" style={{ overflow: "hidden" }}>
          <motion.div
            initial={{ y: "112%" }}
            animate={{ y: 0, transition: { duration: 0.85, ease: EASE, delay: d + 0.16 } }}
            style={{ willChange: "transform" }}
          >
            <span
              className="cred-roll lowercase"
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: portrait ? "clamp(30px, 8.4vw, 52px)" : "clamp(28px, 3.6vw, 58px)",
                lineHeight: 1.06,
                letterSpacing: "-0.045em",
              }}
            >
              <span className="cred-roll-a" style={{ color: "var(--mute-2)" }}>
                {s.titulo}
              </span>
              <span className="cred-roll-b" style={{ color: "var(--paper)" }}>
                {s.titulo}
              </span>
            </span>
          </motion.div>
        </div>

        <motion.span
          className="shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, delay: d + 0.4 } }}
        >
          <Sinal />
        </motion.span>
      </div>

      {/* a linha aberta: tag + descrição descem */}
      <motion.div
        initial={false}
        animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.62, ease: EASE }}
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            paddingTop: 12,
            paddingLeft: portrait ? recuo + 14 : `calc(${recuo}px + ${vao})`,
          }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--mute-3)",
              margin: 0,
              marginBottom: 8,
            }}
          >
            {s.tag}
          </p>
          <p
            style={{
              fontFamily: MONO,
              fontSize: portrait ? 11 : "clamp(10.5px, 0.78vw, 12.5px)",
              lineHeight: 1.62,
              color: "var(--mute-2)",
              margin: 0,
              maxWidth: "44ch",
            }}
          >
            {s.desc}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ── a caixa lateral ──
 * Duas trocas diferentes, de propósito:
 *   entre categorias  → varredura de clip, vindo de lados alternados
 *   dentro da categoria → dissolve
 * Assim dá para sentir a diferença entre "mudei de serviço" e
 * "estou vendo mais trabalho do mesmo serviço".
 */
function Lateral({
  ativo,
  quadro,
  portrait,
}: {
  ativo: number
  quadro: number
  portrait: boolean
}) {
  return (
    <div
      className="relative h-full overflow-hidden"
      style={{
        border: "1px solid var(--line-10)",
        background: "var(--ink)",
        aspectRatio: portrait ? "16 / 9" : "4 / 5",
        width: portrait ? "100%" : "auto",
      }}
    >
      {servicos.map((s, i) => (
        <div
          key={s.index}
          className="absolute inset-0"
          style={{
            clipPath:
              i === ativo
                ? "inset(0 0 0 0)"
                : i % 2 === 0
                  ? "inset(0 0 100% 0)"
                  : "inset(100% 0 0 0)",
            transition: "clip-path 900ms cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          {s.fotos.map((foto, q) => (
            <motion.div
              key={foto}
              className="absolute"
              /* deriva perpétua — a imagem nunca congela */
              initial={{ x: "-1.4%", y: "-1%", scale: 1.07 }}
              animate={{
                x: "1.4%",
                y: "1%",
                scale: 1.07,
                transition: { duration: 16, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
              }}
              style={{
                inset: "-4%",
                backgroundImage: `url(${foto})`,
                backgroundSize: "cover",
                backgroundPosition: "center 32%",
                willChange: "transform",
                opacity: i === ativo && q === quadro % s.fotos.length ? 1 : 0,
                transition: "opacity 900ms cubic-bezier(0.32,0.72,0,1)",
              }}
            />
          ))}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.06) 48%, rgba(10,10,10,0) 100%)",
            }}
          />
        </div>
      ))}

      {/* legenda: categoria + em que quadro do repertório estamos */}
      <span
        className="absolute"
        style={{
          left: 12,
          bottom: 10,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(245,245,245,0.62)",
        }}
      >
        {servicos[ativo].index} / 03
        <span style={{ color: "rgba(245,245,245,0.34)" }}>
          {"  ·  "}
          {String((quadro % servicos[ativo].fotos.length) + 1).padStart(2, "0")}
          {"/"}
          {String(servicos[ativo].fotos.length).padStart(2, "0")}
        </span>
      </span>
    </div>
  )
}

export function SlideServicos() {
  const portrait = usePortrait()
  const [ativo, setAtivo] = useState(0)
  const [quadro, setQuadro] = useState(0)
  // enquanto ninguém encosta o mouse, o slide gira sozinho
  const tocado = useRef(false)

  // o repertório da categoria acesa: enquanto o mouse fica na linha,
  // a caixa vai trocando de quadro
  useEffect(() => {
    setQuadro(0)
    const t = setInterval(() => setQuadro((q) => q + 1), QUADRO_MS)
    return () => clearInterval(t)
  }, [ativo])

  // sem mouse (projetor, tablet) as categorias giram sozinhas — tempo
  // suficiente para dois quadros de cada uma
  useEffect(() => {
    const t = setInterval(() => {
      if (tocado.current) return
      setAtivo((i) => (i + 1) % servicos.length)
    }, QUADRO_MS * 2)
    return () => clearInterval(t)
  }, [])

  const entrar = (i: number) => {
    tocado.current = true
    setAtivo(i)
  }

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "var(--black)" }}>
      {/* palavra fantasma sangrando pela esquerda — a marca d'água da seção */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 1.6, ease: EASE, delay: 0.1 } }}
        className="pointer-events-none absolute select-none lowercase"
        style={{
          left: "-6vw",
          top: "50%",
          translate: "0 -50%",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: "clamp(180px, 26vw, 460px)",
          lineHeight: 0.8,
          letterSpacing: "-0.06em",
          color: "rgba(245,245,245,0.035)",
          whiteSpace: "nowrap",
        }}
      >
        serviços
      </motion.span>

      {/* Sem eyebrow: a moldura já nomeia a seção no topo. Aqui o
          silêncio é o assunto — só o fantasma, as linhas e a imagem. */}

      {/* corpo: linhas à esquerda, imagem à direita */}
      <div
        className="absolute inset-0 z-10 flex items-center"
        style={{ paddingInline: "var(--cred-margin)" }}
      >
        <div
          className="flex w-full"
          style={{
            marginTop: portrait ? "clamp(48px, 8vh, 88px)" : "clamp(24px, 4vh, 56px)",
            gap: portrait ? "clamp(18px, 3vh, 32px)" : "clamp(32px, 5vw, 88px)",
            flexDirection: portrait ? "column" : "row",
            alignItems: portrait ? "stretch" : "center",
          }}
        >
          {/* imagem: em cima no vertical, à direita no horizontal.
              No horizontal a altura é a da caixa — a largura sai da
              proporção 4:5, então o bloco de texto e a imagem fecham
              exatamente na mesma linha em cima e embaixo. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.5 } }}
            style={{
              order: portrait ? -1 : 1,
              flexShrink: 0,
              width: portrait ? "100%" : "auto",
              height: portrait ? undefined : CAIXA,
            }}
          >
            <Lateral ativo={ativo} quadro={quadro} portrait={portrait} />
          </motion.div>

          {/* as linhas — mesma altura da imagem, três terços iguais */}
          <div
            className="flex min-w-0 flex-1 flex-col"
            style={{ height: portrait ? undefined : CAIXA }}
          >
            {servicos.map((s, i) => (
              <Linha
                key={s.index}
                s={s}
                i={i}
                on={i === ativo}
                portrait={portrait}
                onEnter={() => entrar(i)}
              />
            ))}
            {/* fio de fechamento */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 0.8, ease: EASE, delay: 0.22 + servicos.length * 0.17 },
              }}
              style={{
                height: 1,
                background: "var(--line-10)",
                transformOrigin: "left center",
                marginTop: portrait ? 15 : "clamp(15px, 2vh, 28px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
