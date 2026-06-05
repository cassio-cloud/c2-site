import { redirect } from "next/navigation";
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

  async function addCase(formData: FormData) {
    "use server";
    const rawSlug = String(formData.get("slug") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const tagsRaw = String(formData.get("tags") ?? "").trim();
    const slug = normTag(rawSlug);
    if (!slug || !title) return;

    const all = await readCases();
    if (all.some((c) => c.slug === slug)) {
      throw new Error(`Slug "${slug}" já existe`);
    }

    const newCase: Case = {
      slug,
      title,
      client: "",
      agency: "",
      director: "",
      year: String(new Date().getFullYear()),
      description: "",
      media: [],
      tags: tagsRaw
        ? tagsRaw.split(/[,\s]+/).map(normTag).filter(Boolean)
        : [],
      featured: false,
    };

    await writeCases([newCase, ...all]);
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
    redirect(`/admin/cases/${slug}`);
  }

  return (
    <CasesListClient
      initial={cases}
      actions={{ saveOrder, deleteCase, addCase }}
    />
  );
}
