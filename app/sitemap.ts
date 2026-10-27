import type { MetadataRoute } from "next";
import { readCasesCached } from "@/lib/cases";
import { listarDiretores } from "@/lib/diretores";
import { SITE_URL, absoluta } from "@/lib/seo";

/**
 * /sitemap.xml: home, portfólio, cada case, diretores e cada diretor.
 *
 * Sem `lastModified`: os dados não guardam data de edição, e uma data
 * inventada (o "agora" de cada request) faz o Google desconfiar do campo
 * no site todo. Cada case leva a capa como imagem, o que ajuda a indexação
 * no Google Imagens. Credencial, advertising e admin ficam de fora (noindex).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, diretores] = await Promise.all([readCasesCached(), listarDiretores()]);

  const capa = (c: (typeof cases)[number]) =>
    c.cover ?? c.media.find((m) => m.type === "image")?.src;

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/trabalho`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/diretores`, changeFrequency: "monthly", priority: 0.8 },
    ...cases.map((c) => {
      const img = capa(c);
      return {
        url: `${SITE_URL}/trabalho/${c.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(img ? { images: [absoluta(img)] } : {}),
      };
    }),
    ...diretores.map((d) => ({
      url: `${SITE_URL}/diretores/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(d.foto ? { images: [absoluta(d.foto)] } : {}),
    })),
  ];
}
