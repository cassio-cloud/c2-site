/** Endereço canônico do site: sem www, com https (a Vercel redireciona o resto). */
export const SITE_URL = "https://c2content.com.br";

/** `media/x.jpg`, `/media/x.jpg` ou URL absoluta → URL absoluta. */
export function absoluta(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}/${src.replace(/^\//, "")}`;
}
