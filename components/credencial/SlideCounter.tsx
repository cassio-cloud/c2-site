type Props = {
  idx: number
  total: number
  theme?: "dark" | "light"
}

export function SlideCounter({ idx, total, theme = "dark" }: Props) {
  const color = theme === "dark" ? "rgba(239,239,239,0.32)" : "rgba(13,13,13,0.32)"
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-6 z-50 font-mono"
      style={{
        color,
        fontSize: 11,
        letterSpacing: "0.18em",
      }}
    >
      {pad(idx + 1)} / {pad(total)}
    </div>
  )
}
