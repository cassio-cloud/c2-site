"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SlideFrame } from "./SlideFrame"
import { SlideProgress } from "./SlideProgress"
import { AudioProvider, useAudio } from "./audio"
import { preloadAll } from "./preload"
import { SlideTransition } from "./SlideTransition"
import { DECKS, type Versao } from "./decks"

export function SlideEngine({ versao = "v1" }: { versao?: Versao }) {
  return (
    <AudioProvider>
      <SlideEngineInner versao={versao} />
    </AudioProvider>
  )
}

function SlideEngineInner({ versao }: { versao: Versao }) {
  // a versão não muda durante a sessão: deck e total são estáveis
  const slides = DECKS[versao]
  const TOTAL = slides.length
  const { muted, toggle: toggleAudio } = useAudio()

  // ── preloader: carrega tudo da apresentação antes de começar ──
  const [pct, setPct] = useState(0)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    // tempo mínimo em tela — o loader nunca pisca
    const minimo = new Promise((r) => setTimeout(r, 1200))
    Promise.all([preloadAll((p) => alive && setPct(p), versao), minimo]).then(() => {
      if (alive) setReady(true)
    })
    return () => {
      alive = false
    }
  }, [versao])

  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isFs, setIsFs] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  // auto-hide dos controles após inatividade
  useEffect(() => {
    const wake = () => {
      setControlsVisible(true)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setControlsVisible(false), 2600)
    }
    wake()
    window.addEventListener("mousemove", wake)
    window.addEventListener("keydown", wake)
    return () => {
      window.removeEventListener("mousemove", wake)
      window.removeEventListener("keydown", wake)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  // refs pro exitHold: idx corrente sem stale closure + trava de replay
  const idxRef = useRef(0)
  useEffect(() => {
    idxRef.current = idx
  }, [idx])
  const holdRef = useRef(false)

  const goTo = useCallback((next: number, dir: 1 | -1) => {
    if (next < 0 || next >= TOTAL || holdRef.current) return
    setDirection(dir)
    setIdx(next)
  }, [TOTAL])

  const next = useCallback(() => {
    if (holdRef.current) return
    const i = idxRef.current
    if (i >= TOTAL - 1) return
    const hold = slides[i].exitHold
    if (hold) {
      // coreografia de saída: avisa o slide, espera, então troca
      holdRef.current = true
      window.dispatchEvent(new Event("cred:capa-leave"))
      setTimeout(() => {
        holdRef.current = false
        setDirection(1)
        setIdx(i + 1)
      }, hold)
      return
    }
    setDirection(1)
    setIdx(i + 1)
  }, [slides, TOTAL])

  const prev = useCallback(() => {
    if (holdRef.current) return
    setDirection(-1)
    setIdx((i) => (i > 0 ? i - 1 : i))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === "Escape") {
        goTo(0, -1)
      } else if (e.key === "Home") {
        goTo(0, -1)
      } else if (e.key === "End") {
        goTo(TOTAL - 1, 1)
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev, goTo, toggleFullscreen, TOTAL])

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const w = e.currentTarget.clientWidth
    if (e.clientX > w / 2) next()
    else prev()
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const end = e.changedTouches[0]?.clientX ?? touchStartX.current
    const dx = end - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return
    if (dx < 0) next()
    else prev()
  }

  const current = slides[idx]
  const theme = current.theme

  const ctrlColor = theme === "dark" ? "rgba(239,239,239,0.55)" : "rgba(13,13,13,0.55)"

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full select-none"
      data-theme={theme}
      style={{ background: theme === "dark" ? "var(--black)" : "var(--paper)" }}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {!current.hideFrame && (
        <>
          <SlideProgress idx={idx} total={TOTAL} theme={theme} />
          <SlideFrame idx={idx} total={TOTAL} theme={theme} />
        </>
      )}

      {ready && (
        <AnimatePresence initial={false}>
          <SlideTransition
            key={idx}
            direction={direction}
            variant={current.variant}
            veilFrom={current.veilFrom}
            diveOrigin={current.diveOrigin}
          >
            {current.render()}
          </SlideTransition>
        </AnimatePresence>
      )}


      {/* ── LOADER — uma linha atravessando a tela + número mínimo ── */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="cred-loader"
            className="absolute inset-0 z-[200] overflow-hidden"
            style={{ background: "var(--black)" }}
            exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] } }}
          >
            {/* número — discreto, na margem direita, acima da linha */}
            <span
              className="font-mono"
              style={{
                position: "absolute",
                right: "var(--cred-margin)",
                top: "calc(50% - 26px)",
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "var(--mute-3)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(Math.round(pct * 100)).padStart(3, "0")}
            </span>

            {/* a linha — borda a borda, no meio da tela */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 1,
                background: "var(--line-10)",
              }}
            >
              <motion.div
                animate={{ scaleX: pct }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  height: "100%",
                  background: "var(--paper)",
                  transformOrigin: "left center",
                  scaleX: 0,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* controle de tela cheia — auto-hide, não interfere nas imagens */}
      <button
        type="button"
        aria-label={isFs ? "Sair da tela cheia" : "Tela cheia"}
        onClick={(e) => {
          e.stopPropagation()
          toggleFullscreen()
        }}
        className="fixed z-[60] flex items-center justify-center"
        style={{
          right: "clamp(16px, 2vw, 32px)",
          bottom: "clamp(48px, 7vh, 96px)",
          width: 34,
          height: 34,
          color: ctrlColor,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          opacity: controlsVisible ? 0.7 : 0,
          transition: "opacity 0.5s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          {isFs ? (
            <>
              <path d="M6 1.5V6H1.5" />
              <path d="M10 1.5V6h4.5" />
              <path d="M6 14.5V10H1.5" />
              <path d="M10 14.5V10h4.5" />
            </>
          ) : (
            <>
              <path d="M1.5 5.5v-4h4" />
              <path d="M14.5 5.5v-4h-4" />
              <path d="M1.5 10.5v4h4" />
              <path d="M14.5 10.5v4h-4" />
            </>
          )}
        </svg>
      </button>

      {/* controle de áudio — auto-hide */}
      <button
        type="button"
        aria-label={muted ? "Ativar áudio" : "Desativar áudio"}
        onClick={(e) => {
          e.stopPropagation()
          toggleAudio()
        }}
        className="fixed z-[60] flex items-center justify-center"
        style={{
          right: "clamp(58px, 5vw, 78px)",
          bottom: "clamp(48px, 7vh, 96px)",
          width: 34,
          height: 34,
          color: ctrlColor,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          opacity: controlsVisible ? 0.7 : 0,
          transition: "opacity 0.5s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6v5h2.5l3.5 3V3L5 6H2.5Z" />
          {muted ? (
            <path d="M11.5 6.5l3 3M14.5 6.5l-3 3" />
          ) : (
            <>
              <path d="M11.5 6a3 3 0 0 1 0 5" />
              <path d="M13.2 4.4a5.4 5.4 0 0 1 0 8.2" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}
