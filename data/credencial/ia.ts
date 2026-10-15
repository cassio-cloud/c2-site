import { SITE_URL } from "./cases"

export { SITE_URL }

const L = "/media/credencial/lib2"

export type IACase = {
  id: string
  cliente: string
  projeto: string
  tipo: "100% IA" | "híbrido"
  video: string
  imagens?: string[]
  sobre?: string
  siteSlug?: string
  /**
   * Fora da apresentação por ora — dados e mídia ficam aqui, prontos.
   * Para reativar, apague a linha `standby: true`.
   */
  standby?: true
}

/** Ordem do array = ordem dos slides. */
const todos: IACase[] = [
  {
    id: "baikal",
    cliente: "Golden Lake",
    projeto: "Lançamento Baikal",
    tipo: "híbrido",
    video: "https://youtu.be/_ZZEscSJi5I",
    imagens: [`${L}/ia-baikal/01.jpg`, `${L}/ia-baikal/02.jpg`, `${L}/ia-baikal/03.jpg`],
    sobre: "Lançamento imobiliário para a Multiplan. Produção híbrida — captação real combinada com IA.",
    siteSlug: "ia-baikal",
  },
  {
    id: "goat",
    cliente: "The Goat Collection",
    projeto: "",
    tipo: "100% IA",
    video: `${L}/ia-goat/video.mp4`,
    imagens: [
      `${L}/ia-goat/01.jpg`, `${L}/ia-goat/02.jpg`,
      `${L}/ia-goat/03.png`, `${L}/ia-goat/04.png`,
    ],
    sobre: "Campanha 100% IA. Conceito, geração de imagem/vídeo e pós em estúdio.",
    siteSlug: "ia-goat",
  },
  {
    id: "carrano-ia",
    cliente: "Carrano",
    projeto: "Summer 25",
    tipo: "híbrido",
    video: `${L}/ia-carrano/video.mp4`,
    imagens: [`${L}/ia-carrano/01.jpg`, `${L}/ia-carrano/02.jpg`, `${L}/ia-carrano/03.jpg`],
    sobre: "Produção híbrida — captação real + IA. Moda Summer 25 com craft.",
    siteSlug: "ia-carrano",
  },
  {
    id: "gremio",
    cliente: "Grêmio",
    projeto: "New Balance",
    tipo: "híbrido",
    video: `${L}/ia-gremio/video.mp4`,
    imagens: [
      `${L}/ia-gremio/01.jpg`, `${L}/ia-gremio/02.jpg`, `${L}/ia-gremio/03.jpg`,
      `${L}/ia-gremio/04.jpg`, `${L}/ia-gremio/05.jpg`, `${L}/ia-gremio/06.jpg`,
    ],
    sobre: "Híbrido para lançamento de uniforme. Captação real combinada com IA.",
    siteSlug: "ia-gremio",
  },
  {
    id: "odontoprev",
    cliente: "Odontoprev",
    projeto: "Dia das Mães",
    tipo: "100% IA",
    video: `${L}/ia-odontoprev/video.mp4`,
    imagens: [
      `${L}/ia-odontoprev/01.png`, `${L}/ia-odontoprev/02.png`,
      `${L}/ia-odontoprev/03.png`, `${L}/ia-odontoprev/04.png`,
    ],
    sobre: "Filme 100% gerado por IA. Direção de arte, animação e finalização C2.",
    siteSlug: "ia-odontoprev",
  },
  {
    id: "vbet",
    cliente: "VBET",
    projeto: "Hype",
    tipo: "100% IA",
    video: `${L}/ia-vbet/video.mp4`,
    imagens: [
      `${L}/ia-vbet/01.jpg`, `${L}/ia-vbet/02.jpg`, `${L}/ia-vbet/03.jpg`,
      `${L}/ia-vbet/04.jpg`, `${L}/ia-vbet/05.jpg`, `${L}/ia-vbet/06.jpg`,
    ],
    sobre: "Filme esportivo 100% IA. Conceito visual e finalização C2.",
    siteSlug: "ia-vbet",
  },

  // — stand-by: fora do deck, prontos para voltar —
  {
    id: "byd",
    cliente: "BYD",
    projeto: "King",
    tipo: "100% IA",
    video: "https://youtu.be/0bS00K6SG2g",
    imagens: [
      `${L}/ia-byd/01.png`, `${L}/ia-byd/02.png`, `${L}/ia-byd/03.png`,
      `${L}/ia-byd/04.jpg`, `${L}/ia-byd/05.png`,
    ],
    sobre: "Personal project de Cássio Caberlon — estudo de consistência de produto e movimentos.",
    // a página no site é /trabalho/byd, sem o prefixo ia-
    siteSlug: "byd",
    standby: true,
  },
  {
    id: "legacy",
    cliente: "Legacy",
    projeto: "Natal",
    tipo: "100% IA",
    video: "https://youtube.com/shorts/MIwUKaboaxQ",
    imagens: [],
    sobre: "Filme de Natal 100% IA. Da ideia à entrega, produzido com IA generativa.",
    // a página no site é /trabalho/legacy, sem o prefixo ia-
    siteSlug: "legacy",
    standby: true,
  },
]

/** O que entra na apresentação — deck, preload e montagem do contato. */
export const iaCases: IACase[] = todos.filter((c) => !c.standby)
