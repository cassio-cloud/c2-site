"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { Asterisco } from "../Asterisco"

const EASE = [0.32, 0.72, 0, 1] as const
const MotionTurb = motion.feTurbulence

/* ═══════════════════════════════════════════════════════════════════
 * CAPA — o ponto que abre a apresentação (ref victorfuruya.com)
 *
 * Fundo preto liso. Mouse perto do logo: SÓ ELE se mexe — aberração
 * cromática fractal (displacement por canal RGB) com intensidade pela
 * proximidade, em filtro SVG.
 *
 * Ao passar pro lado: as letras saem, o PONTO viaja pro centro e
 * CRESCE até tomar a tela inteira em paper — e a seção muda. O
 * engine segura a navegação (exitHold) durante a coreografia.
 *
 * O wordmark é desenhado em partes: letras (svg inline com os paths
 * do arquivo mãe) e o ponto como elemento próprio, medido na posição
 * exata onde o ponto do wordmark estaria.
 * ═══════════════════════════════════════════════════════════════════ */

const VB = { w: 120.37, h: 56.99 }
const PATH_C =
  "M25.68,56.99c-8.15,0-14.46-2.06-18.95-6.18C2.24,46.69,0,39.23,0,28.43S2.24,10.2,6.73,6.12C11.21,2.04,17.52,0,25.63,0s14.25,1.92,18.39,5.75c4.14,3.83,6.22,9.89,6.22,18.19h-12.6c0-6.66-1.03-10.82-3.09-12.49-2.06-1.67-5.06-2.5-9.01-2.5s-7.2.99-9.5,2.96-3.45,7.48-3.45,16.53,1.16,14.65,3.47,16.63c2.31,1.98,5.47,2.98,9.47,2.98s6.95-.87,9.01-2.6c2.06-1.73,3.09-5.88,3.09-12.43h12.6c0,8.16-2.07,14.2-6.22,18.11s-10.26,5.87-18.35,5.87Z"
const PATH_2 =
  "M53.53,49.08c0-4.02,1.41-7.53,4.24-10.51,2.82-2.98,7.23-5.85,13.22-8.6,5.54-2.69,9.13-4.96,10.79-6.81,1.66-1.85,2.49-4.35,2.49-7.51s-.73-5.24-2.19-6.06c-1.46-.82-3.61-1.23-6.45-1.23-3.18,0-5.62.68-7.32,2.04-1.7,1.36-2.55,4.11-2.55,8.24h-12.35c0-6.16,1.84-10.81,5.54-13.95,3.69-3.14,9.25-4.7,16.69-4.7s12.89,1.35,16.18,4.04,4.94,6.52,4.94,11.49-1.55,8.98-4.64,12.03c-3.09,3.05-7.11,5.93-12.05,8.62-4.74,2.42-8.17,4.5-10.28,6.25-2.12,1.75-3.17,3.58-3.17,5.5h30.06v8.74h-43.13v-7.58Z"
/** Geometria do ponto no espaço do viewBox (retângulo do arquivo mãe). */
const DOT = { x: 108.75, y: 47.25, w: 11.62, h: 9.41 }

type DotBox = { left: number; top: number; w: number; h: number }

