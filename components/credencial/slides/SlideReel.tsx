"use client"

import { Grain } from "../Grain"
import { CredVideo } from "../CredVideo"
import { parseEmbedUrl } from "@/lib/embed"
import { REEL_EMBED, REEL_FALLBACK } from "@/data/credencial/reel"

export function SlideReel() {
  const source = parseEmbedUrl(REEL_EMBED)
  const isEmbed = source.kind === "youtube" || source.kind === "vimeo"

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      {isEmbed ? (
        // iframe cover full-screen (mesmo padrão do Hero)
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: "max(100vw, 177.78dvh)",
              height: "max(56.25vw, 100dvh)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <iframe
              src={source.embedUrl}
              title="Reel C2"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="block h-full w-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      ) : (
        <CredVideo
          src={REEL_FALLBACK}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

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
