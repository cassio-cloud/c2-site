"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { Case } from "@/data/credencial/cases"
import { SITE_URL } from "@/data/credencial/cases"
import { CredHero } from "../CredHero"
import { VideoLightbox, BotaoAmpliar } from "../VideoLightbox"
import { usePortrait, FACE_POSITION } from "../Editorial"
import { parseEmbedUrl } from "@/lib/embed"

const EASE = [0.32, 0.72, 0, 1] as const

type Props = { case: Case }

export function SlideCase({ case: c }: Props) {
  const portrait = usePortrait()
  const [ampliado, setAmpliado] = useState(false)
  const hasVideo = Boolean(c.video)
  // hero (grande) = vídeo, senão a 1ª imagem; resto vai no grid lateral
  // (até 6 tiles no desktop, no máx. 3 no mobile/portrait). O clipe de
  // inserção, quando existe, é o primeiro tile e conta nesse limite.
  const insercao = c.insercao
  const maxTiles = portrait ? 3 : 6
  const stills = (hasVideo ? c.imagens : c.imagens.slice(1)).slice(
    0,
    maxTiles - (insercao ? 1 : 0),
  )
  const temPainel = stills.length > 0 || Boolean(insercao)
  const mainImg = hasVideo ? undefined : c.imagens[0]
  // grid lateral: 1 coluna até 3 fotos, 2 colunas de 4 a 6. Com clipe de
  // inserção são sempre 2 — ele abre a grade em largura total.
  const sideCols = insercao || stills.length > 3 ? 2 : 1
  const sideRows = (insercao ? 1 : 0) + Math.ceil(stills.length / sideCols)
  // última foto ocupa 2 colunas quando o total é ímpar (evita buraco)
  const spanLast = sideCols === 2 && stills.length % 2 === 1
  // Short 9:16 sem fotos: no paisagem, o filme ganha um painel vertical
  // à direita e o texto fica no preto — sem tarja dos lados. No retrato
  // o full-bleed de sempre já cobre o quadro.
  const embed = c.video ? parseEmbedUrl(c.video) : undefined
  const verticalSolo =
    !portrait &&
    !temPainel &&
    (embed?.kind === "youtube" || embed?.kind === "vimeo") &&
    embed.isVertical

  const TextBlock = (
    <motion.div
      className="absolute z-10"
      style={{
        bottom: "clamp(60px, 9vh, 110px)",
        left: "var(--cred-margin)",
        right: "var(--cred-margin)",
        maxWidth: portrait ? "none" : "min(48vw, 560px)",
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.4 } }}
    >
      <div
        className="lowercase"
        style={{
          fontWeight: 700,
          fontSize: "clamp(26px, 3.2vw, 52px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.98,
        }}
      >
        {c.cliente.toLowerCase()}.
        {c.projeto && (
          // o espaço fica fora: quebra entre cliente e projeto, nunca
          // dentro do nome do projeto ("camisa / 3")
          <>
            {" "}
            <span style={{ color: "var(--mute-2)", whiteSpace: "nowrap" }}>
              {c.projeto.toLowerCase()}
            </span>
          </>
        )}
      </div>
      <div
        className="font-mono"
        style={{
          color: "var(--mute-3)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginTop: 10,
        }}
      >
        {c.tags.join(" · ")}
      </div>
      {c.sobre && (
        <p
          className="font-mono"
          style={{
            color: "var(--mute-2)",
            fontSize: "clamp(11px, 0.85vw, 13px)",
            lineHeight: 1.55,
            margin: "14px 0 0",
            maxWidth: "42ch",
          }}
        >
          {c.sobre}
        </p>
      )}
      {c.siteSlug && (
        <a
          href={`${SITE_URL}/trabalho/${c.siteSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono"
          style={{
            display: "inline-block",
            marginTop: 14,
            marginRight: 22,
            color: "var(--paper)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            borderBottom: "1px solid var(--mute-3)",
            paddingBottom: 3,
          }}
        >
          ver no site ↗
        </a>
      )}
      {hasVideo && (
        <span style={{ display: "inline-block", marginTop: 14 }}>
          <BotaoAmpliar onClick={() => setAmpliado(true)} />
        </span>
      )}
    </motion.div>
  )

  const Hero = (
    <motion.div
      // no painel vertical o fundo fica à mostra ao lado do filme:
      // preto do deck, não o cinza de "vídeo carregando"
      className={`relative overflow-hidden ${verticalSolo ? "bg-ink" : "bg-ink-3"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7, ease: EASE } }}
    >
      {hasVideo ? (
        /* O filme PREENCHE o quadro — sem tarja, sem cama.
           `center center` e não o crop de rosto: nossos filmes são
           4:5 e 9:16, e o viés para o alto decepava o pé do quadro.
           Quem quiser ver inteiro, amplia.

           Com o ampliado aberto, a mídia daqui SAI do DOM. Mutar não
           bastava: quando a fonte é YouTube quem toca é um <iframe>,
           que nenhum `muted` nosso alcança — dois players do mesmo
           filme e o áudio dobrava. Sem elemento, não há segundo som. */
        !ampliado &&
        (verticalSolo ? (
          <div className="absolute inset-0 flex">
            {/* o espaço ao lado do filme: a imagem do case, ou o preto */}
            <div className="relative min-w-0 flex-1 overflow-hidden">
              {c.fundo && (
                <>
                  <Image
                    src={c.fundo}
                    alt=""
                    fill
                    sizes="70vw"
                    priority
                    className="object-cover"
                    style={{ objectPosition: c.focoFundo ?? "center center" }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0"
                    style={{
                      height: "60%",
                      background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                </>
              )}
            </div>
            <div className="relative h-full shrink-0 overflow-hidden" style={{ aspectRatio: "9 / 16" }}>
              <CredHero src={c.video!} />
            </div>
          </div>
        ) : (
          <CredHero
            src={c.video!}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: c.focoVideo ?? "center center" }}
          />
        ))
      ) : (
        mainImg && (
          <Image
            src={mainImg}
            alt={c.cliente}
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ objectPosition: c.focoFotos ?? FACE_POSITION }}
          />
        )
      )}
      {/* com o filme no painel vertical o texto já está no preto —
          o degradê só escureceria o pé do vídeo */}
      {!verticalSolo && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "55%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}
      {TextBlock}
    </motion.div>
  )

  const Stills = temPainel && (
    <div
      className="grid"
      style={{
        gap: 0,
        background: "var(--ink)",
        ...(portrait
          ? {
              gridTemplateColumns: `repeat(${
                insercao ? 2 : stills.length > 3 ? 2 : stills.length
              }, 1fr)`,
            }
          : {
              gridTemplateColumns: `repeat(${sideCols}, 1fr)`,
              gridTemplateRows: `repeat(${sideRows}, 1fr)`,
            }),
      }}
    >
      {insercao && (
        /* Clipe de bastidor — sempre mudo (o som é do filme do quadro),
           em largura total no topo do painel. */
        <motion.div
          className="relative overflow-hidden"
          style={{ gridColumn: "1 / -1" }}
          initial={{ opacity: 0, x: portrait ? 0 : 20, y: portrait ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.1 } }}
        >
          <video
            src={insercao.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: "45%",
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <span
            className="font-mono uppercase absolute"
            style={{
              left: 16,
              bottom: 14,
              color: "var(--paper)",
              fontSize: 10,
              letterSpacing: "0.22em",
            }}
          >
            (→) {insercao.label}
          </span>
        </motion.div>
      )}
      {stills.map((src, i) => (
        <motion.div
          key={src}
          className="relative overflow-hidden"
          style={
            spanLast && i === stills.length - 1
              ? { gridColumn: "1 / -1" }
              : undefined
          }
          initial={{ opacity: 0, x: portrait ? 0 : 20, y: portrait ? 20 : 0 }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.6, ease: EASE, delay: 0.15 + i * 0.08 },
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="33vw"
            className="object-cover"
            style={{ objectPosition: c.focoFotos ?? FACE_POSITION }}
          />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink text-paper">
      <div
        className="grid h-full w-full"
        style={
          !temPainel
            ? { gridTemplateColumns: "1fr" }
            : portrait
            ? { gridTemplateRows: "60% 40%" }
            : { gridTemplateColumns: "62% 38%" }
        }
      >
        {Hero}
        {Stills}
      </div>
      {hasVideo && (
        <VideoLightbox
          src={c.video!}
          aberto={ampliado}
          onFechar={() => setAmpliado(false)}
        />
      )}
    </div>
  )
}
