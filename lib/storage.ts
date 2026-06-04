/**
 * Abstração de storage com fallback automático:
 *
 * - **Prod (Vercel)** — com `BLOB_READ_WRITE_TOKEN`, lê/escreve no Vercel
 *   Blob. JSONs ficam no Blob, uploads de mídia retornam URL absoluta.
 * - **Dev local** — sem token, usa o disco em `./data/` e `./public/media/`.
 *
 * Esta camada permite que o admin (Server Actions) escreva sem se
 * importar com o ambiente.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { del, head, put } from "@vercel/blob";
import { CASES_JSON, MEDIA_DIR, SITE_JSON } from "./paths";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

/** Chaves dos JSONs no Blob (caminho dentro do store). */
export const BLOB_KEYS = {
  cases: "c2/data/cases.json",
  site: "c2/data/site.json",
} as const;

type JsonKey = (typeof BLOB_KEYS)[keyof typeof BLOB_KEYS];

// ── JSONs ────────────────────────────────────────────────────────────

/**
 * Lê JSON. Em prod tenta Blob primeiro; se não existir, faz seed
 * a partir do arquivo bundlado em `data/`. Garante boot funcional
 * mesmo antes do primeiro write no Blob.
 */
export async function readJsonKey<T>(key: JsonKey, fallbackPath: string): Promise<T> {
  if (useBlob) {
    try {
      const info = await head(key);
      const res = await fetch(info.url, { cache: "no-store" });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // Blob não existe ainda → segue pro fallback bundlado
    }
  }
  const text = await fs.readFile(fallbackPath, "utf8");
  return JSON.parse(text) as T;
}

/** Escreve JSON. Em prod vai pro Blob; em dev vai pro disco. */
export async function writeJsonKey<T>(
  key: JsonKey,
  fallbackPath: string,
  data: T,
): Promise<void> {
  const text = JSON.stringify(data, null, 2);
  if (useBlob) {
    await put(key, text, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0, // JSONs mudam — não cachear
    });
    return;
  }
  await fs.writeFile(fallbackPath, text, "utf8");
}

export const cases = {
  read: <T>() => readJsonKey<T>(BLOB_KEYS.cases, CASES_JSON),
  write: <T>(data: T) => writeJsonKey(BLOB_KEYS.cases, CASES_JSON, data),
};

export const site = {
  read: <T>() => readJsonKey<T>(BLOB_KEYS.site, SITE_JSON),
  write: <T>(data: T) => writeJsonKey(BLOB_KEYS.site, SITE_JSON, data),
};

// ── Binary uploads (mídia) ──────────────────────────────────────────

export type StoredFile = {
  /** URL absoluta (Blob) ou path relativo (`media/...` em dev). */
  src: string;
  /** Pra deletar depois (Blob URL ou path relativo). */
  storageKey: string;
};

/**
 * Salva um buffer de arquivo. Em prod, sobe pro Blob e devolve URL
 * absoluta. Em dev, escreve em `public/media/...` e devolve path
 * relativo (Next serve estaticamente).
 */
export async function saveBuffer(
  blobKey: string, // ex: "c2/media/cases/carrano/01.jpg"
  localRelativePath: string, // ex: "media/cases/carrano/01.jpg" (sem `public/`)
  buf: Buffer,
  contentType: string,
): Promise<StoredFile> {
  if (useBlob) {
    const result = await put(blobKey, buf, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return { src: result.url, storageKey: result.url };
  }
  // Dev: grava em public/media/...
  const full = path.join(MEDIA_DIR, localRelativePath.replace(/^media\//, ""));
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
  return { src: localRelativePath, storageKey: localRelativePath };
}

/** Apaga uma mídia (Blob URL ou path local). */
export async function deleteStored(src: string): Promise<void> {
  if (!src) return;
  if (src.startsWith("http")) {
    if (!useBlob) return;
    await del(src).catch(() => {});
    return;
  }
  // Local: media/cases/carrano/01.jpg
  const safe = path.normalize(src).replace(/^(\.\.[/\\])+/, "");
  if (!safe.startsWith("media/")) return;
  const full = path.join(
    MEDIA_DIR,
    safe.replace(/^media\//, ""),
  );
  await fs.unlink(full).catch(() => {});
}

/**
 * Lista existentes no diretório de mídia (apenas dev local).
 * Em prod usamos numeração baseada nos slots no JSON do case.
 */
export async function listLocalFiles(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export function isBlobMode(): boolean {
  return useBlob;
}
