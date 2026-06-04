import type { MetadataRoute } from "next";

const SITE_URL = "https://c2content.com.br";

/**
 * /robots.txt — permite tudo público, bloqueia admin e API.
 * Sitemap inline pra Google encontrar direto.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/admin/*"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
