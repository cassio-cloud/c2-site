"use client"

import { CredVideo } from "./CredVideo"
import { parseEmbedUrl } from "@/lib/embed"

type Props = {
  /** URL de YouTube/Vimeo OU caminho local (/media/...). */
  src: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Hero de mídia da credencial: se `src` for YouTube/Vimeo → iframe cover
 * full-bleed (background style); se for arquivo local → <CredVideo> (com
 * controle de áudio). Evita carregar/streamar vídeos pesados do servidor.
 */
export function CredHero({ src, className, style }: Props) {
  const source = parseEmbedUrl(src)

  if (source.kind === "youtube" || source.kind === "vimeo") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "max(100%, calc(100% * 16 / 9))",
            height: "max(100%, calc(100% * 9 / 16))",
            // cobre o container mantendo 16:9 centralizado
            minWidth: "100%",
            minHeight: "100%",
            aspectRatio: "16 / 9",
            transform: "translate(-50%, -50%)",
          }}
        >
          <iframe
            src={source.embedUrl}
            title="C2"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="block h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    )
  }

  // arquivo local — garante leading slash + cache-bust (vídeos reencodados no mesmo path)
  const base = source.kind === "file" ? `/${source.src}` : src
  const fileSrc = base.includes("?") ? base : `${base}?v=2`
  return <CredVideo src={fileSrc} className={className} style={style} />
}
