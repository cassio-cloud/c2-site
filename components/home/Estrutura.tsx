import { Reveal } from "./Reveal";

/**
 * Estrutura — dois estúdios próprios.
 * Dados editoriais (área, descrição, status) ficam aqui em vez do site.json
 * porque são copys curados, não config dinâmica.
 */

type Studio = {
  name: string;
  location: string;
  area: string;
  status?: string;
  description: string;
};

const STUDIOS: Studio[] = [
  {
    name: "311.",
    location: "Novo Hamburgo · RS",
    area: "300m²",
    description:
      "300m² para campanha publicitária, conteúdo de marca e foto de produto.",
  },
  {
    name: "909.",
    location: "São Paulo · SP",
    area: "Em breve",
    status: "Em breve",
    description:
      "Espaço de criação, reunião e produção de conteúdo no centro de SP.",
  },
];

/** Marcadores de canto (4 quadrados brancos) que delimitam o card. */
function CornerMarks() {
  const cls =
    "absolute h-1.5 w-1.5 bg-paper/80 pointer-events-none";
  return (
    <>
      <span className={`${cls} -top-px -left-px`} />
      <span className={`${cls} -top-px -right-px`} />
      <span className={`${cls} -bottom-px -left-px`} />
      <span className={`${cls} -bottom-px -right-px`} />
    </>
  );
}

export function Estrutura() {
  return (
    <section id="estrutura" className="section">
      <div className="wrap">
        <Reveal className="mb-16">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            estrutura.
          </h2>
        </Reveal>

        <div
          className="grid gap-8 md:grid-cols-2"
          style={{ columnGap: "clamp(20px, 2vw, 40px)" }}
        >
          {STUDIOS.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 120}
              className="relative bg-ink-2/40 p-8 md:p-12"
              style={{ minHeight: "clamp(420px, 36vw, 560px)" }}
            >
              <CornerMarks />

              <div className="flex items-baseline justify-between border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
                <span>Studio · {s.name.replace(".", "")}</span>
                <span>{s.area}</span>
              </div>

              <p
                className="mt-12 font-bold tracking-tight"
                style={{
                  fontSize: "clamp(80px, 12vw, 192px)",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                }}
              >
                {s.name}
              </p>

              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-1">
                {s.location}
              </p>

              <p className="mt-8 max-w-sm text-sm leading-relaxed text-mute-1">
                {s.description}
              </p>

              <a
                href="#contato"
                className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-paper underline-offset-[6px] hover:underline"
              >
                Saber mais →
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
