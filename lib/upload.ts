import { promises as fs } from "node:fs";
import path from "node:path";
import { CASES_MEDIA_DIR, MEDIA_DIR } from "./paths";

/**
 * Grava um File do FormData em disco no path resolvido.
 * Retorna { publicPath, mediaType } pronto pra inserir no JSON.
 */
export async function saveUploadedFile(
  file: File,
  input: Omit<ResolveInput, "originalName">,
): Promise<{ publicPath: string; mediaType: "image" | "video" }> {
  const resolved = await resolveUpload({
    ...input,
    originalName: file.name,
  });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(resolved.dir, resolved.filename), buf);
  const ext = path.extname(resolved.filename).toLowerCase();
  const mediaType = [".mp4", ".mov", ".webm"].includes(ext) ? "video" : "image";
  return { publicPath: resolved.publicPath, mediaType };
}

const SAFE_NAME_CHARS = /[^a-z0-9-]/gi;

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
 * Port da função resolveUpload() de server.js do site legacy.
 *
 * Tipos suportados:
 *   case   → media/cases/<slug>/NN.<ext>   (numeração sequencial)
 *   hero   → media/reel.<ext>              (substitui o arquivo)
 *   logos  → media/logos/<name>.<ext>      (substitui)
 *   team   → media/team/<name>.<ext>       (substitui)
 */

export type UploadType = "case" | "hero" | "logos" | "team";

export type ResolvedUpload = {
  /** Diretório absoluto onde gravar. */
  dir: string;
  /** Nome final do arquivo (já com extensão). */
  filename: string;
  /** Caminho público relativo, ex: "media/cases/carrano/03.jpg". */
  publicPath: string;
};

export type ResolveInput = {
  type: UploadType;
  slug?: string;
  name?: string;
  originalName: string;
};

const SAFE_CHARS = /[^a-z0-9-]/gi;

function getExt(originalName: string): string {
  return path.extname(originalName).toLowerCase() || ".jpg";
}

export async function resolveUpload(input: ResolveInput): Promise<ResolvedUpload> {
  const ext = getExt(input.originalName);

  if (input.type === "case") {
    const slug = (input.slug ?? "").replace(SAFE_CHARS, "");
    if (!slug) throw new Error("slug required");

    const dir = path.join(CASES_MEDIA_DIR, slug);
    await fs.mkdir(dir, { recursive: true });

    // Sequencial: pega o menor número não usado (preenche buracos).
    const existing = await fs.readdir(dir).catch(() => []);
    const used = new Set(
      existing
        .filter((f) => !f.startsWith("."))
        .map((f) => Number.parseInt(f.split(".")[0], 10))
        .filter((n) => !Number.isNaN(n)),
    );
    let n = 1;
    while (used.has(n)) n++;
    const filename = String(n).padStart(2, "0") + ext;
    return {
      dir,
      filename,
      publicPath: `media/cases/${slug}/${filename}`,
    };
  }

  if (input.type === "hero") {
    return {
      dir: MEDIA_DIR,
      filename: `reel${ext}`,
      publicPath: `media/reel${ext}`,
    };
  }

  if (input.type === "logos" || input.type === "team") {
    const name = (input.name ?? "").replace(SAFE_CHARS, "");
    if (!name) throw new Error(`name required for ${input.type}`);

    const dir = path.join(MEDIA_DIR, input.type);
    await fs.mkdir(dir, { recursive: true });
    const filename = `${name}${ext}`;
    return {
      dir,
      filename,
      publicPath: `media/${input.type}/${filename}`,
    };
  }

  // Inalcançável dado UploadType, mas o TS não consegue inferir.
  throw new Error(`invalid type: ${input.type as string}`);
}

/** Remove um arquivo de mídia. Path precisa começar com "media/". */
export async function deleteMedia(src: string): Promise<void> {
  const safe = path.normalize(src).replace(/^(\.\.[/\\])+/, "");
  if (!safe.startsWith("media/")) throw new Error("invalid path");
  const full = path.join(path.dirname(MEDIA_DIR), safe);
  await fs.unlink(full).catch((err: NodeJS.ErrnoException) => {
    if (err.code !== "ENOENT") throw err;
  });
}
