import Link from "next/link";
import type { Case } from "@/lib/types";
import type { WorkTileSize } from "@/lib/work-layout";
import { TileMedia } from "@/components/home/TileMedia";
import { Reveal } from "@/components/home/Reveal";
import { fmtTag } from "@/lib/tags";

const COL_CLASSES: Record<WorkTileSize["col"], string> = {
  4: "md:col-span-4 col-span-12",
  6: "md:col-span-6 col-span-12",
  8: "md:col-span-8 col-span-12",
  12: "col-span-12",
};

type Props = {
  c2case: Case;
  size: WorkTileSize;
  index: number;
};

export function WorkTile({ c2case, size, index }: Props) {
  const cover = c2case.media[0];
  const tagLabel = c2case.tags.map(fmtTag).join(" · ");

  return (
    <Reveal
      as="article"
      delay={(index % 3) * 80}
      className={`group ${COL_CLASSES[size.col]}`}
    >
      <Link href={`/trabalho/${c2case.slug}`} className="block">
        <div
          className="relative overflow-hidden bg-ink-3"
          style={{ aspectRatio: size.ratio }}
        >
          {cover ? <TileMedia cover={cover} alt={c2case.title} /> : null}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4 text-paper">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
              {tagLabel}
            </p>
            <p className="mt-1 text-sm">{c2case.title}</p>
          </div>
          <span className="font-mono text-xs text-mute-2">{c2case.year}</span>
        </div>
      </Link>
    </Reveal>
  );
}
