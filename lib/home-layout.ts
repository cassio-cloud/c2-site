/**
 * Layout do bento da home — espelha index.html legacy.
 *
 * - col: span no grid de 12 colunas
 * - ratio: aspect-ratio do .tile-frame (default "4/5" se omitido)
 * - tag: texto exibido no tile (override do case.tags[0])
 *
 * Mantenho cada slug aqui em vez de derivar do JSON porque o
 * design da home é curado — ordem e tamanhos são decisões editoriais.
 */

import type { MediaItem } from "./types";

export type TileLayout = {
  slug: string;
  col: 4 | 5 | 6 | 7 | 8 | 12;
  ratio?: "1/1" | "4/3" | "16/9" | "21/9" | "4/5";
  tag: string;
  /**
   * Qual mídia vira a capa do tile. Padrão: a primeira do case.
   *
   * O tile não esconde o overlay do YouTube (título e botão de pause), então
   * quando a página do case abre com o filme no YouTube vale dar ao tile um
   * clipe nativo sem mexer na ordem das mídias do case:
   *   "first-video"     o primeiro vídeo nativo do próprio case
   *   { type, src }     um arquivo só pra capa, em public/media/cases/<slug>/
   */
  cover?: "first-video" | MediaItem;
};

/** Cases principais (17 tiles). Ordem é a ordem de exibição. */
export const HOME_BENTO: TileLayout[] = [
  { slug: "keeta",           col: 6, ratio: "4/3", tag: "Campanha", cover: { type: "video", src: "media/cases/keeta/capa.mp4" } },
  { slug: "gremio-camisa-3", col: 6, ratio: "4/3", tag: "Campanha · Híbrido IA", cover: "first-video" },
  { slug: "nomad",    col: 6, ratio: "4/3",  tag: "Campanha" },
  { slug: "gollog",   col: 6, ratio: "4/3",  tag: "Campanha · Institucional" },
  { slug: "barra",    col: 4,                tag: "Campanha" },
  { slug: "unicred",  col: 4,                tag: "Campanha · Conteúdo" },
  { slug: "carrano",  col: 4,                tag: "Campanha · Namorados" },
  { slug: "voa",      col: 6, ratio: "4/3",  tag: "Campanha" },
  { slug: "park",     col: 6, ratio: "4/3",  tag: "Campanha · Institucional" },
  { slug: "golden",   col: 4,                tag: "Campanha" },
  { slug: "bfshow",   col: 4,                tag: "Campanha · Conteúdo" },
  { slug: "vicenza",  col: 4,                tag: "Campanha · Conteúdo" },
  { slug: "viamarte", col: 4,                tag: "Campanha" },
  { slug: "yam",      col: 4,                tag: "Campanha" },
  { slug: "natura",   col: 4,                tag: "Campanha" },
  { slug: "bliss",    col: 6, ratio: "4/3",  tag: "Campanha" },
  { slug: "topper",   col: 6, ratio: "4/3",  tag: "Campanha · Produto" },
];

export type IaGroup = {
  label: string;
  tiles: TileLayout[];
};

/** Seção IA — dois grupos de 2 tiles cada. */
export const HOME_IA: IaGroup[] = [
  {
    label: "100% IA",
    tiles: [
      { slug: "ia-odontoprev", col: 6, ratio: "4/3", tag: "100% IA · Filme 60s" },
      { slug: "ia-goat",       col: 6, ratio: "4/3", tag: "100% IA · Editorial" },
    ],
  },
  {
    label: "Híbrido — captura real + IA",
    tiles: [
      { slug: "ia-carrano", col: 6, tag: "Híbrido · Captura real + IA" },
      { slug: "ia-gremio",  col: 6, tag: "Híbrido · Direção real + IA" },
    ],
  },
];
