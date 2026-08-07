"use client"

/* ═══════════════════════════════════════════════════════════════════
 * BLOOM
 *
 * O "gradiente" do sistema — mas nunca um fundo colorido. É uma fonte
 * de luz âmbar que respira atrás do conteúdo, em `screen`, ancorada
 * onde a imagem do slide tem o seu ponto quente.
 *
 * Regra do Brandbook v2.0 §07: o acento vive dentro da imagem, na luz
 * e no grading — nunca como bloco chapado. Por isso `screen` (só soma
 * luz, nunca cobre) e opacidade baixa.
 * ═══════════════════════════════════════════════════════════════════ */

type Props = {
  /** Origem da luz, em % do quadro. */
  x?: number
  y?: number
  /** Raio em % da menor dimensão. */
  size?: number
  /** 0–1. Acima de 0.5 começa a virar bloco — evite. */
  intensity?: number
  /** Respiração lenta (14s). Desligue em slides de leitura densa. */
  breathe?: boolean
  /** Luz fria de contraponto, no canto oposto. Dá volume ao quadro. */
  counter?: boolean
  className?: string
}

export function GradientBloom({
  x = 50,
  y = 55,
  size = 72,
  intensity = 0.3,
  breathe = true,
  counter = false,
  className = "",
}: Props) {
  const amber = (a: number) => `rgba(224, 83, 31, ${a})`

  // Três paradas, não duas: o degradê de duas paradas cria um anel
  // visível na borda. A do meio dissolve a transição.
  const warm = `radial-gradient(${size}% ${size}% at ${x}% ${y}%, ${amber(
    intensity,
  )} 0%, ${amber(intensity * 0.34)} 32%, ${amber(0)} 68%)`

  // O contraponto é neutro, não azul: azul chapado brigaria com o
  // monocromático. Só uma elevação fria de luminância.
  const cool = `radial-gradient(${size * 0.9}% ${size * 0.9}% at ${100 - x}% ${
    100 - y
  }%, rgba(245,245,245,${intensity * 0.16}) 0%, rgba(245,245,245,0) 62%)`

  return (
    <div
      aria-hidden
      className={`cred-bloom ${className}`}
      data-breathe={breathe ? "1" : "0"}
      style={{ backgroundImage: counter ? `${warm}, ${cool}` : warm }}
    />
  )
}
