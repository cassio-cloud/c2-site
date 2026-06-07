"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence } from "motion/react"
import { cases } from "@/data/credencial/cases"
import { iaCases } from "@/data/credencial/ia"
import { SlideFrame } from "./SlideFrame"
import { SlideProgress } from "./SlideProgress"
import { AudioProvider, useAudio } from "./audio"
import { SlideTransition, type TransitionVariant } from "./SlideTransition"
import { SlideCapa } from "./slides/SlideCapa"
import { SlideReel } from "./slides/SlideReel"
import { SlideMoodboard } from "./slides/SlideMoodboard"
import { SlideManifesto } from "./slides/SlideManifesto"
import { SlideServicos } from "./slides/SlideServicos"
import { SlideDivider } from "./slides/SlideDivider"
import { SlideCase } from "./slides/SlideCase"
import { SlideIAManifesto } from "./slides/SlideIAManifesto"
import { SlideIACase } from "./slides/SlideIACase"
import { SlideEstrutura } from "./slides/SlideEstrutura"
import { SlideTime } from "./slides/SlideTime"
import { SlideClientes } from "./slides/SlideClientes"
import { SlideContato } from "./slides/SlideContato"

type SlideDef = {
  render: () => ReactNode
  theme: "dark" | "light"
  variant?: TransitionVariant
  /** Esconde header/footer (moldura) e a progress bar — usado na capa. */
  hideFrame?: boolean
}

const slides: SlideDef[] = [
  { render: () => <SlideCapa />, theme: "dark", hideFrame: true, variant: "fade" },
  { render: () => <SlideReel />, theme: "dark" },
  { render: () => <SlideMoodboard />, theme: "dark" },
  { render: () => <SlideManifesto />, theme: "light" },
  { render: () => <SlideServicos />, theme: "light" },

  // — trabalho (prova) —
  {
    render: () => <SlideDivider label="03 · TRABALHO" titulo="trabalho." bg="dark" />,
    theme: "dark",
    variant: "fade",
  },
  ...cases.map((c) => ({
    render: () => <SlideCase case={c} />,
    theme: "dark" as const,
  })),

  // — ia (diferencial) —
  {
    render: () => <SlideDivider label="04 · IA" titulo="ia." bg="dark" glow />,
    theme: "dark",
    variant: "fade",
  },
  { render: () => <SlideIAManifesto />, theme: "dark" },
  ...iaCases.map((ia) => ({
    render: () => <SlideIACase ia={ia} />,
    theme: "dark" as const,
  })),

  // — a empresa (confiança): estrutura · time · clientes —
  {
    render: () => <SlideDivider label="05 · A EMPRESA" titulo="a empresa." bg="light" />,
    theme: "light",
    variant: "fade",
  },
  { render: () => <SlideEstrutura />, theme: "light" },
  { render: () => <SlideTime />, theme: "light" },
  { render: () => <SlideClientes />, theme: "dark" },

  { render: () => <SlideContato />, theme: "dark" },
]

const TOTAL = slides.length

export function SlideEngine() {
  return (
    <AudioProvider>
      <SlideEngineInner />
    </AudioProvider>
  )
}

function SlideEngineInner() {
  const { muted, toggle: toggleAudio } = useAudio()
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

  const goTo = useCallback((next: number, dir: 1 | -1) => {
    if (next < 0 || next >= TOTAL) return
    setDirection(dir)
    setIdx(next)
  }, [])

  const next = useCallback(() => {
    setDirection(1)
    setIdx((i) => (i < TOTAL - 1 ? i + 1 : i))
  }, [])

  const prev = useCallback(() => {
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
  }, [next, prev, goTo, toggleFullscreen])

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
      className="relative h-full w-full select-none bg-ink"
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

      <AnimatePresence initial={false}>
        <SlideTransition key={idx} direction={direction} variant={current.variant}>
          {current.render()}
        </SlideTransition>
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
