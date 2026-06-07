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
}

export const iaCases: IACase[] = [
  // — 100% IA —
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
    id: "vbet",
    cliente: "VBET",
    projeto: "Hyper",
    tipo: "100% IA",
    video: `${L}/ia-vbet/video.mp4`,
    imagens: [
      `${L}/ia-vbet/01.jpg`, `${L}/ia-vbet/02.jpg`, `${L}/ia-vbet/03.jpg`,
      `${L}/ia-vbet/04.jpg`, `${L}/ia-vbet/05.jpg`, `${L}/ia-vbet/06.jpg`,
    ],
    sobre: "Filme esportivo 100% IA. Conceito visual e finalização C2.",
    siteSlug: "ia-vbet",
  },
  {
    id: "byd",
    cliente: "BYD",
    projeto: "King",
    tipo: "100% IA",
    video: `${L}/ia-byd/video.mp4`,
    imagens: [
      `${L}/ia-byd/01.png`, `${L}/ia-byd/02.png`, `${L}/ia-byd/03.png`,
      `${L}/ia-byd/04.jpg`, `${L}/ia-byd/05.png`,
    ],
    sobre: "Lançamento automotivo 100% IA. Geração de imagem e vídeo em pipeline próprio.",
    siteSlug: "ia-byd",
  },
  {
    id: "legacy",
    cliente: "Legacy",
    projeto: "Natal",
    tipo: "100% IA",
    video: `${L}/ia-legacy/video.mp4`,
    imagens: [],
    sobre: "Filme de Natal 100% IA. Da ideia à entrega, produzido com IA generativa.",
    siteSlug: "ia-legacy",
  },
  // — híbridas —
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
]
