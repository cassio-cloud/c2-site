"use client";

import { useEffect } from "react";

/**
 * Força scroll pro topo apenas em REFRESH/RELOAD.
 *
 * Navegação back/forward continua preservando o scroll (UX padrão).
 * Detecção via PerformanceNavigationTiming.type — 'reload' indica
 * F5/Cmd-R, 'navigate' é click direto na URL ou via link.
 */
export function ScrollResetOnReload() {
  useEffect(() => {
    try {
      const nav = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload" || nav?.type === "navigate") {
        window.scrollTo(0, 0);
      }
    } catch {
      // Performance API indisponível — ignora silenciosamente
    }
  }, []);
  return null;
}
