"use client"

import { cases } from "@/data/credencial/cases"
import { iaCases } from "@/data/credencial/ia"
import { clientes } from "@/data/credencial/clientes"
import { time } from "@/data/credencial/time"
import { fotosServicos } from "@/data/credencial/servicos"

/* ═══════════════════════════════════════════════════════════════════
 * PRELOAD — tudo da apresentação, antes dela começar
 *
 * Coleta cada mídia referenciada pelos dados (cases, ia, clientes,
 * time) mais as listas fixas dos slides (manifesto, serviços, marca)
 * e aquece o cache: imagens via Image(), vídeos locais via <video>
 * até o `canplaythrough`. Cada asset conta 1 no progresso.
 *
 * Vídeo tem teto de espera — numa rede lenta o loader nunca trava:
 * o asset conta como carregado e o playback termina de bufferizar
 * em cena.
 * ═══════════════════════════════════════════════════════════════════ */

const L = "/media/credencial/lib2"

const EXTRAS_IMAGENS = [
  // manifesto
  "/media/credencial/moodboard/mb-03.jpg",
  "/media/credencial/moodboard/mb-08.jpg",
  // estrutura — o 311 (ciclorama, mezanino)
  "/media/credencial/estudio/311.jpg",
  // serviços: a lista vem de data/, para a caixa nunca piscar
  // esperando o próximo quadro da mesma categoria
  ...fotosServicos,
  // marca — wordmark nos dois temas (moldura) + capa
  "/media/credencial/brand/c2-wordmark-paper.svg",
  "/media/credencial/brand/c2-wordmark-ink.svg",
]

const VIDEO_TIMEOUT = 8000
const IMAGE_TIMEOUT = 6000
/** Prazo global: a apresentação SEMPRE começa, mesmo com asset preso. */
const DEADLINE = 14000

export function collectAssets(): { imagens: string[]; videos: string[] } {
  const imagens = new Set<string>(EXTRAS_IMAGENS)
  const videos = new Set<string>()

  const addVideo = (src?: string) => {
    // só vídeo local — YouTube/Vimeo não dá pra aquecer daqui
    if (src && src.startsWith("/media")) videos.add(src)
  }

  cases.forEach((c) => {
    c.imagens.forEach((i) => imagens.add(i))
    addVideo(c.video)
  })
  iaCases.forEach((c) => {
    ;(c.imagens ?? []).forEach((i) => imagens.add(i))
    addVideo(c.video)
  })
  clientes.forEach((l) => imagens.add(l.src))
  time.forEach((p) => imagens.add(p.foto))

  return { imagens: Array.from(imagens), videos: Array.from(videos) }
}

function loadImagem(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    // host externo lento (fotos do time) pode pendurar a request sem
    // nunca disparar onload/onerror — o teto garante o desbloqueio
    const t = setTimeout(finish, IMAGE_TIMEOUT)
    img.onload = () => {
      clearTimeout(t)
      finish()
    }
    img.onerror = () => {
      clearTimeout(t)
      finish()
    }
    img.src = src
  })
}

function loadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const v = document.createElement("video")
    let done = false
    const finish = () => {
      if (done) return
      done = true
      v.removeAttribute("src")
      v.load()
      resolve()
    }
    const t = setTimeout(finish, VIDEO_TIMEOUT)
    v.addEventListener("canplaythrough", () => {
      clearTimeout(t)
      finish()
    })
    v.addEventListener("error", () => {
      clearTimeout(t)
      finish()
    })
    v.preload = "auto"
    v.muted = true
    v.src = src
  })
}

/** Carrega tudo, reportando progresso 0–1. */
export async function preloadAll(onProgress: (p: number) => void): Promise<void> {
  const { imagens, videos } = collectAssets()
  const total = imagens.length + videos.length
  let done = 0
  const tick = () => {
    done++
    onProgress(done / total)
  }
  const todos = Promise.all([
    ...imagens.map((s) => loadImagem(s).then(tick)),
    ...videos.map((s) => loadVideo(s).then(tick)),
  ])
  // rede ruim em sala de cliente não pode segurar a abertura: o que
  // não carregou até o prazo termina de bufferizar em cena
  const prazo = new Promise<void>((r) => setTimeout(r, DEADLINE))
  await Promise.race([todos, prazo])
  onProgress(1)
}
