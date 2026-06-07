// 25 imagens curadas para o mosaico de abertura (slide 03).
// O grid mostra 12 por vez e vai trocando as fotos em loop.
const M = "/media/credencial/mosaico"
export const moodboardImages: string[] = Array.from(
  { length: 25 },
  (_, i) => `${M}/${String(i + 1).padStart(2, "0")}.jpg`,
)
