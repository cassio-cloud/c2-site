"use client";

/**
 * DirtyState — context simples pra rastrear estado de salvamento
 * em qualquer página do admin. Cada editor batch chama
 * `useDirtyController()` pra reportar quando o form fica sujo
 * e quando salva com sucesso/erro.
 *
 * O `<DirtyBadge>` no header do admin (renderizado em
 * authed/layout.tsx) lê esse estado e mostra o feedback.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SaveStatus =
  | { kind: "clean"; lastSavedAt: number | null }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "error"; message: string };

type DirtyContextValue = {
  status: SaveStatus;
  /** Editor reporta: começou a editar. */
  markDirty: () => void;
  /** Editor reporta: enviando ao servidor. */
  markSaving: () => void;
  /** Editor reporta: salvou com sucesso. */
  markSaved: () => void;
  /** Editor reporta: falhou. */
  markError: (message: string) => void;
};

const DirtyContext = createContext<DirtyContextValue | null>(null);

export function DirtyProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SaveStatus>({
    kind: "clean",
    lastSavedAt: null,
  });

  const value = useMemo<DirtyContextValue>(
    () => ({
      status,
      markDirty: () => setStatus({ kind: "dirty" }),
      markSaving: () => setStatus({ kind: "saving" }),
      markSaved: () =>
        setStatus({ kind: "clean", lastSavedAt: Date.now() }),
      markError: (message) => setStatus({ kind: "error", message }),
    }),
    [status],
  );

  return (
    <DirtyContext.Provider value={value}>{children}</DirtyContext.Provider>
  );
}

/** Hook usado pelo editor (form) pra reportar mudanças. */
export function useDirtyController() {
  const ctx = useContext(DirtyContext);
  if (!ctx) throw new Error("useDirtyController must be inside DirtyProvider");
  return ctx;
}

/** Hook usado pelo badge (display). */
export function useDirtyStatus(): SaveStatus {
  const ctx = useContext(DirtyContext);
  return ctx?.status ?? { kind: "clean", lastSavedAt: null };
}

/**
 * Avisa o user antes de sair com mudanças não salvas.
 * Usar em conjunto com um editor batch.
 */
export function useBeforeUnloadGuard() {
  const { status } = useDirtyController();
  useEffect(() => {
    if (status.kind !== "dirty") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status.kind]);
}

/**
 * Useful helper pra editor: compara o snapshot inicial com o atual
 * e marca dirty / clean automaticamente.
 */
export function useTrackDirty<T>(initial: T, current: T) {
  const { markDirty, markSaved, status } = useDirtyController();
  const initialStr = useMemo(() => JSON.stringify(initial), [initial]);
  const currentStr = useMemo(() => JSON.stringify(current), [current]);

  useEffect(() => {
    if (currentStr === initialStr) {
      if (status.kind === "dirty") markSaved();
    } else if (status.kind === "clean") {
      markDirty();
    }
  }, [initialStr, currentStr, status.kind, markDirty, markSaved]);
}

/** Wrapper conveniente pra useState que reporta dirty automaticamente. */
export function useEditableState<T>(initial: T): [T, (next: T) => void, () => void] {
  const [value, setValue] = useState(initial);
  const { markDirty } = useDirtyController();
  const set = useCallback(
    (next: T) => {
      markDirty();
      setValue(next);
    },
    [markDirty],
  );
  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, set, reset];
}
