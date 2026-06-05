"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MediaItem } from "@/lib/types";
import { mediaSrc } from "@/lib/media-url";
import { parseEmbedUrl } from "@/lib/embed";

type Props = {
  id: string;
  item: MediaItem;
  index: number;
  total: number;
  onRemove: () => void;
};

/**
 * Item individual da lista sortable de mídias.
 * Drag-handle é o ícone ≡ no canto superior esquerdo.
 * Renderiza preview apropriado conforme o tipo (image/video/embed).
 */
export function SortableMediaItem({
  id,
  item,
  index,
  total,
  onRemove,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group relative aspect-[4/5] overflow-hidden bg-ink-3"
    >
      <MediaPreview item={item} />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-ink/80 p-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label="Arrastar pra reordenar"
            className="cursor-grab touch-none rounded border border-line/30 px-1 py-0.5 text-mute-1 hover:bg-line/30 active:cursor-grabbing"
          >
            ≡
          </button>
          <span>
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            {index === 0 ? " · capa" : ""}
          </span>
        </div>
        <span className="text-mute-2">{item.type}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-ink/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover mídia"
          className="rounded border border-accent/30 px-2 py-1 font-mono text-[10px] text-accent hover:bg-accent/10"
        >
          ×
        </button>
      </div>
    </li>
  );
}

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.type === "embed") {
    const src = parseEmbedUrl(item.src);
    if (src.kind === "youtube" || src.kind === "vimeo") {
      return (
        <div className="grid h-full place-items-center bg-gradient-to-br from-ink-3 to-ink-2 text-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
              {src.kind === "youtube" ? "YouTube" : "Vimeo"}
            </p>
            <p className="mt-2 break-all px-3 text-[10px] text-mute-2">
              {src.videoId}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="grid h-full place-items-center text-mute-2">URL inválida</div>
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={mediaSrc(item.src)}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mediaSrc(item.src)}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );
}
