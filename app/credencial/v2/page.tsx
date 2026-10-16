import type { Metadata } from "next"
import { SlideEngine } from "@/components/credencial/SlideEngine"

export const metadata: Metadata = {
  title: "Credencial · Diretores de cena · C2 Content",
  robots: { index: false, follow: false },
}

// V2: a empresa + diretores de cena. O deck vive em components/credencial/decks.tsx.
export default function CredencialV2Page() {
  return <SlideEngine versao="v2" />
}
