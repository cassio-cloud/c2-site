"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Asterisco } from "../Asterisco"
import { usePortrait } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const

/* ═══════════════════════════════════════════════════════════════════
 * ESTRUTURA — canvas vivo, hierarquia nos estúdios
 *
 * A moldura da apresentação já desenha topo e pé — o canvas daqui
 * é enxuto de propósito: TRÊS horizontais e UMA vertical central,
 * full-bleed, com as cruzes de registro só onde os fios realmente
 * se cruzam. Pulsos de luz correm os fios depois de montado.
 *
 * O palco é dos estúdios: a faixa de cima (a maior) é 311 + 909.
 * Os números viram uma linha compacta embaixo — 08+ anos de craft
 * e rs — sp, presentes, sem gritar. Tudo centrado na vertical.
 * ═══════════════════════════════════════════════════════════════════ */

const MONO = "var(--font-mono-jb), ui-monospace, monospace"
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const FIO = "rgba(13,13,13,0.16)"
const FIO_LUZ = "rgba(13,13,13,0.72)"
const TINTA = "#151515"

type Studio = {
  nome: string
  cidade: string
  uf: string
  area: string
  coord: string
  descricao: string
  foto?: string
}

const STUDIOS: Studio[] = [
  {
    nome: "311",
    cidade: "Novo Hamburgo",
    uf: "RS",
    area: "300 m²",
    coord: "29°41′S 51°07′W",
    descricao: "Estúdio próprio: campanha, conteúdo de marca e foto de produto.",
    foto: "/media/credencial/estudio/311.jpg",
  },
  {
    nome: "909",
    cidade: "São Paulo",
    uf: "SP",
    area: "Em breve",
    coord: "23°33′S 46°38′W",
    descricao: "Criação, reunião e produção de conteúdo no centro de SP.",
  },
]

/* ── um fio full-bleed que se desenha ── */
function Fio({
  delay,
  horizontal,
  origem,
  pulso,
  pulsoDelay = 0,
  style,
}: {
  delay: number
  horizontal: boolean
  origem: "inicio" | "fim"
  pulso?: boolean
  pulsoDelay?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute overflow-visible"
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      animate={{
        scaleX: 1,
        scaleY: 1,
        transition: { duration: 0.85, ease: EASE, delay },
      }}
      style={{
        background: FIO,
        transformOrigin: horizontal
          ? origem === "inicio"
            ? "left center"
            : "right center"
          : origem === "inicio"
            ? "center top"
            : "center bottom",
        ...(horizontal ? { height: 1 } : { width: 1 }),
        ...style,
      }}
    >
      {pulso && (
        <span
          className={horizontal ? "cred-pulso-h" : "cred-pulso-v"}
          style={{ animationDelay: `${pulsoDelay}s` }}
        />
      )}
    </motion.div>
  )
}

/* ── o `+` de registro numa intersecção ── */
function Cruz({ x, y, delay }: { x: string; y: string; delay: number }) {
  const braco = {
    position: "absolute" as const,
    background: "rgba(13,13,13,0.5)",
  }
  return (
    <motion.span
      aria-hidden
      className="absolute"
      initial={{ opacity: 0, scale: 0.2, rotate: -90 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.55, ease: EASE, delay },
      }}
      style={{
        left: x,
        top: y,
        width: 11,
        height: 11,
        translate: "-50% -50%",
        zIndex: 2,
        boxShadow: "0 0 0 3px #f5f5f5",
        background: "#f5f5f5",
      }}
    >
      <span style={{ ...braco, left: 0, right: 0, top: 5, height: 1 }} />
      <span style={{ ...braco, top: 0, bottom: 0, left: 5, width: 1 }} />
    </motion.span>
  )
}

