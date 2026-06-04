"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Link "Voltar" que decide o destino baseado na origem da navegação.
 *
 * - Se o referrer for a home (/), aponta de volta pra ela
 * - Se for /trabalho (com qualquer ?tag=...), preserva os filtros
 * - Default (acesso direto, share link, etc): /trabalho
 *
 * Componente client porque precisa ler document.referrer no browser.
 */
type Target = { href: string; label: string };

const DEFAULT_TARGET: Target = {
  href: "/trabalho",
  label: "Voltar pra todos os cases",
};

export function BackLink() {
  const [target, setTarget] = useState<Target>(DEFAULT_TARGET);

  useEffect(() => {
    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;

      if (url.pathname === "/") {
        setTarget({ href: "/", label: "Voltar pra home" });
      } else if (url.pathname === "/trabalho") {
        setTarget({
          href: `/trabalho${url.search}`,
          label: "Voltar pra todos os cases",
        });
      }
    } catch {
      // URL inválida — mantém default
    }
  }, []);

  return (
    <Link
      href={target.href}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute-2 transition-colors hover:text-paper"
    >
      ← {target.label}
    </Link>
  );
}
