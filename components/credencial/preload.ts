"use client"

import { cases } from "@/data/credencial/cases"
import { iaCases } from "@/data/credencial/ia"
import { clientes } from "@/data/credencial/clientes"
import { time } from "@/data/credencial/time"
import { fotosServicos } from "@/data/credencial/servicos"

/* ═══════════════════════════════════════════════════════════════════
 * PRELOAD — abre rápido, aquece o resto por baixo
 *
 * A primeira versão segurava a abertura até TUDO carregar: 102 assets,
 * 72 MB — e 51,6 MB disso eram os 8 vídeos dos cases, cada um esperado
 * até `canplaythrough` (ou seja, baixado quase inteiro). Resultado: o
 * loader ficava parado perto dos 100 por vários segundos.
 *
 * Agora são duas fases:
 *   1. BLOQUEIA só no que a abertura precisa — marca, manifesto e as
 *      lâminas de serviços (~3 MB). É o que aparece nos 4 primeiros
 *      slides, o tempo que alguém leva para começar a falar.
 *   2. AQUECE o resto em segundo plano, já com a apresentação rodando:
 *      primeiro as imagens, depois os vídeos, um de cada vez, para não
 *      disputar banda com o que está em cena.
 *
 * O deck continua chegando "carregado" na hora de mostrar case — só
 * não faz mais ninguém esperar por isso na porta.
 * ═══════════════════════════════════════════════════════════════════ */

/** Slides 1–4: capa, reel, manifesto, serviços. */
const ESSENCIAIS = [
  // marca — wordmark nos dois temas (moldura + capa)
  "/media/credencial/brand/c2-wordmark-paper.svg",
  "/media/credencial/brand/c2-wordmark-ink.svg",
  // manifesto
  "/media/credencial/moodboard/mb-03.jpg",
  "/media/credencial/moodboard/mb-08.jpg",
  // serviços — o repertório das três lâminas
  ...fotosServicos,
]

const IMAGE_TIMEOUT = 6000
/** Prazo da fase 1. Curto de propósito: são poucos MB. */
const DEADLINE = 6000

/** Tudo que existe na apresentação, separado por tipo. */
export function collectAssets(): { imagens: string[]; videos: string[] } {
  const imagens = new Set<string>(ESSENCIAIS)
  const videos = new Set<string>()

  const addVideo = (src?: string) => {
    // só vídeo local — YouTube/Vimeo não dá pra aquecer daqui
    if (src && src.startsWith("/media")) videos.add(src)
  }

  cases.forEach((c) => {
    c.imagens.forEach((i) => imagens.add(i))
    addVideo(c.video)
    addVideo(c.insercao?.src)
  })
  iaCases.forEach((c) => {
    ;(c.imagens ?? []).forEach((i) => imagens.add(i))
    addVideo(c.video)
  })
  clientes.forEach((l) => imagens.add(l.src))
  time.forEach((p) => imagens.add(p.foto))
  imagens.add("/media/credencial/estudio/311.jpg")

  return { imagens: Array.from(imagens), videos: Array.from(videos) }
}

function loadImagem(src: string, timeout = IMAGE_TIMEOUT): Promise<void> {
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
    const t = setTimeout(finish, timeout)
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

/** Aquece um vídeo até dar para tocar, sem prender ninguém. */
function aquecerVideo(src: string): Promise<void> {
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
    // teto generoso: aqui já não há ninguém esperando
    const t = setTimeout(finish, 30000)
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

/** Fase 2: o resto, sem bloquear — imagens antes, vídeos depois. */
async function aquecerEmSegundoPlano(jaFeitos: Set<string>) {
  const { imagens, videos } = collectAssets()

  // imagens em lotes pequenos: aquece sem estrangular a rede do slide
  const pendentes = imagens.filter((s) => !jaFeitos.has(s))
  const LOTE = 4
  for (let i = 0; i < pendentes.length; i += LOTE) {
    await Promise.all(pendentes.slice(i, i + LOTE).map((s) => loadImagem(s, 15000)))
  }

  // vídeos um a um, do mais leve ao mais pesado — o primeiro case
  // chega aquecido bem antes de alguém navegar até lá
  for (const src of videos) {
    await aquecerVideo(src)
  }
}

/**
 * Carrega o essencial e devolve o controle. Progresso 0–1 vale só
 * para a fase 1 — é o que o loader mostra.
 */
export async function preloadAll(onProgress: (p: number) => void): Promise<void> {
  const total = ESSENCIAIS.length
  let done = 0
  const tick = () => {
    done++
    onProgress(done / total)
  }

  const todos = Promise.all(ESSENCIAIS.map((s) => loadImagem(s).then(tick)))
  // rede ruim em sala de cliente não pode segurar a abertura
  const prazo = new Promise<void>((r) => setTimeout(r, DEADLINE))
  await Promise.race([todos, prazo])
  onProgress(1)

  // a partir daqui a apresentação já está no ar
  void aquecerEmSegundoPlano(new Set(ESSENCIAIS))
}
