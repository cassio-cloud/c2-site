import { readCases } from "@/lib/cases";
import { HOME_IA } from "@/lib/home-layout";
import { BentoTile } from "./BentoTile";
import { Reveal } from "./Reveal";

export async function IaSection() {
  const cases = await readCases();
  const bySlug = new Map(cases.map((c) => [c.slug, c]));

  return (
    <section id="ia" className="section">
      <div className="wrap">
        <Reveal className="mb-6">
          <h2
            className="h-display lowercase tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            <span className="font-bold whitespace-nowrap">
              não é sobre usar ia.
            </span>{" "}
            <span className="font-light text-mute-2 whitespace-nowrap">
              é sobre saber quando usar.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={120} className="mb-16 max-w-md">
          <p className="text-mute-1">
            Trabalhamos com IA antes dela virar assunto. Cada projeto pede uma
            decisão diferente.
          </p>
        </Reveal>

        <div className="space-y-20">
          {HOME_IA.map((group) => (
            <div key={group.label}>
              <Reveal className="mb-6 flex items-end justify-between border-b border-line pb-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute-1">
                  {group.label}
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute-3">
                  {String(group.tiles.length).padStart(2, "0")} cases
                </p>
              </Reveal>
              <div
                className="grid grid-cols-12"
                style={{
                  columnGap: "clamp(12px, 1.4vw, 24px)",
                  rowGap: "clamp(32px, 3.5vw, 56px)",
                }}
              >
                {group.tiles.map((layout, i) => {
                  const c = bySlug.get(layout.slug);
                  if (!c) return null;
                  return (
                    <BentoTile
                      key={layout.slug}
                      layout={layout}
                      c2case={c}
                      index={i}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
