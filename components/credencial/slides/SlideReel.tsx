"use client"

import { Grain } from "../Grain"
import { CredHero } from "../CredHero"
import { REEL_EMBED, REEL_FALLBACK } from "@/data/credencial/reel"

export function SlideReel() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <CredHero
        src={REEL_EMBED || REEL_FALLBACK}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0) 100%)",
        }}
      />

      <div
        className="absolute bottom-6 left-6 font-mono"
        style={{ color: "var(--mute-3)", fontSize: 11, letterSpacing: "0.2em" }}
      >
        REEL 2026
      </div>

      <Grain />
    </div>
  )
}
