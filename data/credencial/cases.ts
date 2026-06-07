/** Base do site institucional — cada case linka pra /trabalho/{siteSlug}. */
export const SITE_URL = "https://c2-site.vercel.app"

const L = "/media/credencial/lib2"

export type Case = {
  id: string
  cliente: string
  projeto?: string
  tags: ("campanha" | "conteúdo" | "ia")[]
  /** Todas as imagens (01 = hero quando não há vídeo). */
  imagens: string[]
  video?: string
  sobre?: string
  siteSlug?: string
}

export const cases: Case[] = [
  {
    id: "unicred",
    cliente: "Unicred",
    projeto: "ZIIN",
    tags: ["campanha", "conteúdo"],
    video: "https://youtu.be/Qjof_TJGwoM",
    sobre: "Campanha de investimentos. Direção, captação e finalização C2 em estúdio próprio.",
    siteSlug: "unicred",
    imagens: [`${L}/unicred/01.jpg`, `${L}/unicred/02.jpg`, `${L}/unicred/03.jpg`],
  },
  {
    id: "nomad",
    cliente: "Nomad",
    projeto: "Cartão Global",
    tags: ["campanha"],
    sobre: "Lançamento do cartão global. Conceito, produção audiovisual e entrega multi-formato.",
    siteSlug: "nomad",
    imagens: [
      `${L}/nomad/01.jpg`, `${L}/nomad/02.jpg`, `${L}/nomad/03.jpg`,
      `${L}/nomad/04.jpg`, `${L}/nomad/05.jpg`,
    ],
  },
  {
    id: "gollog",
    cliente: "Gollog",
    projeto: "Cargas",
    tags: ["campanha"],
    sobre: "Filme institucional de logística. Direção e finalização C2.",
    siteSlug: "gollog",
    imagens: [
      `${L}/gollog/01.jpg`, `${L}/gollog/02.jpg`, `${L}/gollog/03.jpg`, `${L}/gollog/04.jpg`,
    ],
  },
  {
    id: "barrashopping",
    cliente: "BarraShopping Sul",
    projeto: "Institucional 2026",
    tags: ["campanha"],
    video: "https://youtu.be/qjhiGOqEywA",
    sobre: "Institucional do shopping. Campanha audiovisual com direção apurada e craft.",
    siteSlug: "barra",
    imagens: [`${L}/barra/01.jpg`, `${L}/barra/02.jpg`, `${L}/barra/03.jpg`],
  },
  {
    id: "carrano",
    cliente: "Carrano",
    projeto: "True Love",
    tags: ["campanha", "conteúdo"],
    video: `${L}/carrano/video.mp4`,
    sobre: "Campanha de moda. Produção de imagem e vídeo, do conceito ao entregável.",
    siteSlug: "carrano",
    imagens: [`${L}/carrano/01.jpg`, `${L}/carrano/02.jpg`, `${L}/carrano/03.jpg`],
  },
  {
    id: "voa",
    cliente: "VOA Telecom",
    tags: ["campanha"],
    sobre: "Campanha de marca para telecom. Direção, captação e edição C2.",
    siteSlug: "voa",
    imagens: [
      `${L}/voa/01.jpg`, `${L}/voa/02.jpg`, `${L}/voa/03.jpg`,
      `${L}/voa/04.jpg`, `${L}/voa/05.jpg`, `${L}/voa/06.jpg`,
    ],
  },
  {
    id: "unidasul",
    cliente: "Unidasul",
    projeto: "Rissul",
    tags: ["conteúdo"],
    sobre: "Conteúdo always-on de varejo. Produção contínua de imagem e vídeo de produto.",
    siteSlug: "unidasul",
    imagens: [
      `${L}/unidasul/01.jpg`, `${L}/unidasul/02.jpg`, `${L}/unidasul/03.jpg`,
      `${L}/unidasul/04.jpg`, `${L}/unidasul/05.jpg`, `${L}/unidasul/06.jpg`,
      `${L}/unidasul/07.jpg`,
    ],
  },
  {
    id: "yam",
    cliente: "Yam Kombucha",
    tags: ["campanha"],
    video: `${L}/yam/video.mp4`,
    sobre: "Campanha de produto. Direção de arte, foto e vídeo em estúdio próprio.",
    siteSlug: "yam",
    imagens: [
      `${L}/yam/01.jpg`, `${L}/yam/02.jpg`, `${L}/yam/03.jpg`,
      `${L}/yam/04.jpg`, `${L}/yam/05.jpg`,
    ],
  },
  {
    id: "goldenlake",
    cliente: "Golden Lake",
    tags: ["campanha"],
    video: `${L}/golden/video.mp4`,
    sobre: "Campanha imobiliária de alto padrão. Imagem e filme com acabamento premium.",
    siteSlug: "golden",
    imagens: [
      `${L}/golden/01.jpg`, `${L}/golden/02.jpg`, `${L}/golden/03.jpg`, `${L}/golden/04.jpg`,
    ],
  },
  {
    id: "parkshopping",
    cliente: "ParkShopping Canoas",
    projeto: "Institucional",
    tags: ["campanha"],
    video: "https://youtu.be/HBcURorfxjg",
    sobre: "Institucional do shopping. Campanha audiovisual com direção e finalização C2.",
    siteSlug: "park",
    imagens: [
      `${L}/park/01.jpg`, `${L}/park/02.jpg`, `${L}/park/03.jpg`,
      `${L}/park/04.jpg`, `${L}/park/05.jpg`,
    ],
  },
]
