/**
 * Fonte única de verdade para tags.
 *
 * Substitui o copy-paste de TAG_LABELS/normTag/fmtTag que existia em
 * index.html, trabalho.html e admin.html no site legacy.
 *
 * Slugs são ASCII kebab-case — fica seguro pra usar como searchParam,
 * filename e dataset attribute. Labels podem ter acento/case bonito.
 */

export const TAG_LABELS = {
  campanha: "Campanha",
  conteudo: "Conteúdo",
  "100-ia": "100% IA",
  "hibrido-ia": "Híbrido IA",
  "captacao-e-motion": "Captação e Motion",
} as const;

export type CanonicalTag = keyof typeof TAG_LABELS;

/** Tags que aparecem no filtro de `/trabalho`, em ordem de exibição. */
export const FILTER_TAGS: CanonicalTag[] = [
  "campanha",
  "conteudo",
  "captacao-e-motion",
  "100-ia",
  "hibrido-ia",
];

/**
 * Normaliza qualquer string em slug ASCII kebab-case.
 *   "100% IA" → "100-ia"
 *   "Híbrido IA" → "hibrido-ia"
 */
export function normTag(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Retorna label bonito; cai pro próprio slug capitalizado se desconhecido. */
export function fmtTag(slug: string): string {
  if (slug in TAG_LABELS) return TAG_LABELS[slug as CanonicalTag];
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
