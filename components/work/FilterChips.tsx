import Link from "next/link";
import { FILTER_TAGS, fmtTag, type CanonicalTag } from "@/lib/tags";

type Props = {
  active: string | null;
  counts: Record<string, number>;
  total: number;
};

/**
 * Filtros como Links (não botões) — o ?tag=X muda o URL e o Next
 * re-renderiza a página com o searchParam novo. Sem JavaScript.
 * Garante SEO: cada filtro tem URL própria, crawleável.
 */
export function FilterChips({ active, counts, total }: Props) {
  const chip = (
    href: string,
    label: string,
    count: number,
    isActive: boolean,
  ) => (
    <Link
      key={href}
      href={href}
      className={`group inline-flex items-baseline gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
        isActive
          ? "border-paper bg-paper text-ink"
          : "border-line text-mute-1 hover:border-mute-2 hover:text-paper"
      }`}
    >
      <span>{label}</span>
      <span
        className={`font-mono text-[9px] ${isActive ? "text-ink/60" : "text-mute-3"}`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </Link>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {chip("/trabalho", "Todos", total, active === null)}
      {FILTER_TAGS.map((t: CanonicalTag) =>
        chip(`/trabalho?tag=${t}`, fmtTag(t), counts[t] ?? 0, active === t),
      )}
    </div>
  );
}
