import type { ReactNode } from "react";

/**
 * Páginas de detalhe (um trabalho, um diretor) são sempre pretas, mesmo
 * quando o site está no tema branco: o índice é claro, o detalhe escuro.
 *
 * `data-tema-fixo="escuro"` devolve os tokens escuros a tudo que está
 * dentro (globals.css); o <style> pinta o fundo da página inteira, para o
 * overscroll e as bordas não aparecerem brancas. Ele só existe enquanto a
 * página está montada, então não vaza para o resto do site.
 */
export function SempreEscuro({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{'html[data-tema="branco"],html[data-tema="branco"] body{background:#000}'}</style>
      <div data-tema-fixo="escuro" className="flex min-h-[100dvh] flex-col bg-ink text-paper">
        {children}
      </div>
    </>
  );
}
