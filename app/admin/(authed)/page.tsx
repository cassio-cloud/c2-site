import { revalidatePath } from "next/cache";
import { readCases, writeCases } from "@/lib/cases";
import { deleteMedia } from "@/lib/upload";
import { normTag } from "@/lib/tags";
import {
  CasesListClient,
  type OrderPayload,
} from "@/components/admin/CasesListClient";
import type { Case } from "@/lib/types";

export default async function AdminCasesPage() {
  const cases = await readCases();

  /** Persiste ordem + featured (batch). */
  async function saveOrder(payload: OrderPayload) {
    "use server";
    const all = await readCases();
    const map = new Map(all.map((c) => [c.slug, c]));
    const reordered: Case[] = [];
    for (const { slug, featured } of payload) {
      const c = map.get(slug);
      if (c) reordered.push({ ...c, featured });
    }
    // Apêndice qualquer slug que tenha sido criado entre o load e save
    for (const c of all) {
      if (!payload.some((p) => p.slug === c.slug)) reordered.push(c);
    }
    await writeCases(reordered);
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
  }

  async function deleteCase(slug: string) {
    "use server";
    const all = await readCases();
    const target = all.find((c) => c.slug === slug);
    if (target) {
      for (const m of target.media) {
        if (m.type !== "embed") await deleteMedia(m.src).catch(() => {});
      }
    }
    await writeCases(all.filter((c) => c.slug !== slug));
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
  }

  /**
   * Cria um novo case e retorna o slug.
   * Não usa server-side redirect — o client navega após receber
   * o slug, depois de pequeno delay pra garantir que o Blob
   * já propagou a escrita (eventual consistency).
   */
  async function addCase(
    rawSlug: string,
    title: string,
    tagsRaw: string,
  ): Promise<
    | { ok: true; newCase: Case }
    | { ok: false; error: string }
  > {
    "use server";
    const slug = normTag(rawSlug.trim());
    const cleanTitle = title.trim();
    if (!slug) return { ok: false, error: "Slug obrigatório" };
    if (!cleanTitle) return { ok: false, error: "Título obrigatório" };

    try {
      const all = await readCases();
      if (all.some((c) => c.slug === slug)) {
        return { ok: false, error: `Slug "${slug}" já existe` };
      }

      const newCase: Case = {
        slug,
        title: cleanTitle,
        client: "",
        agency: "",
        director: "",
        year: String(new Date().getFullYear()),
        description: "",
        media: [],
        tags: tagsRaw.trim()
          ? tagsRaw.split(/[,\s]+/).map(normTag).filter(Boolean)
          : [],
        featured: false,
      };

      await writeCases([newCase, ...all]);
      revalidatePath("/");
      revalidatePath("/trabalho");
      revalidatePath("/admin");
      return { ok: true, newCase };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Falha ao criar case",
      };
    }
  }

  return (
    <CasesListClient
      initial={cases}
      actions={{ saveOrder, deleteCase, addCase }}
    />
  );
}
