import Link from "next/link";
import type { Case } from "@/lib/types";
import type { TileLayout } from "@/lib/home-layout";
import { TileMedia } from "./TileMedia";
import { Reveal } from "./Reveal";

const COL_CLASSES: Record<TileLayout["col"], string> = {
  4: "md:col-span-4 col-span-12",
  5: "md:col-span-5 col-span-12",
  6: "md:col-span-6 col-span-12",
  7: "md:col-span-7 col-span-12",
  8: "md:col-span-8 col-span-12",
  12: "col-span-12",
};

type Props = {
  layout: TileLayout;
  c2case: Case;
  index: number;
};

export function BentoTile({ layout, c2case, index }: Props) {
  const cover = c2case.media[0];
  const ratio = layout.ratio ?? "4/5";

  return (
    <Reveal
      as="article"
      delay={(index % 3) * 80}
      className={`group ${COL_CLASSES[layout.col]}`}
    >
      <Link href={`/trabalho/${c2case.slug}`} className="block">
        <div
          className="relative overflow-hidden bg-ink-3"
          style={{ aspectRatio: ratio }}
        >
          {cover ? <TileMedia cover={cover} alt={c2case.title} /> : null}
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4 text-paper">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
              {layout.tag}
            </p>
            <p className="mt-1 text-sm">{c2case.title}</p>
          </div>
          <span className="font-mono text-xs text-mute-2">{c2case.year}</span>
        </div>
      </Link>
    </Reveal>
  );
}
