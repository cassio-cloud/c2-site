"use client"

import { useEffect, useRef } from "react"
import { CredVideo } from "./CredVideo"
import { useAudio } from "./audio"
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
 *
 * O botão de som do deck vale para os DOIS casos. O arquivo local segue
 * o contexto direto; o embed entra sempre com `mute=1` (senão o autoplay
 * é barrado) e é destravado depois, pela IFrame API — `enablejsapi=1` já
 * vem na URL. O player pode não estar pronto no primeiro disparo, então
 * o comando se repete por alguns segundos até pegar.
 */
export function CredHero({ src, className, style }: Props) {
  const source = parseEmbedUrl(src)
  const { muted } = useAudio()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const tipo = source.kind
  const ehEmbed = tipo === "youtube" || tipo === "vimeo"

  /**
   * Mata a legenda do YouTube.
   *
   * `cc_load_policy=0` na URL só diz "não ligue por padrão" — se o
   * espectador tem legenda ligada na conta dele, o player liga assim
   * mesmo e a tarja aparece por cima do filme. O jeito de desligar de
   * verdade é descarregar o módulo: `captions` no player antigo, `cc`
   * no HTML5. Vai junto com um `setOption` de faixa vazia, que cobre
   * as versões em que o unload sozinho não pega.
   */
  useEffect(() => {
    if (tipo !== "youtube") return
    const desligar = () => {
      const win = frameRef.current?.contentWindow
      if (!win) return
      const cmd = (func: string, args: unknown[]) =>
        win.postMessage(JSON.stringify({ event: "command", func, args }), "*")
      cmd("unloadModule", ["captions"])
      cmd("unloadModule", ["cc"])
      cmd("setOption", ["captions", "track", {}])
      cmd("setOption", ["cc", "track", {}])
    }
    desligar()
    // o módulo só existe depois que o player monta, e pode voltar
    // quando a faixa carrega — insiste durante a abertura do slide
    const repete = setInterval(desligar, 500)
    const fim = setTimeout(() => clearInterval(repete), 8000)
    return () => {
      clearInterval(repete)
      clearTimeout(fim)
    }
  }, [tipo, src])

  useEffect(() => {
    if (!ehEmbed) return
    const enviar = () => {
      const win = frameRef.current?.contentWindow
      if (!win) return
      const msg =
        tipo === "youtube"
          ? JSON.stringify({
              event: "command",
              func: muted ? "mute" : "unMute",
              args: [],
            })
          : JSON.stringify({ method: "setVolume", value: muted ? 0 : 1 })
      win.postMessage(msg, "*")
    }
    enviar()
    const repete = setInterval(enviar, 500)
    const fim = setTimeout(() => clearInterval(repete), 5000)
    return () => {
      clearInterval(repete)
      clearTimeout(fim)
    }
  }, [muted, ehEmbed, tipo])

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
            ref={frameRef}
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
