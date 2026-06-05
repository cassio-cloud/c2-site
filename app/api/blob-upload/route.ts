import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";

/**
 * Endpoint para client-side uploads diretos ao Vercel Blob.
 *
 * Permite arquivos até ~5GB (vs ~4.5MB do Server Action no Hobby tier).
 * O client chama `upload()` do `@vercel/blob/client`, que faz POST aqui
 * pra obter um token assinado, e em seguida envia o arquivo direto
 * ao Blob CDN sem passar pelo runtime do Vercel.
 *
 * Auth: exige sessão admin via NextAuth.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/avif",
          "image/gif",
          "image/svg+xml",
          "video/mp4",
          "video/quicktime",
          "video/webm",
        ],
        // 500MB hard cap por arquivo
        maximumSizeInBytes: 500 * 1024 * 1024,
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
      // Não precisamos fazer nada quando o upload completa —
      // o client chama uma Server Action separada (attachMedia)
      // pra atualizar o JSON do case com a URL final.
      onUploadCompleted: async () => {},
    });
    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "upload failed" },
      { status: 400 },
    );
  }
}
