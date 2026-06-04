import { revalidatePath } from "next/cache";
import { readSite, writeSite } from "@/lib/site";
import { saveUploadedFile, safeName, deleteMedia } from "@/lib/upload";

export default async function LogosEditorPage() {
  const site = await readSite();

  async function saveAll(formData: FormData) {
    "use server";
    const current = await readSite();
    const logos = current.logos.map((l, i) => ({
      name: String(formData.get(`name-${i}`) ?? l.name),
      src: String(formData.get(`src-${i}`) ?? l.src),
      large: formData.get(`large-${i}`) === "on",
    }));
    await writeSite({ ...current, logos });
    revalidatePath("/");
    revalidatePath("/admin/logos");
  }

  async function addLogo(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const file = formData.get("file") as File | null;
    if (!name) return;
    if (!file || !(file instanceof File) || file.size === 0) return;

    const { publicPath } = await saveUploadedFile(file, {
      type: "logos",
      name: safeName(name),
    });
    const current = await readSite();
    await writeSite({
      ...current,
      logos: [...current.logos, { name, src: publicPath, large: false }],
    });
    revalidatePath("/");
    revalidatePath("/admin/logos");
  }

  async function removeLogo(index: number) {
    "use server";
    const current = await readSite();
    const removed = current.logos[index];
    const logos = current.logos.filter((_, i) => i !== index);
    await writeSite({ ...current, logos });
    if (removed?.src) {
      await deleteMedia(removed.src).catch(() => {});
    }
    revalidatePath("/");
    revalidatePath("/admin/logos");
  }

  async function moveLogo(index: number, delta: number) {
    "use server";
    const current = await readSite();
    const t = index + delta;
    if (t < 0 || t >= current.logos.length) return;
    const logos = [...current.logos];
    [logos[index], logos[t]] = [logos[t], logos[index]];
    await writeSite({ ...current, logos });
    revalidatePath("/");
    revalidatePath("/admin/logos");
  }

  return (
    <section className="section">
      <div className="wrap max-w-4xl">
        <h1
          className="font-bold lowercase tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.04em" }}
        >
          logos.
        </h1>
        <p className="mt-1 text-mute-2">
          {site.logos.length} clientes · marque “Large” pra ampliar no grid.
        </p>

        {/* Adicionar com upload de arquivo */}
        <form
          action={addLogo}
          encType="multipart/form-data"
          className="mt-8 grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            name="name"
            placeholder="Nome do cliente"
            required
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <input
            type="file"
            name="file"
            required
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
            className="text-sm text-paper file:mr-3 file:rounded file:border file:border-line file:bg-ink-3 file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:text-paper"
          />
          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            + Adicionar
          </button>
        </form>

        {/* Lista editável */}
        <form action={saveAll} className="mt-8 space-y-3">
          <ul className="space-y-3">
            {site.logos.map((l, i) => (
              <li
                key={`${l.src}-${i}`}
                className="grid grid-cols-[auto_64px_1fr_auto_auto] items-center gap-3 border border-line p-3"
              >
                <div className="flex flex-col gap-1">
                  <RowButton
                    action={moveLogo.bind(null, i, -1)}
                    disabled={i === 0}
                    label="↑"
                  />
                  <RowButton
                    action={moveLogo.bind(null, i, +1)}
                    disabled={i === site.logos.length - 1}
                    label="↓"
                  />
                </div>

                <div className="flex h-12 items-center justify-center bg-ink-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/${l.src}`}
                    alt={l.name}
                    style={{ filter: "brightness(0) invert(1)" }}
                    className="max-h-8 max-w-12 object-contain opacity-80"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    name={`name-${i}`}
                    defaultValue={l.name}
                    placeholder="Nome"
                    className="w-full border-b border-line bg-transparent py-1 text-sm text-paper outline-none focus:border-paper"
                  />
                  <input
                    type="text"
                    name={`src-${i}`}
                    defaultValue={l.src}
                    placeholder="Path"
                    className="w-full border-b border-line bg-transparent py-1 font-mono text-[10px] text-mute-1 outline-none focus:border-paper"
                  />
                </div>

                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
                  <input
                    type="checkbox"
                    name={`large-${i}`}
                    defaultChecked={l.large}
                    className="h-4 w-4 accent-paper"
                  />
                  Large
                </label>

                <RowButton
                  action={removeLogo.bind(null, i)}
                  variant="danger"
                  label="×"
                  aria="Deletar"
                />
              </li>
            ))}
          </ul>

          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            Salvar edições
          </button>
        </form>
      </div>
    </section>
  );
}

/** Botão isolado que dispara seu próprio Server Action via form. */
function RowButton({
  action,
  disabled = false,
  variant = "default",
  label,
  aria,
}: {
  action: (formData: FormData) => Promise<void>;
  disabled?: boolean;
  variant?: "default" | "danger";
  label: string;
  aria?: string;
}) {
  // formAction evita <form> aninhada dentro do form de saveAll.
  return (
    <button
      type="submit"
      formAction={action}
      disabled={disabled}
      aria-label={aria}
      className={`rounded border px-2 py-1 font-mono text-[10px] disabled:opacity-30 ${
        variant === "danger"
          ? "border-accent/30 text-accent hover:bg-accent/10"
          : "border-line"
      }`}
    >
      {label}
    </button>
  );
}
