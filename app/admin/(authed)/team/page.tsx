import { revalidatePath } from "next/cache";
import { readSite, writeSite } from "@/lib/site";
import { deleteMedia, safeName, saveUploadedFile } from "@/lib/upload";

export default async function TeamEditorPage() {
  const site = await readSite();

  async function saveAll(formData: FormData) {
    "use server";
    const current = await readSite();
    const team = current.team.map((m, i) => ({
      name: String(formData.get(`name-${i}`) ?? m.name),
      role: String(formData.get(`role-${i}`) ?? m.role),
      code: String(formData.get(`code-${i}`) ?? m.code),
      photo: String(formData.get(`photo-${i}`) ?? m.photo),
    }));
    await writeSite({ ...current, team });
    revalidatePath("/");
    revalidatePath("/admin/team");
  }

  async function addMember(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    if (!name) return;
    const current = await readSite();
    await writeSite({
      ...current,
      team: [...current.team, { name, role, code, photo: "" }],
    });
    revalidatePath("/");
    revalidatePath("/admin/team");
  }

  async function removeMember(index: number) {
    "use server";
    const current = await readSite();
    const removed = current.team[index];
    const team = current.team.filter((_, i) => i !== index);
    await writeSite({ ...current, team });
    // Se a foto era um upload local (path media/team/...), apaga do disco.
    if (removed?.photo?.startsWith("media/")) {
      await deleteMedia(removed.photo).catch(() => {});
    }
    revalidatePath("/");
    revalidatePath("/admin/team");
  }

  async function uploadPhoto(index: number, formData: FormData) {
    "use server";
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) return;
    const current = await readSite();
    const member = current.team[index];
    if (!member) return;

    const baseName = safeName(member.code || member.name) || `team-${index}`;
    const { publicPath } = await saveUploadedFile(file, {
      type: "team",
      name: baseName,
    });

    const team = [...current.team];
    team[index] = { ...member, photo: publicPath };
    await writeSite({ ...current, team });
    revalidatePath("/");
    revalidatePath("/admin/team");
  }

  async function moveMember(index: number, delta: number) {
    "use server";
    const current = await readSite();
    const t = index + delta;
    if (t < 0 || t >= current.team.length) return;
    const team = [...current.team];
    [team[index], team[t]] = [team[t], team[index]];
    await writeSite({ ...current, team });
    revalidatePath("/");
    revalidatePath("/admin/team");
  }

  return (
    <section className="section">
      <div className="wrap max-w-4xl">
        <h1
          className="font-bold lowercase tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.04em" }}
        >
          time.
        </h1>
        <p className="mt-1 text-mute-2">{site.team.length} pessoas no time.</p>

        {/* Adicionar */}
        <form
          action={addMember}
          className="mt-8 grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <input
            name="name"
            placeholder="Nome"
            required
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <input
            name="role"
            placeholder="Função"
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <input
            name="code"
            placeholder="Código (ex: CCB · 0114)"
            className="border-b border-line bg-transparent px-2 py-2 font-mono text-sm outline-none focus:border-paper"
          />
          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            + Adicionar
          </button>
        </form>

        {/* Lista */}
        <form action={saveAll} className="mt-10 space-y-8">
          {site.team.map((m, i) => (
            <div
              key={`${m.code || m.name}-${i}`}
              className="grid gap-4 border-t border-line pt-6 md:grid-cols-[auto_120px_1fr_auto]"
            >
              <div className="flex flex-col gap-1">
                <RowButton
                  action={moveMember.bind(null, i, -1)}
                  disabled={i === 0}
                  label="↑"
                />
                <RowButton
                  action={moveMember.bind(null, i, +1)}
                  disabled={i === site.team.length - 1}
                  label="↓"
                />
              </div>

              <div>
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo.startsWith("http") ? m.photo : `/${m.photo}`}
                    alt={m.name}
                    className="aspect-[3/4] w-full object-cover [filter:grayscale(100%)]"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-ink-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-3">
                    sem foto
                  </div>
                )}

                {/* Upload de foto pra esse membro */}
                <form
                  action={uploadPhoto.bind(null, i)}
                  encType="multipart/form-data"
                  className="mt-2"
                >
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={undefined}
                    className="block w-full text-[10px] text-mute-1 file:mr-2 file:rounded file:border file:border-line file:bg-ink-3 file:px-2 file:py-1 file:font-mono file:text-[10px] file:uppercase file:text-paper"
                  />
                  <button
                    type="submit"
                    className="mt-1 w-full rounded border border-line py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper hover:bg-ink-3"
                  >
                    Trocar foto
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <Field name={`name-${i}`} label="Nome" defaultValue={m.name} />
                <Field name={`role-${i}`} label="Função" defaultValue={m.role} />
                <Field name={`code-${i}`} label="Código" defaultValue={m.code} />
                <Field
                  name={`photo-${i}`}
                  label="Foto (URL completa do Spaces)"
                  defaultValue={m.photo}
                />
              </div>

              <div className="flex items-start">
                <RowButton
                  action={removeMember.bind(null, i)}
                  variant="danger"
                  label="×"
                  aria="Deletar pessoa"
                />
              </div>
            </div>
          ))}

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
        className="mt-2 w-full border-b border-line bg-transparent py-1 text-paper outline-none focus:border-paper"
      />
    </label>
  );
}

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
