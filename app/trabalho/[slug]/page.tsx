import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Reveal } from "@/components/home/Reveal";
import { CaseMedia } from "@/components/work/CaseMedia";
import { Lightbox } from "@/components/work/Lightbox";
import { CaseLd } from "@/components/seo/JsonLd";
import { BackLink } from "@/components/work/BackLink";
import { mediaSrc } from "@/lib/media-url";
import { getCase, listSlugs, readCases } from "@/lib/cases";
import { fmtTag } from "@/lib/tags";
import type { Case } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Páginas de case dinâmicas no runtime — admin pode editar cases
 * e os JSONs no Blob mudam sem rebuild. Mantemos a tipagem RSC
 * normal; o cache do CDN é desabilitado por revalidate=0.
 */
export const dynamic = "force-dynamic";

/** Lista de slugs pra fallback no error boundary (não pré-gera). */
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
  // OG precisa de URL absoluta (já tratado pelo metadataBase se for path local)
  const ogImage = cover ? mediaSrc(cover) : undefined;
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

      {/*
        Barra "Voltar":
        - Wrapper externo dá o offset inicial pra ficar abaixo do header fixed.
        - Em desktop, o inner vira sticky com backdrop-blur. Em mobile não.
      */}
      <div style={{ paddingTop: "clamp(96px, 11vw, 120px)" }}>
        <div
          className="z-40 md:sticky md:border-b md:border-line/30 md:bg-ink/85 md:backdrop-blur"
          style={{ top: "clamp(56px, 5.6vw, 84px)" }}
        >
          <div className="wrap flex items-center py-3">
            <BackLink />
          </div>
        </div>
      </div>

      <main>
        <section className="section" style={{ paddingTop: "clamp(24px, 4vw, 56px)" }}>
          <div className="wrap">
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
              <NextCaseLink next={next} />
            </div>
          </div>
        </section>
      </main>

      <Lightbox items={c2case.media} />
      <Footer />
    </>
  );
}

/**
 * Card de "Próximo case" com thumb da capa à esquerda + título à direita.
 * Cover preferido: c2case.cover → primeira imagem → primeira mídia.
 */
function NextCaseLink({ next }: { next: Case }) {
  const coverImage =
    next.cover ?? next.media.find((m) => m.type === "image")?.src;
  const coverVideo =
    !coverImage && next.media[0]?.type === "video" ? next.media[0]?.src : null;

  return (
    <Link
      href={`/trabalho/${next.slug}`}
      className="group flex items-center gap-4 md:gap-8"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-ink-3 md:w-48">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc(coverImage)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : coverVideo ? (
          <video
            src={mediaSrc(coverVideo)}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 md:text-[11px]">
          Próximo case →
        </p>
        <p
          className="mt-2 font-bold lowercase tracking-tight transition-opacity group-hover:opacity-70"
          style={{
            fontSize: "clamp(20px, 3.4vw, 56px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
          }}
        >
          {next.title}
        </p>
      </div>
    </Link>
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
