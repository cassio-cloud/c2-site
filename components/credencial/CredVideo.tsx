"use client"

import { useEffect, useRef } from "react"
import { useAudio } from "./audio"

type Props = {
  src: string
  className?: string
  style?: React.CSSProperties
  poster?: string
}

/**
 * Vídeo da credencial — autoplay/loop/playsInline, com mute controlado
 * pelo contexto de áudio global. Mantém o play() ao alternar o som.
 */
export function CredVideo({ src, className, style, poster }: Props) {
  const { muted } = useAudio()
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = muted
    // garante reprodução após mudança de mute (gesto do usuário já ocorreu)
    const p = v.play()
    if (p && typeof p.catch === "function") p.catch(() => {})
  }, [muted, src])

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      autoPlay
      muted={muted}
      loop
      playsInline
      preload="auto"
      poster={poster}
      className={className}
      style={style}
    />
  )
}
