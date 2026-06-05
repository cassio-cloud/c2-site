"use client";

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
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useState } from "react";
import { useDirtyController, useBeforeUnloadGuard } from "./dirty-state";
import { fmtTag } from "@/lib/tags";
import type { Case } from "@/lib/types";

export type OrderPayload = { slug: string; featured: boolean }[];

type Props = {
  initial: Case[];
  actions: {
    saveOrder: (payload: OrderPayload) => Promise<void>;
    deleteCase: (slug: string) => Promise<void>;
    addCase: (formData: FormData) => Promise<void>;
  };
};

/**
 * Lista de cases no admin com batch save:
 * - Drag-and-drop pela ≡ pra reordenar
 * - Toggle Featured/Hidden em batch
 * - Botão Salvar persiste ordem + featured de uma vez
 *
 * Operações imediatas (sem batch): Add, Delete, Editar (navega)
 */
export function CasesListClient({ initial, actions }: Props) {
  useBeforeUnloadGuard();
  const { markSaving, markSaved, markError, markDirty } = useDirtyController();
  const [cases, setCases] = useState<Case[]>(initial);
  const initialOrder = useState(() =>
    initial.map((c) => `${c.slug}:${c.featured ? 1 : 0}`).join("|"),
  )[0];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function isDirty() {
    return (
      cases.map((c) => `${c.slug}:${c.featured ? 1 : 0}`).join("|") !==
      initialOrder
    );
  }

  function maybeDirty(next: Case[]) {
    setCases(next);
    if (
      next.map((c) => `${c.slug}:${c.featured ? 1 : 0}`).join("|") !==
      initialOrder
    ) {
      markDirty();
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cases.findIndex((c) => c.slug === active.id);
    const newIndex = cases.findIndex((c) => c.slug === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    maybeDirty(arrayMove(cases, oldIndex, newIndex));
  }

  function toggleFeatured(slug: string) {
    maybeDirty(
      cases.map((c) =>
        c.slug === slug ? { ...c, featured: !c.featured } : c,
      ),
    );
  }

  async function handleSave() {
    markSaving();
    try {
      await actions.saveOrder(
        cases.map((c) => ({ slug: c.slug, featured: c.featured })),
      );
      markSaved();
    } catch (e) {
      markError(e instanceof Error ? e.message : "Falha ao salvar");
    }
  }

  function handleReset() {
    setCases(initial);
    markSaved();
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1
              className="font-bold lowercase tracking-tight"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                letterSpacing: "-0.04em",
              }}
            >
              cases.
            </h1>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2">
              {cases.length} cases · {cases.filter((c) => c.featured).length} featured
            </p>
          </div>
          {isDirty() ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 hover:border-mute-2 hover:text-paper"
              >
                Reverter
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
              >
                Salvar ordem · featured
              </button>
            </div>
          ) : null}
        </div>

        {/* Add new — imediato */}
        <form
          action={actions.addCase}
          className="mb-10 grid gap-3 border border-line bg-ink-2/30 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <input
            name="slug"
            placeholder="slug-do-case"
            required
            className="border-b border-line bg-transparent px-2 py-2 font-mono text-sm outline-none focus:border-paper"
          />
          <input
            name="title"
            placeholder="Título do case"
            required
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <input
            name="tags"
            placeholder="tags separadas por vírgula"
            className="border-b border-line bg-transparent px-2 py-2 text-sm outline-none focus:border-paper"
          />
          <button
            type="submit"
            className="rounded bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-80"
          >
            + Adicionar
          </button>
        </form>

        <p className="mb-4 text-xs text-mute-2">
          Arraste pelo ícone ≡ pra reordenar. Featured/Hidden e ordem salvam
          quando você clicar “Salvar”.
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cases.map((c) => c.slug)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="divide-y divide-line border-t border-b border-line">
              {cases.map((c) => (
                <CaseRow
                  key={c.slug}
                  case_={c}
                  onToggleFeatured={() => toggleFeatured(c.slug)}
                  onDelete={async () => {
                    if (!confirm(`Deletar "${c.title}"?`)) return;
                    try {
                      await actions.deleteCase(c.slug);
                      setCases(cases.filter((x) => x.slug !== c.slug));
                    } catch (e) {
                      markError(
                        e instanceof Error ? e.message : "Falha ao deletar",
                      );
                    }
                  }}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}

function CaseRow({
  case_,
  onToggleFeatured,
  onDelete,
}: {
  case_: Case;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: case_.slug });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : 1,
    background: isDragging ? "var(--ink-2)" : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar pra reordenar"
        className="cursor-grab touch-none rounded border border-line/40 px-2 py-1 font-mono text-xs text-mute-1 hover:bg-line/30 active:cursor-grabbing"
      >
        ≡
      </button>

      <div className="min-w-0">
        <p className="truncate text-paper">{case_.title}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
          {case_.tags.map(fmtTag).join(" · ") || "—"} · {case_.year} ·{" "}
          {case_.media.length} mídia{case_.media.length === 1 ? "" : "s"}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleFeatured}
        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
          case_.featured
            ? "border-paper bg-paper text-ink"
            : "border-line text-mute-2 hover:border-mute-2 hover:text-paper"
        }`}
      >
        {case_.featured ? "Featured" : "Hidden"}
      </button>

      <Link
        href={`/admin/cases/${case_.slug}`}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
      >
        Editar →
      </Link>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Deletar"
        className="rounded border border-accent/30 px-2 py-1 font-mono text-[10px] text-accent transition-colors hover:bg-accent/10"
      >
        ×
      </button>
    </li>
  );
}
