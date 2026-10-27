import type { Case } from "@/lib/types";
import type { DiretorSite } from "@/lib/diretores";
import { SITE_URL, absoluta } from "@/lib/seo";

/**
 * Schema.org / JSON-LD structured data.
 * Ajuda Google e buscadores com IA a entender quem é a C2, o que ela faz,
 * onde fica e o que cada página é (knowledge panel, rich results, GEO).
 */

const ORG_ID = `${SITE_URL}/#organizacao`;

/** Perfis oficiais. Conferidos: o YouTube é @c2.content (@c2content é outro canal). */
export const PERFIS = [
  "https://www.instagram.com/c2.content",
  "https://www.linkedin.com/company/c2content",
  "https://www.youtube.com/@c2.content",
];

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: "C2 Content",
        alternateName: "C2",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/opengraph-image`,
        slogan: "where content meets craft.",
        description:
          "Produtora audiovisual brasileira com estúdios em Novo Hamburgo (RS) e São Paulo (SP). Campanhas publicitárias, filmes, fotografia, conteúdo de marca e produções híbridas com IA, com diretores de cena parceiros.",
        foundingDate: "2018",
        founder: { "@type": "Person", name: "Cássio Caberlon", jobTitle: "Fundador e diretor criativo" },
        areaServed: { "@type": "Country", name: "Brasil" },
        knowsAbout: [
          "produção audiovisual",
          "campanha publicitária",
          "filme publicitário",
          "fotografia publicitária",
          "produção de conteúdo",
          "direção de cena",
          "IA generativa em produção audiovisual",
        ],
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
        sameAs: PERFIS,
        contactPoint: {
          "@type": "ContactPoint",
          email: "luana@c2content.com.br",
          telephone: "+55-51-99535-4727",
          contactType: "sales",
          areaServed: "BR",
          availableLanguage: ["Portuguese", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        url: SITE_URL,
        name: "C2 Content",
        inLanguage: "pt-BR",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
  return <Ld data={data} />;
}

/** Trilha Início › seção › página, para o Google mostrar no resultado. */
export function BreadcrumbLd({ itens }: { itens: { nome: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nome: "Início", url: "/" }, ...itens].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nome,
      item: absoluta(it.url),
    })),
  };
  return <Ld data={data} />;
}

export function CaseLd({ c2case }: { c2case: Case }) {
  const cover =
    c2case.cover ??
    c2case.media.find((m) => m.type === "image")?.src ??
    c2case.media[0]?.src;

  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: c2case.title,
    description: c2case.description,
    inLanguage: "pt-BR",
    creator: { "@id": ORG_ID, "@type": "Organization", name: "C2 Content", url: SITE_URL },
    ...(c2case.director ? { director: { "@type": "Person", name: c2case.director } } : {}),
    ...(c2case.year ? { dateCreated: c2case.year } : {}),
    url: `${SITE_URL}/trabalho/${c2case.slug}`,
    ...(cover ? { image: absoluta(cover) } : {}),
    ...(c2case.client ? { sponsor: { "@type": "Organization", name: c2case.client } } : {}),
    keywords: c2case.tags.join(", "),
  };
  return <Ld data={data} />;
}

export function DiretorLd({ d }: { d: DiretorSite }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: d.nome,
    jobTitle: "Diretor de cena",
    url: `${SITE_URL}/diretores/${d.slug}`,
    ...(d.bio ? { description: d.bio } : {}),
    ...(d.foto ? { image: absoluta(d.foto) } : {}),
    ...(d.premios.length ? { award: d.premios } : {}),
    ...(d.canal ? { sameAs: [d.canal] } : {}),
    affiliation: { "@id": ORG_ID, "@type": "Organization", name: "C2 Content", url: SITE_URL },
  };
  return <Ld data={data} />;
}
