import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCase, readCases, writeCases } from "@/lib/cases";
import { deleteMedia, saveUploadedFile } from "@/lib/upload";
import { FILTER_TAGS, fmtTag, normTag } from "@/lib/tags";
import { mediaSrc } from "@/lib/media-url";
import type { Case } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export default async function CaseEditorPage(props: Props) {
  const { slug } = await props.params;
  const c2case = await getCase(slug);
  if (!c2case) notFound();

  async function save(formData: FormData) {
    "use server";
    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) throw new Error("not found");

    const next: Case = {
      ...all[idx],
      title: String(formData.get("title") ?? all[idx].title),
      client: String(formData.get("client") ?? all[idx].client),
      agency: String(formData.get("agency") ?? all[idx].agency),
      director: String(formData.get("director") ?? all[idx].director),
      year: String(formData.get("year") ?? all[idx].year),
      description: String(formData.get("description") ?? all[idx].description),
      tags: String(formData.get("tags") ?? "")
        .split(/[,\s]+/)
        .map((t) => normTag(t))
        .filter(Boolean),
      featured: formData.get("featured") === "on",
    };
    all[idx] = next;
    await writeCases(all);

    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
    revalidatePath("/admin");
  }

  async function moveMedia(src: string, delta: number) {
    "use server";
    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) return;
    const media = all[idx].media;
    const i = media.findIndex((m) => m.src === src);
    const target = i + delta;
    if (i < 0 || target < 0 || target >= media.length) return;
    [media[i], media[target]] = [media[target], media[i]];
    await writeCases(all);
    revalidatePath("/");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
  }

  async function removeMedia(src: string) {
    "use server";
    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) return;
    all[idx].media = all[idx].media.filter((m) => m.src !== src);
    await writeCases(all);
    await deleteMedia(src).catch(() => {});
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
  }

  async function uploadMedia(formData: FormData) {
    "use server";
    const files = formData.getAll("files") as File[];
    const valid = files.filter((f) => f && typeof f === "object" && f.size > 0);
    if (valid.length === 0) return;

    const all = await readCases();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx < 0) return;

    for (const file of valid) {
      const { publicPath, mediaType } = await saveUploadedFile(file, {
        type: "case",
        slug,
      });
      all[idx].media.push({ type: mediaType, src: publicPath });
    }
    await writeCases(all);

    revalidatePath("/");
    revalidatePath(`/trabalho/${slug}`);
    revalidatePath(`/admin/cases/${slug}`);
  }

  async function deleteCase() {
    "use server";
    const all = await readCases();
    await writeCases(all.filter((c) => c.slug !== slug));
    revalidatePath("/");
    revalidatePath("/trabalho");
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <section className="section">
      <div className="wrap max-w-4xl">
        <Link
          href="/admin"
          className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
        >
          ← Cases
        </Link>

        <h1
          className="mt-6 font-bold lowercase tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.04em" }}
        >
          {c2case.title}
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
          slug: {c2case.slug}
        </p>

        <form action={save} className="mt-10 space-y-6">
          <Field name="title" label="Título" defaultValue={c2case.title} />
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="client" label="Cliente" defaultValue={c2case.client} />
            <Field name="agency" label="Agência" defaultValue={c2case.agency} />
            <Field name="director" label="Direção" defaultValue={c2case.director} />
            <Field name="year" label="Ano" defaultValue={c2case.year} />
          </div>

          <Field
            name="tags"
            label={`Tags (separe por vírgula · oficiais: ${FILTER_TAGS.map(fmtTag).join(" · ")})`}
            defaultValue={c2case.tags.join(", ")}
          />

          <Textarea
            name="description"
            label="Descrição"
            defaultValue={c2case.description}
            rows={6}
          />

          <label className="flex items-center gap-3 text-sm text-paper">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={c2case.featured}
              className="h-4 w-4 accent-paper"
            />
            Featured (aparece na home)
          </label>

          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <button
              type="submit"
              className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
            >
              Salvar
            </button>
            <Link
              href={`/trabalho/${slug}`}
              target="_blank"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
            >
              Ver case →
            </Link>
          </div>
        </form>

        <hr className="my-16 border-line" />

        <h2 className="font-bold" style={{ fontSize: "20px" }}>
          Mídias ({c2case.media.length})
        </h2>

        <form
          action={uploadMedia}
          encType="multipart/form-data"
          className="mt-4 grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_auto]"
        >
          <input
            type="file"
            name="files"
            multiple
            accept="image/*,video/mp4,video/quicktime,video/webm"
            required
            className="text-sm text-paper file:mr-4 file:rounded file:border file:border-line file:bg-ink-3 file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-paper"
          />
          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            + Subir mídia
          </button>
        </form>
        <p className="mt-2 text-xs text-mute-2">
          JPG/PNG/MP4/MOV/WebM. Múltiplos arquivos OK. Limite 500MB por arquivo.
        </p>

        <MediaGrid media={c2case.media} move={moveMedia} remove={removeMedia} />

        <hr className="my-16 border-line" />

        <form action={deleteCase}>
          <button
            type="submit"
            className="rounded border border-accent/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10"
          >
            Deletar case
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full border-b border-line bg-transparent py-2 text-paper outline-none focus:border-paper"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-2 w-full resize-y border border-line bg-ink-2/30 px-3 py-2 text-paper outline-none focus:border-paper"
      />
    </label>
  );
}

function MediaGrid({
  media,
  move,
  remove,
}: {
  media: { type: "image" | "video"; src: string }[];
  move: (src: string, delta: number) => Promise<void>;
  remove: (src: string) => Promise<void>;
}) {
  if (media.length === 0)
    return (
      <p className="mt-4 text-sm text-mute-2">
        Nenhuma mídia ainda. Upload disponível na próxima fase.
      </p>
    );

  return (
    <>
      <p className="mt-2 text-xs text-mute-2">
        A primeira mídia é a capa. Use os botões pra reordenar.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {media.map((m, i) => (
          <li
            key={m.src}
            className="group relative aspect-[4/5] overflow-hidden bg-ink-3"
          >
            {m.type === "video" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <video
                src={mediaSrc(m.src)}
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaSrc(m.src)}
                alt=""
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-ink/80 p-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
              <span>
                {String(i + 1).padStart(2, "0")}
                {i === 0 ? " · capa" : ""}
              </span>
              <span className="text-mute-2">{m.type}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <form action={move.bind(null, m.src, -1)}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="rounded border border-line px-2 py-1 font-mono text-[10px] disabled:opacity-30"
                >
                  ←
                </button>
              </form>
              <form action={move.bind(null, m.src, +1)}>
                <button
                  type="submit"
                  disabled={i === media.length - 1}
                  className="rounded border border-line px-2 py-1 font-mono text-[10px] disabled:opacity-30"
                >
                  →
                </button>
              </form>
              <form action={remove.bind(null, m.src)}>
                <button
                  type="submit"
                  className="rounded border border-accent/40 px-2 py-1 font-mono text-[10px] text-accent"
                >
                  ×
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
