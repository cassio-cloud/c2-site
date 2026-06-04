import path from "node:path";

/**
 * Resolução de paths de dados/mídia.
 *
 * - `data/` (JSONs do site): em prod com Vercel Blob, lemos/escrevemos
 *   no Blob; em dev (sem token), usamos disco em `data/` no projeto.
 * - `public/media/`: pasta servida estaticamente pela Vercel CDN.
 *   Uploads novos em prod sobem pro Blob e geram URLs absolutas
 *   guardadas direto nos JSONs.
 */
export const PROJECT_ROOT = process.cwd();

export const DATA_DIR = path.join(PROJECT_ROOT, "data");
export const MEDIA_DIR = path.join(PROJECT_ROOT, "public", "media");
export const CASES_MEDIA_DIR = path.join(MEDIA_DIR, "cases");

export const CASES_JSON = path.join(DATA_DIR, "cases.json");
export const SITE_JSON = path.join(DATA_DIR, "site.json");
