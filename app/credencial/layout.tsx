import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Credencial · C2 Content",
  description: "Apresentação comercial C2 Content — where content meets craft.",
  robots: { index: false, follow: false },
}

export default function CredencialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="relative w-screen overflow-hidden bg-ink text-paper"
      style={{
        height: "100dvh",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {children}
    </div>
  )
}
