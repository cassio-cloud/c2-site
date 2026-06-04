"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Link do logo. Se já estamos na home, faz smooth scroll pro topo
 * em vez de navegar (que seria no-op). Em outras rotas, navegação
 * normal pra /.
 */
export function LogoLink({
  children,
  className,
  style,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={className}
      style={style}
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}
