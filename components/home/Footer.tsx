/**
 * Footer com tagline grande + asterisco + linha tri-col abaixo
 * (copyright | tagline mono | versão).
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        paddingTop: "clamp(48px, 6vw, 96px)",
        paddingBottom: "clamp(20px, 2vw, 32px)",
      }}
    >
      <div className="wrap">
        <div className="flex items-center gap-5">
          <Asterisk />
          <p
            className="font-bold tracking-tight"
            style={{
              fontSize: "clamp(20px, 2vw, 30px)",
              letterSpacing: "-0.025em",
            }}
          >
            Where content meets craft.
          </p>
        </div>

        <hr className="mt-16 border-line" />

        <div className="mt-6 grid grid-cols-1 gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2 md:grid-cols-3 md:items-center">
          <p className="md:justify-self-start">
            © {year} C2 Content · Todos os direitos reservados
          </p>
          <p className="md:justify-self-center">Where content meets craft</p>
          <p className="md:justify-self-end">v2.6 · sinal</p>
        </div>
      </div>
    </footer>
  );
}

/** Asterisco do brand kit. Gira em hover sutilmente como detalhe. */
function Asterisk() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="C2 asterisk"
      style={{ height: "clamp(20px, 2vw, 30px)", width: "auto", flexShrink: 0 }}
      className="text-paper c2-spin"
    >
      <g fill="currentColor">
        <rect x="44" y="2" width="12" height="96" rx="1" />
        <rect
          x="44"
          y="2"
          width="12"
          height="96"
          rx="1"
          transform="rotate(45 50 50)"
        />
        <rect
          x="44"
          y="2"
          width="12"
          height="96"
          rx="1"
          transform="rotate(90 50 50)"
        />
        <rect
          x="44"
          y="2"
          width="12"
          height="96"
          rx="1"
          transform="rotate(135 50 50)"
        />
      </g>
    </svg>
  );
}
