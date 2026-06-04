import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readCases, writeCases } from "@/lib/cases";
import { normTag, fmtTag } from "@/lib/tags";
import type { Case } from "@/lib/types";

export default async function AdminCasesPage() {
  const cases = await readCases();

  async function toggleFeatured(slug: string) {
    "use server";
    const all = await readCases();
    const next = all.map((c) =>
      c.slug === slug ? { ...c, featured: !c.featured } : c,
    );
    await writeCases(next);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function moveCase(slug: string, delta: number) {
    "use server";
    const all = await readCases();
    const i = all.findIndex((c) => c.slug === slug);
    const t = i + delta;
    if (i < 0 || t < 0 || t >= all.length) return;
    [all[i], all[t]] = [all[t], all[i]];
    await writeCases(all);
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
  }

  async function deleteCaseAction(slug: string) {
    "use server";
    const all = await readCases();
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

    // Adiciona no topo da lista (mais recente primeiro)
    await writeCases([newCase, ...all]);
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
    redirect(`/admin/cases/${slug}`);
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1
              className="font-bold lowercase tracking-tight"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.04em" }}
            >
              cases.
            </h1>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
              {cases.length} cases · {cases.filter((c) => c.featured).length} featured
            </p>
          </div>
        </div>

        {/* Add new */}
        <form
          action={addCase}
          className="mb-10 grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <input
            name="slug"
            placeholder="slug-do-case"
            required
            className="border-b border-line bg-transparent px-2 py-2 font-mono text-sm outline-none focus:border-paper"
          />
          <input
            name="title"
            placeholder="Título do case"
            required
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <input
            name="tags"
            placeholder="tags separadas por vírgula"
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            + Adicionar
          </button>
        </form>

        <ul className="divide-y divide-line border-t border-b border-line">
          {cases.map((c, i) => (
            <li
              key={c.slug}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-3"
            >
              {/* Reorder */}
              <div className="flex gap-1">
                <form action={moveCase.bind(null, c.slug, -1)}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label="Mover pra cima"
                    className="rounded border border-line px-2 py-1 font-mono text-[10px] disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveCase.bind(null, c.slug, +1)}>
                  <button
                    type="submit"
                    disabled={i === cases.length - 1}
                    aria-label="Mover pra baixo"
                    className="rounded border border-line px-2 py-1 font-mono text-[10px] disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
              </div>

              <div className="min-w-0">
                <p className="truncate text-paper">{c.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
                  {c.tags.map(fmtTag).join(" · ") || "—"} · {c.year} ·{" "}
                  {c.media.length} mídia{c.media.length === 1 ? "" : "s"}
                </p>
              </div>

              <form action={toggleFeatured.bind(null, c.slug)}>
                <button
                  type="submit"
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    c.featured
                      ? "border-paper bg-paper text-ink"
                      : "border-line text-mute-2 hover:border-mute-2 hover:text-paper"
                  }`}
                >
                  {c.featured ? "Featured" : "Hidden"}
                </button>
              </form>

              <Link
                href={`/admin/cases/${c.slug}`}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
              >
                Editar →
              </Link>

              <form action={deleteCaseAction.bind(null, c.slug)}>
                <button
                  type="submit"
                  aria-label="Deletar"
                  className="rounded border border-accent/30 px-2 py-1 font-mono text-[10px] text-accent transition-colors hover:bg-accent/10"
                >
                  ×
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
