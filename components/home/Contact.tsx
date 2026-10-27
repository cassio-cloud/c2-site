import { readSiteCached } from "@/lib/site";
import { Reveal } from "./Reveal";

export async function Contact() {
  const { contact } = await readSiteCached();

  return (
    <ContatoSecao email={contact.email} whatsapp={contact.whatsapp} whatsappLink={contact.whatsappLink}>
      <div className="mt-20 grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="rotulo text-mute-2">
            Estúdios
          </p>
          <ul className="mt-4 space-y-1.5 text-paper">
            {contact.studios.map((s) => (
              <li key={s.name}>
                {s.name} · {s.location}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <p className="rotulo text-mute-2">
            Redes
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-paper">
            {contact.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="toque transition-opacity hover:opacity-70"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </ContatoSecao>
  );
}

/**
 * A base do contato: "vamos conversar." + e-mail e WhatsApp em linhas
 * grandes. Usada pela home (com estúdios e redes abaixo) e pelas páginas
 * de diretor (com o contato da coordenação de produção).
 */
export function ContatoSecao({
  email,
  whatsapp,
  whatsappLink,
  nota,
  children,
}: {
  email: string;
  whatsapp: string;
  whatsappLink: string;
  /** Linha abaixo do título — ex.: com quem é a conversa. */
  nota?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section id="contato" className="section">
      <div className="wrap">
        <Reveal className="mb-12">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(44px, 6.8vw, 112px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            vamos conversar.
          </h2>
          {nota ? (
            <p className="mt-6 text-mute-1" style={{ fontSize: "clamp(16px, 1.3vw, 20px)" }}>
              {nota}
            </p>
          ) : null}
        </Reveal>

        <ul className="border-t border-line">
          <ContactRow label="E-mail" value={email} href={`mailto:${email}`} />
          <ContactRow label="WhatsApp" value={whatsapp} href={whatsappLink} external />
        </ul>

        {children}
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group grid items-center gap-6 border-b border-line py-10 transition-colors hover:bg-ink-2/40 md:grid-cols-[200px_1fr_auto]"
      >
        <span className="rotulo text-mute-2">
          {label}
        </span>
        <span
          className="break-all font-bold tracking-tight"
          style={{
            fontSize: "clamp(18px, 4vw, 56px)",
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </span>
        <span
          aria-hidden
          className="hidden text-2xl text-mute-2 transition-transform group-hover:translate-x-1 group-hover:text-paper md:inline"
        >
          →
        </span>
      </a>
    </li>
  );
}
