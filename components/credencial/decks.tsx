"use client"

import type { ReactNode } from "react"
import { cases } from "@/data/credencial/cases"
import { iaCases } from "@/data/credencial/ia"
import { diretores } from "@/data/credencial/diretores"
import type { TransitionVariant } from "./SlideTransition"
import type { SweepFrom } from "./Refraction"
import { SlideCapa } from "./slides/SlideCapa"
import { SlideReel } from "./slides/SlideReel"
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
import { SlideDiretores } from "./slides/SlideDiretores"
import { SlideDiretor } from "./slides/SlideDiretor"
import { SlideDiretorFilme } from "./slides/SlideDiretorFilme"

export type SlideDef = {
  render: () => ReactNode
  theme: "dark" | "light"
  variant?: TransitionVariant
  /** Esconde header/footer (moldura) e a progress bar — usado na capa. */
  hideFrame?: boolean
  /** Nome da seção — vai no topo direito da moldura. */
  secao?: string
  /** Índice aceso na régua de formatos do rodapé. */
  formato?: number
  /** Lado de onde a varredura do `veil` entra — um lado por capítulo. */
  veilFrom?: SweepFrom
  /** Origem do zoom do `dive` — centro do tile/foto em que se entra. */
  diveOrigin?: string
  /**
   * Segura a navegação por N ms ao avançar DESTE slide: o engine
   * dispara `cred:capa-leave`, o slide roda a própria coreografia de
   * saída (ponto viaja e abre), e só então a troca acontece.
   */
  exitHold?: number
}

/** Abertura comum às duas versões: capa, reel, manifesto, serviços. */
const abertura: SlideDef[] = [
  { render: () => <SlideCapa />, theme: "dark", hideFrame: true, variant: "fade", exitHold: 1250 },
  { render: () => <SlideReel />, theme: "dark", variant: "still", secao: "reel", formato: 3 },
  { render: () => <SlideManifesto />, theme: "light", variant: "dive", diveOrigin: "80% 27%", secao: "manifesto" },
  { render: () => <SlideServicos />, theme: "dark", variant: "fade", secao: "o que fazemos" },
]

/* ── V1 · /credencial — trabalho (cases) → ia → a empresa ── */
const v1: SlideDef[] = [
  ...abertura,

  // — trabalho (prova) — a varredura entra da esquerda
  {
    render: () => <SlideDivider label="03 · TRABALHO" titulo="trabalho." bg="dark" />,
    theme: "dark",
    variant: "veil",
    veilFrom: "left",
    secao: "trabalho",
  },
  ...cases.map((c) => ({
    render: () => <SlideCase case={c} />,
    theme: "dark" as const,
    variant: "mask" as const,
    secao: "trabalho",
    formato: 3,
  })),

  // — ia (diferencial) — a varredura desce de cima
  {
    render: () => <SlideDivider label="04 · IA" titulo="ia." bg="dark" glow />,
    theme: "dark",
    variant: "veil",
    veilFrom: "top",
    secao: "ia",
  },
  { render: () => <SlideIAManifesto />, theme: "dark", variant: "type", secao: "ia" },
  ...iaCases.map((ia) => ({
    render: () => <SlideIACase ia={ia} />,
    theme: "dark" as const,
    variant: "mask" as const,
    secao: "ia",
    formato: 3,
  })),

  // — a empresa (confiança): estrutura · time · clientes —
  // a varredura sobe de baixo
  {
    render: () => <SlideDivider label="05 · A EMPRESA" titulo="a empresa." bg="light" />,
    theme: "light",
    variant: "veil",
    veilFrom: "bottom",
    secao: "a empresa",
  },
  { render: () => <SlideEstrutura />, theme: "light", secao: "a empresa" },
  { render: () => <SlideTime />, theme: "dark", variant: "mask", secao: "a empresa" },
  { render: () => <SlideClientes />, theme: "dark", variant: "depth", secao: "clientes" },

  { render: () => <SlideContato />, theme: "dark", variant: "type", secao: "contato" },
]

/* ── V2 · /credencial/v2 — a empresa → diretores de cena → final ──
 * O "trabalho" vira o elenco: um slide com todos, depois cada diretor
 * (perfil + um slide por filme). Elenco e perfis no branco; os filmes
 * no preto — a sala escurece para o cinema. */
const v2: SlideDef[] = [
  ...abertura,

  {
    render: () => <SlideDivider label="03 · A EMPRESA" titulo="a empresa." bg="light" />,
    theme: "light",
    variant: "veil",
    veilFrom: "bottom",
    secao: "a empresa",
  },
  { render: () => <SlideEstrutura />, theme: "light", secao: "a empresa" },

  {
    render: () => <SlideDivider label="04 · DIRETORES DE CENA" titulo="diretores." bg="light" />,
    theme: "light",
    variant: "veil",
    veilFrom: "left",
    secao: "diretores de cena",
  },
  {
    render: () => <SlideDiretores />,
    theme: "light",
    variant: "mask",
    secao: "diretores de cena",
  },
  ...diretores.flatMap((d) => [
    {
      render: () => <SlideDiretor d={d} />,
      // no branco: o retrato (fundo branco) se funde com a página
      theme: "light" as const,
      variant: "mask" as const,
      secao: "diretores de cena",
    },
    ...d.filmes.slice(0, 3).map((f, i) => ({
      render: () => <SlideDiretorFilme d={d} f={f} i={i} />,
      theme: "dark" as const,
      variant: "still" as const,
      secao: "diretores de cena",
      formato: 3,
    })),
  ]),

  { render: () => <SlideContato />, theme: "dark", variant: "type", secao: "contato" },
]

export type Versao = "v1" | "v2"

export const DECKS: Record<Versao, SlideDef[]> = { v1, v2 }
