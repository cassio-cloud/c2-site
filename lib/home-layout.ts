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

export type TileLayout = {
  slug: string;
  col: 4 | 5 | 6 | 7 | 8 | 12;
  ratio?: "1/1" | "4/3" | "16/9" | "21/9" | "4/5";
  tag: string;
};

/** Cases principais (15 tiles). Ordem é a ordem de exibição. */
export const HOME_BENTO: TileLayout[] = [
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
