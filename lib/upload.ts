import path from "node:path";
import {
  CASES_MEDIA_DIR,
  MEDIA_DIR,
} from "./paths";
import {
  deleteStored,
  isBlobMode,
  listLocalFiles,
  saveBuffer,
  type StoredFile,
} from "./storage";

/**
 * Resolve onde uma mídia vai ser gravada e qual será sua URL/path final.
 *
 * Tipos suportados:
 *   case   → media/cases/<slug>/NN.<ext>   (numeração sequencial)
 *   hero   → media/reel.<ext>              (substitui o arquivo)
 *   logos  → media/logos/<name>.<ext>      (substitui)
 *   team   → media/team/<name>.<ext>       (substitui)
 *
 * Em prod (Vercel Blob), o `src` retornado já é a URL absoluta do Blob.
 * Em dev, é um path relativo (`media/cases/carrano/01.jpg`).
 */

export type UploadType = "case" | "hero" | "logos" | "team";

export type ResolveInput = {
  type: UploadType;
  slug?: string;
  name?: string;
  originalName: string;
};

const SAFE_CHARS = /[^a-z0-9-]/gi;
const SAFE_NAME_CHARS = /[^a-z0-9-]/gi;

function getExt(originalName: string): string {
  return path.extname(originalName).toLowerCase() || ".jpg";
}

/** Sluggifica nomes vindos do admin (pra logo/team filename). */
export function safeName(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(SAFE_NAME_CHARS, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calcula o nome do arquivo e os paths/keys de armazenamento
 * (sem gravar nada ainda — só decide a estrutura).
 */
async function planUpload(input: ResolveInput): Promise<{
  blobKey: string;
  localRelativePath: string;
  filename: string;
}> {
  const ext = getExt(input.originalName);

  if (input.type === "case") {
    const slug = (input.slug ?? "").replace(SAFE_CHARS, "");
    if (!slug) throw new Error("slug required");

    let n = 1;
    if (!isBlobMode()) {
      const dir = path.join(CASES_MEDIA_DIR, slug);
      const existing = await listLocalFiles(dir);
      const used = new Set(
        existing
          .filter((f) => !f.startsWith("."))
          .map((f) => Number.parseInt(f.split(".")[0], 10))
          .filter((v) => !Number.isNaN(v)),
      );
      while (used.has(n)) n++;
    } else {
      // No Blob não temos lista local; usa timestamp pra não colidir.
      n = Number(String(Date.now()).slice(-4));
    }
    const filename = String(n).padStart(2, "0") + ext;
    const localRelativePath = `media/cases/${slug}/${filename}`;
    const blobKey = `c2/${localRelativePath}`;
    return { blobKey, localRelativePath, filename };
  }

  if (input.type === "hero") {
    const filename = `reel${ext}`;
    return {
      blobKey: `c2/media/${filename}`,
      localRelativePath: `media/${filename}`,
      filename,
    };
  }

  if (input.type === "logos" || input.type === "team") {
    const name = (input.name ?? "").replace(SAFE_CHARS, "");
    if (!name) throw new Error(`name required for ${input.type}`);
    const filename = `${name}${ext}`;
    return {
      blobKey: `c2/media/${input.type}/${filename}`,
      localRelativePath: `media/${input.type}/${filename}`,
      filename,
    };
  }

  throw new Error(`invalid type: ${input.type as string}`);
}

function guessContentType(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}

/**
 * Grava um File do FormData no storage configurado.
 * Retorna `{ publicPath, mediaType }` pronto pra inserir no JSON.
 */
export async function saveUploadedFile(
  file: File,
  input: Omit<ResolveInput, "originalName">,
): Promise<{ publicPath: string; mediaType: "image" | "video"; storageKey: string }> {
  const plan = await planUpload({ ...input, originalName: file.name });
  const ext = path.extname(plan.filename).toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = guessContentType(ext);
  const stored: StoredFile = await saveBuffer(
    plan.blobKey,
    plan.localRelativePath,
    buf,
    contentType,
  );
  const mediaType =
    [".mp4", ".mov", ".webm"].includes(ext) ? "video" : "image";
  return {
    publicPath: stored.src,
    storageKey: stored.storageKey,
    mediaType,
  };
}

/** Remove um arquivo de mídia. Aceita Blob URL ou path local. */
export async function deleteMedia(srcOrPath: string): Promise<void> {
  await deleteStored(srcOrPath);
}

// Re-export pra compat com importações antigas (resolveUpload era usado direto)
export { MEDIA_DIR };
