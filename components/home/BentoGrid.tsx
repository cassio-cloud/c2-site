import { readCases } from "@/lib/cases";
import { HOME_BENTO } from "@/lib/home-layout";
import { BentoTile } from "./BentoTile";
import { Reveal } from "./Reveal";

export async function BentoGrid() {
  const cases = await readCases();
  const bySlug = new Map(cases.map((c) => [c.slug, c]));

  return (
    <section id="trabalho" className="section">
      <div className="wrap">
        <Reveal className="mb-12">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            selected work.
          </h2>
        </Reveal>

        <div
          className="grid grid-cols-12"
          style={{
            columnGap: "clamp(12px, 1.4vw, 24px)",
            rowGap: "clamp(32px, 3.5vw, 56px)",
          }}
        >
          {HOME_BENTO.map((layout, i) => {
            const c = bySlug.get(layout.slug);
            if (!c) return null;
            return (
              <BentoTile key={layout.slug} layout={layout} c2case={c} index={i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
