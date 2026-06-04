import type { Case } from "@/lib/types";

const SITE_URL = "https://c2content.com.br";

/**
 * Schema.org / JSON-LD structured data.
 * Ajuda Google a entender o site (knowledge panel, rich results).
 */

export function OrganizationLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "C2 Content",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Produtora audiovisual brasileira em Novo Hamburgo e São Paulo. Campanhas, conteúdo e produções híbridas com IA.",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Novo Hamburgo",
        addressRegion: "RS",
        addressCountry: "BR",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
    ],
    sameAs: [
      "https://instagram.com/c2content",
      "https://linkedin.com/company/c2content",
      "https://youtube.com/@c2content",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "producao@c2content.com.br",
      telephone: "+5551995354727",
      contactType: "sales",
      availableLanguage: ["Portuguese", "English"],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CaseLd({ c2case }: { c2case: Case }) {
  const cover =
    c2case.cover ??
    c2case.media.find((m) => m.type === "image")?.src ??
    c2case.media[0]?.src;
  // cover pode ser Blob URL (absoluta) ou path local (`media/...`)
  const image = cover
    ? /^https?:\/\//i.test(cover)
      ? cover
      : `${SITE_URL}/${cover}`
    : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: c2case.title,
    description: c2case.description,
    creator: {
      "@type": "Organization",
      name: "C2 Content",
      url: SITE_URL,
    },
    director: c2case.director,
    datePublished: c2case.year,
    url: `${SITE_URL}/trabalho/${c2case.slug}`,
    ...(image ? { image } : {}),
    ...(c2case.client ? { sourceOrganization: { "@type": "Organization", name: c2case.client } } : {}),
    keywords: c2case.tags.join(", "),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
