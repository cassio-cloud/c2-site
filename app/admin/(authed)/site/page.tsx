import { revalidatePath } from "next/cache";
import { readSite, writeSite } from "@/lib/site";

export default async function SiteEditorPage() {
  const site = await readSite();

  async function save(formData: FormData) {
    "use server";
    const current = await readSite();
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
      },
    };
    await writeSite(next);
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

          <fieldset className="space-y-6">
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

          <fieldset className="space-y-3 border-t border-line pt-6">
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

          <fieldset className="space-y-3 border-t border-line pt-6">
            <legend className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
              Redes sociais (read-only)
            </legend>
            <ul className="text-sm text-mute-1">
              {site.contact.social.map((s) => (
                <li key={s.name}>
                  {s.name} · {s.url}
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
