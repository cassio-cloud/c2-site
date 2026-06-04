import type { MetadataRoute } from "next";
import { readCases } from "@/lib/cases";

const SITE_URL = "https://c2content.com.br";

/**
 * Gera /sitemap.xml dinamicamente com:
 *   - home (/)
 *   - listagem (/trabalho)
 *   - todas as 19 páginas de case (/trabalho/<slug>)
 *
 * Re-gerado em build (SSG) e revalidado quando admin edita cases.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await readCases();
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/trabalho`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...cases.map((c) => ({
      url: `${SITE_URL}/trabalho/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