/* ── máscara de subida com folga pros glifos ── */
function Sobe({
  children,
  delay,
  duration = 0.8,
}: {
  children: React.ReactNode
  delay: number
  duration?: number
}) {
  return (
    <span style={{ overflow: "hidden", display: "block", paddingRight: "0.07em" }}>
      <motion.span
        initial={{ y: "112%" }}
        animate={{ y: 0, transition: { duration, ease: EASE, delay } }}
        style={{ display: "block", lineHeight: 1.16 }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/* ── célula de estúdio ── */
function Celula({
  s,
  delay,
  portrait,
}: {
  s: Studio
  delay: number
  portrait: boolean
}) {
  const [on, setOn] = useState(false)

  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col"
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        padding: portrait
          ? "clamp(8px, 1.6vh, 14px) clamp(12px, 3vw, 22px)"
          : "clamp(14px, 2vh, 26px) clamp(18px, 2.2vw, 40px)",
      }}
    >
      {/* quadro — o palco da célula */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{ background: "rgba(13,13,13,0.045)" }}
      >
        {s.foto ? (
          <motion.div
            className="absolute"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              transition: { duration: 1, ease: EASE, delay: delay + 0.15 },
            }}
            style={{ inset: 0 }}
          >
            <Image
              src={s.foto}
              alt={`Estúdio ${s.nome}`}
              fill
              sizes="46vw"
              className="object-cover"
              style={{
                filter: on ? "grayscale(0)" : "grayscale(1)",
                transform: on ? "scale(1.04)" : "scale(1)",
                transition:
                  "filter 800ms cubic-bezier(0.32,0.72,0,1), transform 1400ms cubic-bezier(0.32,0.72,0,1)",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, delay: delay + 0.3 } }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: portrait ? "clamp(56px, 15vw, 100px)" : "clamp(90px, 11vw, 190px)",
                letterSpacing: "-0.06em",
                lineHeight: 1,
                color: on ? "rgba(13,13,13,0.15)" : "rgba(13,13,13,0.07)",
                transition: "color 700ms cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              909
            </span>
            <span
              className="absolute uppercase"
              style={{
                fontFamily: MONO,
                fontSize: 9.5,
                letterSpacing: "0.26em",
                color: "rgba(13,13,13,0.45)",
                border: "1px solid rgba(13,13,13,0.2)",
                padding: "5px 10px",
                background: "rgba(245,245,245,0.72)",
              }}
            >
              em breve
            </span>
          </motion.div>
        )}

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, delay: delay + 0.55 } }}
          className="absolute"
          style={{
            left: 10,
            bottom: 8,
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.16em",
            color: s.foto ? "rgba(245,245,245,0.85)" : "rgba(13,13,13,0.4)",
            zIndex: 2,
          }}
        >
          {s.coord}
        </motion.span>
      </div>

      {/* legenda — número do estúdio grande, como pediu */}
      <div style={{ flexShrink: 0, paddingTop: portrait ? 8 : 14 }}>
        <Sobe delay={delay + 0.35} duration={0.75}>
          <span className="flex items-baseline" style={{ gap: 12, whiteSpace: "nowrap" }}>
            <span
              className="lowercase"
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: portrait ? "clamp(26px, 7.5vw, 44px)" : "clamp(32px, 3.4vw, 60px)",
                letterSpacing: "-0.045em",
                color: TINTA,
              }}
            >
              {s.nome}.
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: portrait ? 9 : 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(13,13,13,0.55)",
              }}
            >
              {s.cidade} · {s.uf}
              <span style={{ color: "rgba(13,13,13,0.38)" }}>
                {"  ·  "}
                {s.area}
              </span>
            </span>
          </span>
        </Sobe>
      </div>
    </div>
  )
}

