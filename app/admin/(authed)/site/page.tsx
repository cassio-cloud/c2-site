import { revalidatePath } from "next/cache";
import { readSite, writeSite } from "@/lib/site";

export default async function SiteEditorPage() {
  const site = await readSite();

  async function save(formData: FormData) {
    "use server";
    const current = await readSite();
    const social = current.contact.social.map((s, i) => ({
      name: String(formData.get(`social-name-${i}`) ?? s.name),
      url: String(formData.get(`social-url-${i}`) ?? s.url),
    }));
    const next = {
      ...current,
      hero: {
        ...current.hero,
        embed: String(formData.get("heroEmbed") ?? "").trim() || undefined,
      },
      contact: {
        ...current.contact,
        email: String(formData.get("email") ?? current.contact.email),
        whatsapp: String(formData.get("whatsapp") ?? current.contact.whatsapp),
        whatsappLink: String(
          formData.get("whatsappLink") ?? current.contact.whatsappLink,
        ),
        social,
      },
    };
    await writeSite(next);
    revalidatePath("/");
    revalidatePath("/admin/site");
  }

  async function addSocial(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    if (!name || !url) return;
    const current = await readSite();
    await writeSite({
      ...current,
      contact: {
        ...current.contact,
        social: [...current.contact.social, { name, url }],
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/site");
  }

  async function removeSocial(index: number) {
    "use server";
    const current = await readSite();
    const social = current.contact.social.filter((_, i) => i !== index);
    await writeSite({ ...current, contact: { ...current.contact, social } });
    revalidatePath("/");
    revalidatePath("/admin/site");
  }

  async function moveSocial(index: number, delta: number) {
    "use server";
    const current = await readSite();
    const t = index + delta;
    if (t < 0 || t >= current.contact.social.length) return;
    const social = [...current.contact.social];
    [social[index], social[t]] = [social[t], social[index]];
    await writeSite({ ...current, contact: { ...current.contact, social } });
    revalidatePath("/");
    revalidatePath("/admin/site");
  }

  return (
    <section className="section">
      <div className="wrap max-w-3xl">
        <h1
          className="font-bold lowercase tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.04em" }}
        >
          site.
        </h1>
        <p className="mt-1 text-mute-2">Hero, contato, estúdios e redes.</p>

        {/* Add social — fica fora do form principal */}
        <fieldset className="mt-10 border border-line bg-ink-2/30 p-4">
          <legend className="px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
            Adicionar rede social
          </legend>
          <form
            action={addSocial}
            className="grid gap-3 md:grid-cols-[1fr_2fr_auto]"
          >
            <input
              name="name"
              placeholder="Nome (Instagram, TikTok, ...)"
              required
              className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
            />
            <input
              name="url"
              placeholder="https://..."
              required
              type="url"
              className="border-b border-line bg-transparent px-2 py-2 font-mono text-sm outline-none focus:border-paper"
            />
            <button
              type="submit"
              className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
            >
              + Adicionar
            </button>
          </form>
        </fieldset>

        {/* Form principal (Hero + Contato + edição de redes) */}
        <form action={save} className="mt-10 space-y-6">
          <fieldset className="space-y-3 border-b border-line pb-6">
            <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
              Hero · vídeo do topo
            </legend>
            <Field
              name="heroEmbed"
              label="URL YouTube ou Vimeo (recomendado · sem upload pesado)"
              defaultValue={site.hero.embed ?? ""}
            />
            <p className="text-xs text-mute-2">
              Vimeo é melhor pra reel cinematográfico (sem branding YouTube).
              Cole a URL completa — ex:{" "}
              <code className="font-mono text-mute-1">https://vimeo.com/123456789</code>{" "}
              ou{" "}
              <code className="font-mono text-mute-1">https://youtu.be/ABCDEF</code>.
              Deixe vazio pra usar o arquivo local{" "}
              <code className="font-mono text-mute-1">{site.hero.video}</code>.
            </p>
          </fieldset>

          <fieldset className="space-y-6 border-b border-line pb-6">
            <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
              Contato
            </legend>
            <Field name="email" label="E-mail" defaultValue={site.contact.email} />
            <Field
              name="whatsapp"
              label="WhatsApp (display)"
              defaultValue={site.contact.whatsapp}
            />
            <Field
              name="whatsappLink"
              label="WhatsApp link (wa.me/...)"
              defaultValue={site.contact.whatsappLink}
            />
          </fieldset>

          <fieldset className="space-y-3 border-b border-line pb-6">
            <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
              Estúdios (read-only)
            </legend>
            <ul className="text-sm text-mute-1">
              {site.contact.studios.map((s) => (
                <li key={s.name}>
                  {s.name} · {s.location}
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="space-y-3 border-b border-line pb-6">
            <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
              Redes sociais ({site.contact.social.length})
            </legend>
            <ul className="space-y-2">
              {site.contact.social.map((s, i) => (
                <li
                  key={`${s.name}-${i}`}
                  className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <RowButton
                      action={moveSocial.bind(null, i, -1)}
                      disabled={i === 0}
                      label="↑"
                    />
                    <RowButton
                      action={moveSocial.bind(null, i, +1)}
                      disabled={i === site.contact.social.length - 1}
                      label="↓"
                    />
                  </div>
                  <input
                    type="text"
                    name={`social-name-${i}`}
                    defaultValue={s.name}
                    className="border-b border-line bg-transparent px-2 py-1 text-sm text-paper outline-none focus:border-paper"
                  />
                  <input
                    type="url"
                    name={`social-url-${i}`}
                    defaultValue={s.url}
                    className="border-b border-line bg-transparent px-2 py-1 font-mono text-xs text-mute-1 outline-none focus:border-paper"
                  />
                  <RowButton
                    action={removeSocial.bind(null, i)}
                    variant="danger"
                    label="×"
                    aria="Deletar rede"
                  />
                </li>
              ))}
            </ul>
          </fieldset>

          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            Salvar
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
  // Usa formAction pra evitar <form> aninhada — clicar dispara
  // essa action em vez do save padrão do form externo.
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
