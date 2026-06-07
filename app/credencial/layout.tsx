import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Credencial · C2 Content",
  description: "Apresentação comercial C2 Content — where content meets craft.",
  robots: { index: false, follow: false },
}

// Trava a apresentação na proporção da tela do aparelho: sem zoom por gesto,
// respeitando o notch/safe-area (viewport-fit=cover).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function CredencialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="bg-ink text-paper"
      style={{
        // position:fixed + inset:0 trava a tela mesmo quando a barra de
        // endereço do mobile aparece/some (evita reflow do 100dvh).
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {children}
    </div>
  )
}
