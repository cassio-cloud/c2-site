import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Reveal } from "@/components/home/Reveal";
import { FilterChips } from "@/components/work/FilterChips";
import { WorkTile } from "@/components/work/WorkTile";
import { readCases, filterByTag } from "@/lib/cases";
import { sizeAt } from "@/lib/work-layout";
import { FILTER_TAGS, fmtTag, type CanonicalTag } from "@/lib/tags";

/** Listagem é dinâmica (cases mudam via admin). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Portfólio completo de campanhas, conteúdos e produções com IA da C2 Content.",
  openGraph: {
    title: "Work · C2 Content",
    description:
      "Portfólio completo de campanhas, conteúdos e produções com IA.",
  },
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function TrabalhoPage(props: Props) {
  const { tag } = await props.searchParams;
  const activeTag = tag && (FILTER_TAGS as readonly string[]).includes(tag)
    ? (tag as CanonicalTag)
    : null;

  const cases = await readCases();
  const visible = filterByTag(cases, activeTag);

  // Counts por tag pra mostrar no chip
  const counts: Record<string, number> = {};
  for (const t of FILTER_TAGS) {
    counts[t] = cases.filter((c) => c.tags.includes(t)).length;
  }

  return (
    <>
      <Header />

      <main>
        <section className="section" style={{ paddingTop: "clamp(140px, 14vw, 220px)" }}>
          <div className="wrap">
            <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1
                  className="h-display font-bold lowercase tracking-tight"
                  style={{
                    fontSize: "clamp(48px, 8vw, 132px)",
                    letterSpacing: "-0.045em",
                    lineHeight: 0.96,
                  }}
                >
                  work.
                </h1>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute-2">
                  Campanha · Conteúdo · IA · 2023 — 2026
                </p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute-2">
                {String(visible.length).padStart(2, "0")} projeto
                {visible.length === 1 ? "" : "s"}
                {activeTag ? ` · ${fmtTag(activeTag)}` : ""}
              </p>
            </Reveal>

            <Reveal delay={80} className="mb-16">
              <FilterChips
                active={activeTag}
                counts={counts}
                total={cases.length}
              />
            </Reveal>

            <div
              className="grid grid-cols-12"
              style={{
                columnGap: "clamp(12px, 1.4vw, 24px)",
                rowGap: "clamp(32px, 3.5vw, 56px)",
              }}
            >
              {visible.map((c, i) => (
                <WorkTile
                  key={c.slug}
                  c2case={c}
                  size={sizeAt(i)}
                  index={i}
                />
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="py-24 text-center text-mute-2">
                Nenhum case com essa tag por enquanto.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
