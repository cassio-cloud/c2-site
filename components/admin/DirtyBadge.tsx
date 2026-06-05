"use client";

import { useEffect, useState } from "react";
import { useDirtyStatus } from "./dirty-state";

/**
 * Badge persistente no header do admin que mostra o status:
 *   ✓ Tudo salvo · 16:42
 *   ⚠️ Mudanças não salvas
 *   Salvando…
 *   ⚠ Erro: <msg>
 */
export function DirtyBadge() {
  const status = useDirtyStatus();
  // Atualiza "há N segundos" a cada 30s
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((t) => t + 1), 30000);
    return () => clearInterval(i);
  }, []);

  const label = (() => {
    if (status.kind === "saving") return "Salvando…";
    if (status.kind === "dirty") return "Mudanças não salvas";
    if (status.kind === "error") return `Erro: ${status.message}`;
    if (status.kind === "clean" && status.lastSavedAt) {
      return `Salvo ${formatRelative(status.lastSavedAt)}`;
    }
    return "Pronto";
  })();

  const dotColor =
    status.kind === "saving"
      ? "bg-warn"
      : status.kind === "dirty"
        ? "bg-warn"
        : status.kind === "error"
          ? "bg-accent"
          : "bg-emerald-400";

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute-1">
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColor} ${
          status.kind === "saving" ? "animate-pulse" : ""
        }`}
      />
      <span>{label}</span>
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const date = new Date(ts);
  return `às ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
