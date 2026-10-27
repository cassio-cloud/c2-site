/**
 * Tags e ano de um trabalho, por cima da imagem, só no hover — embaixo
 * do tile fica apenas o título. Depende do `group` no ancestral (o tile).
 * Branco fixo: está sempre sobre imagem, em qualquer tema do site.
 */
export function TagsNoHover({ tags, ano }: { tags: string; ano?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-12 rotulo text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
    >
      <span>{tags}</span>
      {ano ? <span>{ano}</span> : null}
    </div>
  );
}
