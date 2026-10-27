import Link from "next/link";
import type { Case } from "@/lib/types";
import type { WorkTileSize } from "@/lib/work-layout";
import { TileMedia } from "@/components/home/TileMedia";
import { Reveal } from "@/components/home/Reveal";
import { fmtTag } from "@/lib/tags";
import { TagsNoHover } from "@/components/home/TagsNoHover";

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
          <TagsNoHover tags={tagLabel} ano={c2case.year} />
        </div>
        <p className="mt-3 text-sm text-paper">{c2case.title}</p>
      </Link>
    </Reveal>
  );
}
