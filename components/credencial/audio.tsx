"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

type AudioCtx = { muted: boolean; toggle: () => void }

const Ctx = createContext<AudioCtx>({ muted: true, toggle: () => {} })

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true)
  const toggle = useCallback(() => setMuted((m) => !m), [])
  return <Ctx.Provider value={{ muted, toggle }}>{children}</Ctx.Provider>
}

export function useAudio() {
  return useContext(Ctx)
}
