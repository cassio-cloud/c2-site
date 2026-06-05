"use client";

import { useRef, useState, useTransition } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useEditableState, useDirtyController, useBeforeUnloadGuard } from "./dirty-state";
import { SortableMediaItem } from "./SortableMediaItem";
import { FILTER_TAGS, fmtTag } from "@/lib/tags";
import type { Case, MediaItem } from "@/lib/types";

export type CaseEditorPayload = {
  title: string;
  client: string;
  agency: string;
  director: string;
  year: string;
  description: string;
  tags: string[];
  featured: boolean;
  media: MediaItem[];
};

type Props = {
  slug: string;
  initial: Case;
  /** True em prod com Vercel Blob conectado. Em dev local, false. */
  blobMode: boolean;
  /** Server actions injected pelo page server component. */
  actions: {
    save: (payload: CaseEditorPayload) => Promise<void>;
    /** Upload via Server Action — limitado a ~4.5MB na Vercel Hobby. */
    uploadFiles: (formData: FormData) => Promise<MediaItem[]>;
    /** Anexa items que JÁ subiram pro Blob (vindo de client upload). */
    attachMedia: (items: MediaItem[]) => Promise<void>;
    deleteCase: () => Promise<void>;
  };
};

export function CaseEditorClient({ slug, initial, blobMode, actions }: Props) {
  useBeforeUnloadGuard();
  const { markSaving, markSaved, markError } = useDirtyController();

  const [title, setTitle] = useEditableState(initial.title);
  const [client, setClient] = useEditableState(initial.client);
  const [agency, setAgency] = useEditableState(initial.agency);
  const [director, setDirector] = useEditableState(initial.director);
  const [year, setYear] = useEditableState(initial.year);
  const [description, setDescription] = useEditableState(initial.description);
  const [tagsStr, setTagsStr] = useEditableState(initial.tags.join(", "));
  const [featured, setFeatured] = useEditableState(initial.featured);
  const [media, setMedia, resetMedia] = useEditableState<MediaItem[]>(
    initial.media,
  );
  const [embedUrl, setEmbedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = media.findIndex((m) => m.src === active.id);
    const newIndex = media.findIndex((m) => m.src === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setMedia(arrayMove(media, oldIndex, newIndex));
  }

  async function handleSave() {
    markSaving();
    try {
      await actions.save({
        title,
        client,
        agency,
        director,
        year,
        description,
        tags: tagsStr
          .split(/[,\s]+/)
          .map((t) =>
            t
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "")
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
          )
          .filter(Boolean),
        featured,
        media,
      });
      markSaved();
    } catch (e) {
      markError(e instanceof Error ? e.message : "Falha ao salvar");
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: MediaItem[] = [];
      if (blobMode) {
        // Client upload: arquivo vai DIRETO pro Blob via signed URL.
        // Bypassa o limite de ~4.5MB do Server Action no Hobby tier.
        for (const file of Array.from(files)) {
          const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
          const isVideo = ["mp4", "mov", "webm"].includes(ext);
          // Timestamp + index pra evitar colisão na mesma seleção.
          const idx = added.length;
          const pathname = `c2/media/cases/${slug}/${Date.now()}-${idx}.${ext}`;
          const blob = await upload(pathname, file, {
            access: "public",
            handleUploadUrl: "/api/blob-upload",
          });
          added.push({
            type: isVideo ? "video" : "image",
            src: blob.url,
          });
        }
        await actions.attachMedia(added);
      } else {
        // Dev local: passa pelo Server Action (filesystem).
        const fd = new FormData();
        for (const f of Array.from(files)) fd.append("files", f);
        const result = await actions.uploadFiles(fd);
        added.push(...result);
      }
      setMedia([...media, ...added]);
      markSaved();
    } catch (e) {
      markError(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAddEmbed() {
    const url = embedUrl.trim();
    if (!url) return;
    setMedia([...media, { type: "embed", src: url }]);
    setEmbedUrl("");
  }

  function handleRemoveMedia(src: string) {
    setMedia(media.filter((m) => m.src !== src));
  }

  async function handleDelete() {
    if (!confirm(`Deletar o case "${initial.title}"? Essa ação é irreversível.`))
      return;
    startTransition(async () => {
      try {
        await actions.deleteCase();
      } catch (e) {
        markError(e instanceof Error ? e.message : "Falha ao deletar");
      }
    });
  }

  return (
    <section className="section">
      <div className="wrap max-w-4xl">
        <Link
          href="/admin"
          className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
        >
          ← Cases
        </Link>

        <h1
          className="mt-6 font-bold lowercase tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 48px)", letterSpacing: "-0.04em" }}
        >
          {initial.title}
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
          slug: {slug}
        </p>

        <div className="mt-10 space-y-6">
          <Field name="title" label="Título" value={title} onChange={setTitle} />
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="client" label="Cliente" value={client} onChange={setClient} />
            <Field name="agency" label="Agência" value={agency} onChange={setAgency} />
            <Field name="director" label="Direção" value={director} onChange={setDirector} />
            <Field name="year" label="Ano" value={year} onChange={setYear} />
          </div>

          <Field
            name="tags"
            label={`Tags (separe por vírgula · oficiais: ${FILTER_TAGS.map(fmtTag).join(" · ")})`}
            value={tagsStr}
            onChange={setTagsStr}
          />

          <Textarea
            name="description"
            label="Descrição"
            value={description}
            onChange={setDescription}
            rows={6}
          />

          <label className="flex items-center gap-3 text-sm text-paper">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-paper"
            />
            Featured (aparece na home)
          </label>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(initial.title);
                setClient(initial.client);
                setAgency(initial.agency);
                setDirector(initial.director);
                setYear(initial.year);
                setDescription(initial.description);
                setTagsStr(initial.tags.join(", "));
                setFeatured(initial.featured);
                resetMedia();
              }}
              className="rounded border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 hover:border-mute-2 hover:text-paper"
            >
              Reverter
            </button>
            <Link
              href={`/trabalho/${slug}`}
              target="_blank"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
            >
              Ver case →
            </Link>
          </div>
        </div>

        <hr className="my-16 border-line" />

        <div className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold" style={{ fontSize: "20px" }}>
              Mídias ({media.length})
            </h2>
            {uploading ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warn">
                Enviando…
              </span>
            ) : null}
          </div>

          {/* Upload (imediato — não em batch) */}
          <div className="grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_auto]">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/mp4,video/quicktime,video/webm"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files)}
              className="text-sm text-paper file:mr-4 file:rounded file:border file:border-line file:bg-ink-3 file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-paper disabled:opacity-50"
            />
            <span className="self-center font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
              {blobMode
                ? "Upload direto ao Blob · até 500MB"
                : "Upload local · até 4MB"}
            </span>
          </div>

          {/* Embed (em batch — só salva ao clicar Salvar acima) */}
          <div className="grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_auto]">
            <input
              type="url"
              placeholder="https://youtu.be/... ou https://vimeo.com/..."
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
            />
            <button
              type="button"
              onClick={handleAddEmbed}
              disabled={!embedUrl.trim()}
              className="rounded border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink-3 disabled:opacity-40"
            >
              + Adicionar link
            </button>
          </div>

          <p className="text-xs text-mute-2">
            Arraste pelo ícone ≡ pra reordenar. A primeira mídia é a capa.
            Mudanças no array de mídias salvam quando você clicar “Salvar”.
          </p>

          {media.length === 0 ? (
            <p className="text-sm text-mute-2">Nenhuma mídia ainda.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={media.map((m) => m.src)}
                strategy={rectSortingStrategy}
              >
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {media.map((m, i) => (
                    <SortableMediaItem
                      key={m.src}
                      id={m.src}
                      item={m}
                      index={i}
                      total={media.length}
                      onRemove={() => handleRemoveMedia(m.src)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <hr className="my-16 border-line" />

        <button
          type="button"
          onClick={handleDelete}
          className="rounded border border-accent/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10"
        >
          Deletar case
        </button>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-line bg-transparent py-2 text-paper outline-none focus:border-paper"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  value,
  onChange,
  rows = 4,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y border border-line bg-ink-2/30 px-3 py-2 text-paper outline-none focus:border-paper"
      />
    </label>
  );
}
