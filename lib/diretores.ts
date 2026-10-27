import { diretores as credencial } from "@/data/credencial/diretores";
import { selosDe, type SeloPremio } from "@/data/credencial/premios";
import { obrasVimeo } from "@/data/diretores/obras";
import { parseEmbedUrl } from "@/lib/embed";

/**
 * Diretores da aba /diretores.
 *
 * Bio, frase, prêmios e marcas vêm da credencial de advertising
 * (data/credencial/diretores.ts) — corrigiu lá, corrige aqui. Os trabalhos
 * vêm do canal de Vimeo de cada um (data/diretores/obras.ts); quem está em
 * DA_CREDENCIAL mostra só os filmes escolhidos na credencial.
 */

/** Quem entra no site, nesta ordem. A credencial tem mais nomes. */
const NO_SITE = [
  "bia-flecha",
  "john-porciuncula",
  "raoni-rodrigues",
  "diego-lisboa",
  "cassio-caberlon",
] as const;

export type Obra = {
  id: string;
  marca: string;
  titulo: string;
  thumb: string;
  /** Id do vídeo no Vimeo — abre no player. */
  vimeo?: string;
  /** Id do vídeo no YouTube — abre no player. */
  youtube?: string;
  /** Página interna, quando o trabalho é um case do site. */
  href?: string;
};

export type DiretorSite = {
  slug: string;
  nome: string;
  sub?: string;
  frase?: string;
  bio?: string;
  foto?: string;
  premios: string[];
  selos: SeloPremio[];
  marcas: string[];
  canal?: string;
  reel: { vimeo: string; thumb: string } | null;
  obras: Obra[];
};

/** Quem mostra os filmes da credencial em vez do canal de Vimeo. */
const DA_CREDENCIAL = new Set<string>(["cassio-caberlon"]);

type FilmeCredencial = { marca: string; titulo?: string; video: string };

/**
 * Filmes que entram só no site, depois dos da credencial. Na credencial
 * cada filme vira um slide (até 3 por diretor), então os extras ficam
 * aqui para não mexer na apresentação.
 */
const FILMES_SO_SITE: Record<string, FilmeCredencial[]> = {
  "cassio-caberlon": [
    { marca: "Stok Center", titulo: "Preço baixo com um tok a mais", video: "https://youtu.be/QJNq21MloFM" },
    { marca: "ParkShopping Canoas", video: "https://youtu.be/HBcURorfxjg" },
  ],
};

/**
 * Os filmes que a credencial escolheu para o diretor (até 3), em vez de
 * todos os jobs. YouTube vira miniatura direto; Vimeo pede a miniatura ao
 * oEmbed público (guardada por um dia).
 */
async function filmesDaCredencial(filmes: FilmeCredencial[]): Promise<Obra[]> {
  const out: Obra[] = [];
  for (const f of filmes) {
    const e = parseEmbedUrl(f.video);
    const base = { marca: f.marca.toLowerCase(), titulo: (f.titulo ?? "").toLowerCase() };
    if (e.kind === "youtube") {
      out.push({
        ...base,
        id: e.videoId,
        youtube: e.videoId,
        thumb: `https://img.youtube.com/vi/${e.videoId}/hqdefault.jpg`,
      });
    } else if (e.kind === "vimeo") {
      let thumb = "";
      try {
        const r = await fetch(
          `https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(f.video)}`,
          { next: { revalidate: 86400 } },
        );
        if (r.ok) thumb = (await r.json()).thumbnail_url ?? "";
      } catch {}
      if (thumb) out.push({ ...base, id: e.videoId, vimeo: e.videoId, thumb });
    }
  }
  return out;
}

export async function listarDiretores(): Promise<DiretorSite[]> {
  const lista = await Promise.all(
    NO_SITE.map(async (slug) => {
      const d = credencial.find((x) => x.id === slug);
      if (!d) return null;
      const v = obrasVimeo[slug];
      const obras = DA_CREDENCIAL.has(slug)
        ? await filmesDaCredencial([...d.filmes, ...(FILMES_SO_SITE[slug] ?? [])])
        : (v?.obras ?? []).map((o) => ({ ...o, vimeo: o.id }));
      const diretor: DiretorSite = {
        slug,
        nome: d.nome,
        sub: d.sub,
        frase: d.frase,
        bio: d.bio,
        foto: d.foto,
        premios: d.premios ?? [],
        selos: selosDe(d.premios),
        marcas: d.marcas ?? [],
        canal: v?.canal,
        reel: v?.reel ?? null,
        obras,
      };
      return diretor;
    }),
  );
  return lista.filter((d): d is DiretorSite => d !== null);
}

export async function acharDiretor(slug: string) {
  const todos = await listarDiretores();
  const i = todos.findIndex((d) => d.slug === slug);
  if (i < 0) return null;
  return {
    diretor: todos[i],
    anterior: todos[(i - 1 + todos.length) % todos.length],
    proximo: todos[(i + 1) % todos.length],
  };
}

export const slugsDiretores = (): string[] => [...NO_SITE];
