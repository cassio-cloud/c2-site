"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { moodboardImages } from "@/data/credencial/moodboard"
import { Grain } from "../Grain"
import { usePortrait, FACE_POSITION } from "../Editorial"

const EASE = [0.32, 0.72, 0, 1] as const
const DESKTOP_CELLS = 12 // 4 × 3
const PORTRAIT_CELLS = 9 // 3 × 3

/**
 * Mosaico de abertura — mostra N células e vai trocando as fotos em loop
 * (crossfade), já que há mais imagens (25) que células.
 */
export function SlideMoodboard() {
  const portrait = usePortrait()
  const cells = portrait ? PORTRAIT_CELLS : DESKTOP_CELLS
  const pool = moodboardImages

  // slots = imagens atualmente visíveis (índices no pool)
  const [slots, setSlots] = useState<number[]>(() =>
    Array.from({ length: cells }, (_, i) => i % pool.length),
  )
  const nextRef = useRef(cells) // próximo índice do pool a entrar

  // re-inicializa quando muda o número de células (orientação)
  useEffect(() => {
    setSlots(Array.from({ length: cells }, (_, i) => i % pool.length))
    nextRef.current = cells % pool.length
  }, [cells, pool.length])

  // troca uma célula aleatória a cada intervalo
  useEffect(() => {
    if (pool.length <= cells) return
    const id = setInterval(() => {
      setSlots((prev) => {
        const next = [...prev]
        const slot = Math.floor(Math.random() * next.length)
        // pega a próxima imagem que não esteja visível
        let guard = 0
        let cand = nextRef.current
        while (next.includes(cand) && guard < pool.length) {
          cand = (cand + 1) % pool.length
          guard++
        }
        next[slot] = cand
        nextRef.current = (cand + 1) % pool.length
        return next
      })
    }, 1400)
    return () => clearInterval(id)
  }, [cells, pool.length])

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: portrait ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          gridTemplateRows: portrait ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
          gap: 0,
        }}
      >
        {slots.map((imgIdx, slot) => (
          <div key={slot} className="relative overflow-hidden bg-ink-3">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={imgIdx}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
              >
                <Image
                  src={pool[imgIdx]}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover"
                  style={{ objectPosition: FACE_POSITION }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <Grain />
    </div>
  )
}
