import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Reveal } from "@/components/home/Reveal";
import { CaseMedia } from "@/components/work/CaseMedia";
import { Lightbox } from "@/components/work/Lightbox";
import { CaseLd } from "@/components/seo/JsonLd";
import { getCase, listSlugs, readCases } from "@/lib/cases";
import { fmtTag } from "@/lib/tags";

type Props = {
  params: Promise<{ slug: string }>;
};

/** SSG: gera HTML estático em build para cada um dos 19 cases. */
export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** SEO por case — Google, LinkedIn, WhatsApp, Twitter vêem tudo. */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const c = await getCase(slug);
  if (!c) return { title: "Case não encontrado" };

  const cover =
    c.cover ??
    c.media.find((m) => m.type === "image")?.src ??
    c.media[0]?.src;
  const ogImage = cover ? `/${cover}` : undefined;
  const desc =
    c.description?.slice(0, 200).trim() ??
    `${c.title} · Produção C2 Content · ${c.year}`;

  return {
    title: c.title,
    description: desc,
    openGraph: {
      type: "article",
      title: `${c.title} · C2 Content`,
      description: desc,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 800 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} · C2 Content`,
      description: desc,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CasePage(props: Props) {
  const { slug } = await props.params;
  const c2case = await getCase(slug);
  if (!c2case) notFound();

  // Próximo case para CTA do final
  const all = await readCases();
  const idx = all.findIndex((c) => c.slug === slug);
  const next = all[(idx + 1) % all.length];

  return (
    <>
      <CaseLd c2case={c2case} />
      <Header />

      <main>
        <section className="section" style={{ paddingTop: "clamp(120px, 12vw, 200px)" }}>
          <div className="wrap">
            <Reveal className="mb-10">
              <Link
                href="/trabalho"
                className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
              >
                ← Voltar pra todos os cases
              </Link>
            </Reveal>

            <div className="grid gap-12 md:grid-cols-[320px_1fr] md:gap-16">
              <aside className="md:sticky md:top-32 md:self-start">
                <Reveal>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-1">
                    {c2case.tags.map(fmtTag).join(" · ")}
                  </p>
                  <h1
                    className="mt-3 font-bold lowercase tracking-tight"
                    style={{
                      fontSize: "clamp(32px, 3.4vw, 56px)",
                      letterSpacing: "-0.035em",
                      lineHeight: 1.02,
                    }}
                  >
                    {c2case.title}
                  </h1>
                  <p className="mt-6 text-mute-1 leading-relaxed">
                    {c2case.description}
                  </p>

                  <dl className="mt-10 border-t border-line">
                    <MetaRow label="Cliente" value={c2case.client} />
                    <MetaRow label="Agência" value={c2case.agency} />
                    <MetaRow label="Produção" value="C2 Content" />
                    <MetaRow label="Direção" value={c2case.director} />
                    <MetaRow label="Ano" value={c2case.year} />
                    <MetaRow label="Formato" value={c2case.format} />
                  </dl>
                </Reveal>
              </aside>

              <div className="space-y-4 md:space-y-6">
                {c2case.media.map((m, i) => (
                  <Reveal key={`${m.src}-${i}`} delay={(i % 3) * 80}>
                    <CaseMedia item={m} index={i} />
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="mt-32 border-t border-line pt-12">
              <Link
                href={`/trabalho/${next.slug}`}
                className="group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
                  Próximo case →
                </span>
                <span
                  className="font-bold lowercase tracking-tight transition-opacity group-hover:opacity-70"
                  style={{
                    fontSize: "clamp(28px, 4vw, 64px)",
                    letterSpacing: "-0.035em",
                  }}
                >
                  {next.title}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Lightbox items={c2case.media} />
      <Footer />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </dt>
      <dd className="text-right text-sm text-paper">{value || "—"}</dd>
    </div>
  );
}