export function SlideCapa() {
  const logoRef = useRef<HTMLDivElement>(null)
  const [dotBox, setDotBox] = useState<DotBox | null>(null)
  const [leave, setLeave] = useState<{ dx: number; s: number } | null>(null)
  const leavingRef = useRef(false)

  const measure = useCallback((): DotBox | null => {
    const el = logoRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    const s = r.width / VB.w
    return {
      left: r.left + DOT.x * s,
      top: r.top + DOT.y * s,
      w: DOT.w * s,
      h: DOT.h * s,
    }
  }, [])

  useLayoutEffect(() => {
    const apply = () => setDotBox(measure())
    apply()
    window.addEventListener("resize", apply)
    return () => window.removeEventListener("resize", apply)
  }, [measure])

  /* ── aberração cromática por proximidade — só no logo ─────────
   * Escrita direto nos atributos do filtro, num rAF próprio. Já tentei
   * dirigir isto por motion values + useSpring: o `.on("change")` de um
   * value que não está preso a nenhum elemento renderizado não tica de
   * forma confiável, e o efeito simplesmente não acontecia. Loop
   * explícito remove a dependência e é verificável. */
  const alvo = useRef(0)
  const atual = useRef(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (leavingRef.current) return
      const el = logoRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      const raio = Math.max(300, r.width * 1.6)
      alvo.current = Math.max(0, 1 - dist / raio)
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    // busca por id em vez de ref: ref em primitivo de filtro SVG nao
    // ata de forma confiavel aqui, e o efeito ficava mudo
    let eR: Element | null = null
    let eG: Element | null = null
    let eB: Element | null = null

    let raf = 0
    const passo = () => {
      if (!eR) {
        eR = document.getElementById("capa-disp-r")
        eG = document.getElementById("capa-disp-g")
        eB = document.getElementById("capa-disp-b")
      }
      // sobe rápido, desce devagar — o logo respira em vez de piscar
      const k = alvo.current > atual.current ? 0.14 : 0.06
      atual.current += (alvo.current - atual.current) * k
      const v = atual.current
      eR?.setAttribute("scale", String(v * 26))
      eG?.setAttribute("scale", String(v * 17))
      eB?.setAttribute("scale", String(v * 9))
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  // ── coreografia de saída: ponto viaja pro centro e toma a tela ──
  useEffect(() => {
    const onLeave = () => {
      const b = measure()
      if (!b || leavingRef.current) return
      leavingRef.current = true
      alvo.current = 0
      // trajeto em linha lateral reta: só X. O ponto desliza até o
      // meio da tela na mesma altura em que nasceu, e só então cresce.
      const dx = window.innerWidth / 2 - (b.left + b.w / 2)
      const s =
        (Math.hypot(window.innerWidth, window.innerHeight) / Math.min(b.w, b.h)) * 1.4
      setDotBox(b)
      setLeave({ dx, s })
    }
    window.addEventListener("cred:capa-leave", onLeave)
    return () => window.removeEventListener("cred:capa-leave", onLeave)
  }, [measure])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: "var(--black)" }}
    >
      {/* filtro de aberração — vive SÓ no logo */}
      <svg aria-hidden focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter
            id="capa-aberr"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <MotionTurb
              type="fractalNoise"
              numOctaves={2}
              seed={7}
              stitchTiles="stitch"
              result="map"
              initial={{ baseFrequency: 0.012 }}
              animate={{ baseFrequency: [0.012, 0.022, 0.012] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <feDisplacementMap
              id="capa-disp-r"
              in="SourceGraphic"
              in2="map"
              scale={0}
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
            <feDisplacementMap
              id="capa-disp-g"
              in="SourceGraphic"
              in2="map"
              scale={0}
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
            <feDisplacementMap
              id="capa-disp-b"
              in="SourceGraphic"
              in2="map"
              scale={0}
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
            <feBlend in="chR" in2="chG" mode="screen" result="rg" />
            <feBlend in="rg" in2="chB" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* C2 — as letras (o ponto é o elemento viajante, separado) */}
      <div
        className="absolute inset-0 z-10 flex items-center"
        style={{ paddingLeft: "calc(var(--cred-margin) + 9vw)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          animate={
            leave
              ? { opacity: 0, x: -20, transition: { duration: 0.4, ease: EASE } }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 1.4, ease: EASE, delay: 0.3 },
                }
          }
          style={{ lineHeight: 0 }}
        >
          <motion.div
            ref={logoRef}
            style={{
              width: "min(18vw, 260px)",
              minWidth: 140,
              filter: "url(#capa-aberr)",
            }}
          >
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
              aria-label="C2."
            >
              <g fill="var(--paper)">
                <path d={PATH_C} />
                <path d={PATH_2} />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* o ponto — na saída desliza em linha reta lateral até o meio
          da tela e só então cresce até tomá-la inteira */}
      {dotBox && (
        <motion.div
          aria-hidden
          className="fixed z-40"
          style={{
            left: dotBox.left,
            top: dotBox.top,
            width: dotBox.w,
            height: dotBox.h,
          }}
          initial={{ opacity: 0 }}
          animate={
            leave
              ? {
                  opacity: 1,
                  x: [0, leave.dx, leave.dx],
                  scale: [1, 1, leave.s],
                  transition: {
                    duration: 1.25,
                    times: [0, 0.44, 1],
                    // dois tempos distintos: o deslize sai firme e
                    // assenta no meio; a abertura parte devagar e
                    // acelera até engolir a tela
                    ease: [
                      [0.35, 0, 0.15, 1],
                      [0.7, 0, 0.4, 1],
                    ],
                  },
                }
              : { opacity: 1, transition: { duration: 1.4, ease: EASE, delay: 0.3 } }
          }
        >
          <div style={{ width: "100%", height: "100%", background: "var(--paper)" }} />
        </motion.div>
      )}

      {/* rodapé próprio da capa */}
      <motion.div
        className="absolute inset-x-0 z-20 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{
          opacity: leave ? 0 : 1,
          transition: { duration: leave ? 0.3 : 1, delay: leave ? 0 : 1.1 },
        }}
        style={{
          bottom: "clamp(20px, 3.4vh, 40px)",
          paddingInline: "var(--cred-margin)",
        }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--mute-3)" }}
        >
          rs • sp
        </span>

        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex", color: "var(--mute-3)" }}
        >
          <Asterisco size={13} />
        </motion.span>

        <span
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--mute-3)" }}
        >
          credencial · 2026
        </span>
      </motion.div>

    </div>
  )
}
