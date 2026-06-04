/**
 * SIZE_PATTERN cíclico para `/trabalho`.
 *
 * Espelha o padrão do trabalho.html legacy: cada 18 tiles formam
 * um ciclo (6 linhas variadas que sempre somam 12 cols). Conforme
 * mais cases entram, o padrão se repete preservando a hierarquia
 * visual sem precisar curadoria manual.
 */

export type WorkTileSize = {
  col: 4 | 6 | 8 | 12;
  ratio: "1/1" | "4/3" | "4/5" | "16/9" | "21/9";
};

export const SIZE_PATTERN: WorkTileSize[] = [
  { col: 6, ratio: "4/3" }, // row 1 — 6 + 6
  { col: 6, ratio: "4/3" },

  { col: 4, ratio: "4/5" }, // row 2 — 4 + 4 + 4
  { col: 4, ratio: "4/5" },
  { col: 4, ratio: "4/5" },

  { col: 8, ratio: "16/9" }, // row 3 — 8 + 4
  { col: 4, ratio: "4/5" },

  { col: 4, ratio: "4/5" }, // row 4 — 4 + 4 + 4
  { col: 4, ratio: "4/5" },
  { col: 4, ratio: "4/5" },

  { col: 6, ratio: "4/3" }, // row 5 — 6 + 6
  { col: 6, ratio: "4/3" },

  { col: 4, ratio: "4/5" }, // row 6 — 4 + 4 + 4
  { col: 4, ratio: "4/5" },
  { col: 4, ratio: "4/5" },

  { col: 4, ratio: "1/1" }, // row 7 — variação com square
  { col: 4, ratio: "4/5" },
  { col: 4, ratio: "4/5" },
];

/** Pega o tamanho do tile no índice i, respeitando o ciclo. */
export function sizeAt(i: number): WorkTileSize {
  return SIZE_PATTERN[i % SIZE_PATTERN.length];
}
