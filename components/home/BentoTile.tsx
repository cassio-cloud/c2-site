import Link from "next/link";
import type { Case } from "@/lib/types";
import type { TileLayout } from "@/lib/home-layout";
import { TileMedia } from "./TileMedia";
import { TagsNoHover } from "./TagsNoHover";
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
  // "first-video" sem vídeo no case cai de volta na primeira mídia, então
  // um case editado no admin nunca fica com o tile vazio.
  const cover =
    (layout.cover === "first-video"
      ? c2case.media.find((m) => m.type === "video")
      : layout.cover === "first-image"
        ? c2case.media.find((m) => m.type === "image")
        : layout.cover) ?? c2case.media[0];
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
          <TagsNoHover tags={layout.tag} ano={c2case.year} />
        </div>

        <p className="mt-3 text-sm text-paper">{c2case.title}</p>
      </Link>
    </Reveal>
  );
}
