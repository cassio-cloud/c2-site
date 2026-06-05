import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCase, readCases, writeCases } from "@/lib/cases";
import { deleteMedia, saveUploadedFile } from "@/lib/upload";
import { isBlobMode } from "@/lib/storage";
import { CaseEditorClient, type CaseEditorPayload } from "@/components/admin/CaseEditorClient";
import type { Case, MediaItem } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export default async function CaseEditorPage(props: Props) {
  const { slug } = await props.params;
  const c2case = await getCase(slug);
  if (!c2case) notFound();

  /** Bound aos dados atuais — salvar payload completo. */
  async function save(payload: CaseEditorPayload) {
    "use server";
    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) throw new Error("Case não encontrado");

    // Detecta mídias removidas pelo usuário e apaga do storage.
    const oldSrcs = new Set(all[idx].media.map((m) => m.src));
    const newSrcs = new Set(payload.media.map((m) => m.src));
    const removed = [...oldSrcs].filter((s) => !newSrcs.has(s));
    for (const src of removed) {
      // Não apaga embeds (não estão no nosso storage).
      const old = all[idx].media.find((m) => m.src === src);
      if (old && old.type !== "embed") {
        await deleteMedia(src).catch(() => {});
      }
    }

    const next: Case = {
      ...all[idx],
      title: payload.title,
      client: payload.client,
      agency: payload.agency,
      director: payload.director,
      year: payload.year,
      description: payload.description,
      tags: payload.tags,
      featured: payload.featured,
      media: payload.media,
    };
    all[idx] = next;
    await writeCases(all);

    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
    revalidatePath("/admin");
  }

  /**
   * Upload via Server Action (modo legado, ainda usado em DEV local
   * sem Blob e como fallback). Limitado a 4.5MB na Vercel Hobby.
   */
  async function uploadFiles(formData: FormData): Promise<MediaItem[]> {
    "use server";
    const files = formData.getAll("files") as File[];
    const valid = files.filter((f) => f && typeof f === "object" && f.size > 0);
    if (valid.length === 0) return [];

    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) throw new Error("Case não encontrado");

    const added: MediaItem[] = [];
    for (const file of valid) {
      const { publicPath, mediaType } = await saveUploadedFile(file, {
        type: "case",
        slug,
      });
      const item: MediaItem = { type: mediaType, src: publicPath };
      added.push(item);
      all[idx].media.push(item);
    }
    await writeCases(all);

    revalidatePath("/");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
    return added;
  }

  /**
   * Anexa uma mídia que JÁ está no Blob (subiu via client upload).
   * Recebe só metadata leve — não atinge o limite de 4.5MB do
   * Server Action, então arquivos grandes funcionam.
   */
  async function attachMedia(items: MediaItem[]): Promise<void> {
    "use server";
    if (!Array.isArray(items) || items.length === 0) return;
    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) throw new Error("Case não encontrado");
    all[idx].media.push(...items);
    await writeCases(all);

    revalidatePath("/");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
  }

  async function deleteCase() {
    "use server";
    const all = await readCases();
    const target = all.find((c) => c.slug === slug);
    if (target) {
      // Apaga todas as mídias locais (embeds não têm storage).
      for (const m of target.media) {
        if (m.type !== "embed") await deleteMedia(m.src).catch(() => {});
      }
    }
    await writeCases(all.filter((c) => c.slug !== slug));
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <CaseEditorClient
      slug={slug}
      initial={c2case}
      blobMode={isBlobMode()}
      actions={{ save, uploadFiles, attachMedia, deleteCase }}
    />
  );
}
