import type { Metadata } from "next"
import { SlideEngine } from "@/components/credencial/SlideEngine"

export const metadata: Metadata = {
  title: "Advertising · Diretores de cena",
  robots: { index: false, follow: false },
}

// A apresentação dos diretores de cena. O deck vive em components/credencial/decks.tsx.
export default function AdvertisingPage() {
  return <SlideEngine versao="advertising" />
}
