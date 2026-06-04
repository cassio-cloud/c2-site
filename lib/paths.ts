import path from "node:path";

/**
 * Resolução de paths de dados/mídia.
 *
 * Tanto em dev quanto em prod, `data/` e `media/` ficam dentro do
 * projeto Next.js (ao lado do `app/`, `lib/`, etc). Em prod standalone
 * o build copia tudo pro bundle final.
 */
export const PROJECT_ROOT = process.cwd();

export const DATA_DIR = path.join(PROJECT_ROOT, "data");
export const MEDIA_DIR = path.join(PROJECT_ROOT, "media");
export const CASES_MEDIA_DIR = path.join(MEDIA_DIR, "cases");

export const CASES_JSON = path.join(DATA_DIR, "cases.json");
export const SITE_JSON = path.join(DATA_DIR, "site.json");
