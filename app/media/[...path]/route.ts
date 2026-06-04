import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize, sep } from "node:path";
import type { ReadStream } from "node:fs";
import { MEDIA_DIR } from "@/lib/paths";

/**
 * Serve arquivos de `media/` (parent dir em dev, bundle local em prod).
 *
 * Suporta byte-range requests para vídeos (essencial pra seek e
 * autoplay sem buffering). Defines cache-control imutável agressivo
 * porque mídias são versionadas pelo path (substituir = novo arquivo).
 */

type Ctx = { params: Promise<{ path: string[] }> };

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

function safeJoin(parts: string[]): string | null {
  // Bloqueia traversal: nenhuma parte pode conter "..".
  if (parts.some((p) => !p || p === "." || p === "..")) return null;
  const rel = parts.join("/");
  const full = normalize(join(MEDIA_DIR, rel));
  if (!full.startsWith(MEDIA_DIR + sep) && full !== MEDIA_DIR) return null;
  return full;
}

function getMime(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return "application/octet-stream";
  return MIME[filename.slice(dot).toLowerCase()] ?? "application/octet-stream";
}

function streamToWeb(stream: ReadStream): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("data", (chunk: string | Buffer) => {
        const buf =
          typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
        controller.enqueue(new Uint8Array(buf));
      });
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });
}

export async function GET(req: Request, ctx: Ctx) {
  const { path: parts } = await ctx.params;
  const full = safeJoin(parts);
  if (!full) return new Response("Not found", { status: 404 });

  let info;
  try {
    info = await stat(full);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!info.isFile()) return new Response("Not found", { status: 404 });

  const mime = getMime(full);
  const size = info.size;
  const range = req.headers.get("range");

  const cacheControl = "public, max-age=31536000, immutable";

  if (range && /^bytes=/.test(range)) {
    const [startStr, endStr] = range.replace("bytes=", "").split("-");
    const start = Number.parseInt(startStr, 10);
    const end = endStr ? Number.parseInt(endStr, 10) : size - 1;
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= size) {
      return new Response("Range not satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const stream = createReadStream(full, { start, end });
    return new Response(streamToWeb(stream), {
      status: 206,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      },
    });
  }

  const stream = createReadStream(full);
  return new Response(streamToWeb(stream), {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
    },
  });
}
