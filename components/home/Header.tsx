import Link from "next/link";
import { LogoLink } from "@/components/nav/LogoLink";

/**
 * Topbar overlay sobre o hero. Sem barra de fundo;
 * text-shadow/drop-shadow leves dão legibilidade sobre vídeo.
 *
 * Usa `.wrap` igual às seções para garantir que o logo fique
 * pixel-aligned com os títulos `selected work.`, `estrutura.`, etc.
 */
export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
      style={{ paddingBlock: "clamp(18px, 2vw, 28px)" }}
    >
      <div className="wrap">
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          <LogoLink
            ariaLabel="C2 Content — home"
            className="pointer-events-auto justify-self-start text-paper transition-opacity hover:opacity-80"
            style={{ filter: "drop-shadow(0 1px 12px rgba(0,0,0,0.35))" }}
          >
            <C2Logo />
          </LogoLink>

          <nav
            className="pointer-events-auto flex items-center gap-10 font-semibold text-paper"
            style={{
              fontSize: "clamp(14px, 1.05vw, 16px)",
              textShadow: "0 1px 12px rgba(0,0,0,0.35)",
            }}
          >
            <NavLink href="/trabalho">Work</NavLink>
            <NavLink href="#time">About</NavLink>
          </nav>

          <Link
            href="#contato"
            className="pointer-events-auto justify-self-end font-semibold text-paper transition-opacity hover:opacity-70"
            style={{
              fontSize: "clamp(14px, 1.05vw, 16px)",
              textShadow: "0 1px 12px rgba(0,0,0,0.35)",
            }}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative transition-opacity hover:opacity-70 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-paper after:transition-[width] after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  );
}

/**
 * Marca C2. — SVG do brand kit inline (paper / fundo escuro).
 * Usa currentColor para herdar `text-paper` do parent.
 */
function C2Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120.37 56.99"
      role="img"
      aria-label="C2."
      style={{ height: "clamp(22px, 2.2vw, 32px)", width: "auto" }}
      className="block"
    >
      <g fill="currentColor">
        <path d="M25.68,56.99c-8.15,0-14.46-2.06-18.95-6.18C2.24,46.69,0,39.23,0,28.43S2.24,10.2,6.73,6.12C11.21,2.04,17.52,0,25.63,0s14.25,1.92,18.39,5.75c4.14,3.83,6.22,9.89,6.22,18.19h-12.6c0-6.66-1.03-10.82-3.09-12.49-2.06-1.67-5.06-2.5-9.01-2.5s-7.2.99-9.5,2.96-3.45,7.48-3.45,16.53,1.16,14.65,3.47,16.63c2.31,1.98,5.47,2.98,9.47,2.98s6.95-.87,9.01-2.6c2.06-1.73,3.09-5.88,3.09-12.43h12.6c0,8.16-2.07,14.2-6.22,18.11s-10.26,5.87-18.35,5.87Z" />
        <path d="M53.53,49.08c0-4.02,1.41-7.53,4.24-10.51,2.82-2.98,7.23-5.85,13.22-8.6,5.54-2.69,9.13-4.96,10.79-6.81,1.66-1.85,2.49-4.35,2.49-7.51s-.73-5.24-2.19-6.06c-1.46-.82-3.61-1.23-6.45-1.23-3.18,0-5.62.68-7.32,2.04-1.7,1.36-2.55,4.11-2.55,8.24h-12.35c0-6.16,1.84-10.81,5.54-13.95,3.69-3.14,9.25-4.7,16.69-4.7s12.89,1.35,16.18,4.04,4.94,6.52,4.94,11.49-1.55,8.98-4.64,12.03c-3.09,3.05-7.11,5.93-12.05,8.62-4.74,2.42-8.17,4.5-10.28,6.25-2.12,1.75-3.17,3.58-3.17,5.5h30.06v8.74h-43.13v-7.58Z" />
        <path d="M120.37,47.25v9.41h-11.62v-9.41h11.62Z" />
      </g>
    </svg>
  );
}
