import { readSite } from "@/lib/site";
import { mediaSrc } from "@/lib/media-url";
import { Reveal } from "./Reveal";

export async function Team() {
  const { team } = await readSite();

  return (
    <section id="time" className="section">
      <div className="wrap">
        <Reveal className="mb-8">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            about.
          </h2>
        </Reveal>

        <Reveal delay={120} className="mb-16 max-w-2xl">
          <p
            className="text-paper"
            style={{ fontSize: "clamp(20px, 1.6vw, 28px)", lineHeight: 1.35 }}
          >
            A C2 nasce do conteúdo, mas pensa com craft. On e off, com direção —
            da produção à IA. Desde 2018, criando, produzindo e bem executando.
          </p>
        </Reveal>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          style={{ gap: "clamp(8px, 1vw, 16px)" }}
        >
          {team.map((p, i) => (
            <Reveal
              key={p.name}
              delay={(i % 3) * 80}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-ink-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaSrc(p.photo)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-700 ease-out [filter:grayscale(100%)_contrast(1.04)] group-hover:[filter:grayscale(100%)_contrast(1.04)_brightness(1.06)]"
                />
              </div>
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  {p.name}
                </p>
                <p className="mt-2 min-h-[32px] font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
                  {p.role}
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-3">
                  {p.code}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