export function SlideEstrutura() {
  const portrait = usePortrait()

  /* ── a malha, centrada na vertical ──
   * Bloco de 15vh a 85vh (centro em 50vh). Estúdios levam a faixa
   * grande; os números, a estreita. Só 4 fios — as barras da
   * apresentação já fazem o resto da moldura. */
  // Y1 abre espaço pro título — mesmo campo do grid de clientes
  const Y1 = portrait ? "clamp(110px, 16vh, 150px)" : "clamp(124px, 19vh, 180px)"
  const Y2 = portrait ? "67vh" : "64vh"
  const Y3 = portrait ? "88vh" : "87vh"
  const YMEIO = "41vh" // só retrato: divisa 311/909
  const X2 = "50%"

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper text-ink">
      {/* cabeçalho — mesmo padrão do slide de clientes */}
      <div
        className="absolute z-10 flex items-end justify-between"
        style={{
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          top: "clamp(58px, 9vh, 90px)",
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
          style={{ fontSize: "clamp(30px, 3.6vw, 60px)", color: TINTA }}
        >
          estrutura.
        </motion.h2>

        <motion.div
          className="flex items-center gap-3 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.35 } }}
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "rgba(13,13,13,0.45)",
            paddingBottom: 8,
          }}
        >
          <Asterisco size={10} />
          estúdios próprios
        </motion.div>
      </div>
      {/* ── o canvas: 3 horizontais + 1 vertical, full-bleed ── */}
      <Fio delay={0.1} horizontal origem="inicio" style={{ top: Y1, left: 0, right: 0 }} />
      <Fio
        delay={0.28}
        horizontal
        origem="fim"
        pulso
        pulsoDelay={5.2}
        style={{ top: Y2, left: 0, right: 0 }}
      />
      <Fio delay={0.46} horizontal origem="inicio" style={{ top: Y3, left: 0, right: 0 }} />
      <Fio
        delay={0.66}
        horizontal={false}
        origem="inicio"
        pulso
        pulsoDelay={3.2}
        style={{
          left: X2,
          // no retrato os estúdios empilham — a vertical só corta a
          // faixa dos números, senão passaria por cima das fotos
          top: portrait ? Y2 : 0,
          bottom: 0,
        }}
      />
      {portrait && (
        <Fio delay={0.5} horizontal origem="fim" style={{ top: YMEIO, left: 0, right: 0 }} />
      )}

      {/* ── cruzes só onde os fios se cruzam de verdade ── */}
      {(portrait ? [Y2, Y3] : [Y1, Y2, Y3]).map((y, j) => (
        <Cruz key={y} x={X2} y={y} delay={1.05 + j * 0.12} />
      ))}

      {/* ── faixa grande: os estúdios ── */}
      <div
        className="absolute flex"
        style={{
          top: Y1,
          bottom: `calc(100% - ${Y2})`,
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
          flexDirection: portrait ? "column" : "row",
          gap: portrait ? 0 : "clamp(8px, 1vw, 20px)",
        }}
      >
        {STUDIOS.map((s, i) => (
          <Celula key={s.nome} s={s} delay={0.9 + i * 0.18} portrait={portrait} />
        ))}
      </div>

      {/* ── faixa estreita: os números, compactos ── */}
      <div
        className="absolute flex items-center"
        style={{
          top: Y2,
          bottom: `calc(100% - ${Y3})`,
          left: "var(--cred-margin)",
          right: "var(--cred-margin)",
        }}
      >
        {/* 08+ anos de craft */}
        <div
          className="flex min-w-0 flex-1 items-baseline"
          style={{
            gap: portrait ? 8 : 16,
            paddingInline: portrait ? "clamp(8px, 2vw, 16px)" : "clamp(16px, 2vw, 40px)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: portrait ? "clamp(28px, 8vw, 44px)" : "clamp(36px, 3.8vw, 68px)",
              letterSpacing: "-0.05em",
              color: TINTA,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {/* mesma máscara do rs — sp: baseline nativa, sem caixa
                de odômetro desalinhando o número do rótulo */}
            <Sobe delay={1.3}>
              08<span style={{ color: "rgba(13,13,13,0.3)" }}>+</span>
            </Sobe>
          </span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 2.0 } }}
            className="lowercase"
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: portrait ? 11 : "clamp(12px, 1vw, 16px)",
              color: "rgba(13,13,13,0.85)",
            }}
          >
            anos de craft{" "}
            <span
              style={{
                fontFamily: MONO,
                fontWeight: 400,
                fontSize: portrait ? 8.5 : 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(13,13,13,0.42)",
              }}
            >
              · desde 2018
            </span>
          </motion.span>
        </div>

        {/* rs — sp */}
        <div
          className="flex min-w-0 flex-1 items-baseline"
          style={{
            gap: portrait ? 8 : 16,
            paddingInline: portrait ? "clamp(8px, 2vw, 16px)" : "clamp(16px, 2vw, 40px)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="flex items-center"
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: portrait ? "clamp(24px, 7vw, 40px)" : "clamp(32px, 3.4vw, 62px)",
              letterSpacing: "-0.05em",
              lineHeight: 1.16,
              color: TINTA,
              gap: portrait ? 6 : 12,
            }}
          >
            <Sobe delay={1.5}>rs</Sobe>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 1.8 } }}
              style={{
                display: "block",
                width: "0.55em",
                height: portrait ? 3 : 4,
                background: "rgba(13,13,13,0.3)",
                transformOrigin: "left center",
              }}
            />
            <Sobe delay={2.0}>sp</Sobe>
          </span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 2.6 } }}
            className="lowercase"
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: portrait ? 11 : "clamp(12px, 1vw, 16px)",
              color: "rgba(13,13,13,0.85)",
            }}
          >
            dois estados{" "}
            <span
              style={{
                fontFamily: MONO,
                fontWeight: 400,
                fontSize: portrait ? 8.5 : 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(13,13,13,0.42)",
              }}
            >
              · nh · sp
            </span>
          </motion.span>
        </div>
      </div>
    </div>
  )
}
