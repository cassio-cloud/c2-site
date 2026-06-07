type Props = {
  theme?: "dark" | "light"
}

export function C2LogoMark({ theme = "dark" }: Props) {
  const color = theme === "dark" ? "var(--paper)" : "var(--ink)"
  return (
    <div
      className="pointer-events-none fixed left-6 top-5 z-50 font-bold"
      style={{
        color,
        fontSize: 18,
        letterSpacing: "-0.02em",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      C2.
    </div>
  )
}
