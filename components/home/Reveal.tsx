"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type Tag = "div" | "article" | "section" | "li" | "ul" | "header" | "footer";

type Props = {
  children: ReactNode;
  /** Delay em ms antes do fade+translate começar. */
  delay?: number;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
};

/**
 * Reveal — wrapper que aplica fade-in + translate quando o elemento
 * entra no viewport. Espelha o IntersectionObserver do site legacy.
 *
 * Adiciona `[data-reveal]` no DOM; a classe `.is-visible` é setada
 * quando intersecciona com 6% antes da viewport.
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-6% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mergedStyle: CSSProperties = {
    ...style,
    ["--delay" as string]: `${delay}ms`,
  };

  const commonProps = {
    ref: ref as React.Ref<HTMLElement>,
    "data-reveal": "",
    className,
    style: mergedStyle,
    children,
  };

  // Render explícito por tag — mantém os tipos felizes sem precisar
  // de IntrinsicElements indexing (que estoura union complexity).
  switch (as) {
    case "article":
      return <article {...(commonProps as React.HTMLAttributes<HTMLElement>)} />;
    case "section":
      return <section {...(commonProps as React.HTMLAttributes<HTMLElement>)} />;
    case "li":
      return <li {...(commonProps as React.LiHTMLAttributes<HTMLLIElement>)} />;
    case "ul":
      return <ul {...(commonProps as React.HTMLAttributes<HTMLUListElement>)} />;
    case "header":
      return <header {...(commonProps as React.HTMLAttributes<HTMLElement>)} />;
    case "footer":
      return <footer {...(commonProps as React.HTMLAttributes<HTMLElement>)} />;
    default:
      return <div {...(commonProps as React.HTMLAttributes<HTMLDivElement>)} />;
  }
}
