import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ScrollResetOnReload } from "@/components/nav/ScrollResetOnReload";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://c2content.com.br"),
  title: {
    default: "C2 Content · where content meets craft.",
    template: "%s · C2 Content",
  },
  description:
    "Produtora audiovisual com estúdios em Novo Hamburgo (RS) e São Paulo (SP). Campanhas publicitárias, filmes, fotografia, conteúdo de marca e produções híbridas com IA.",
  // prévias grandes de imagem e vídeo no Google (Discover, resultados com mídia)
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
  },
  // Search Console: o código da tag HTML vai na env GOOGLE_SITE_VERIFICATION
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  keywords: [
    "produtora audiovisual",
    "produtora de vídeo",
    "C2 Content",
    "Novo Hamburgo",
    "São Paulo",
    "campanha publicitária",
    "filme",
    "produção de conteúdo",
    "IA generativa",
  ],
  authors: [{ name: "C2 Content" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "C2 Content",
    title: "C2 Content · where content meets craft.",
    description:
      "Produtora audiovisual em Novo Hamburgo e São Paulo. Campanhas, filmes, conteúdo e produções híbridas com IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "C2 Content · where content meets craft.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
      // o site é branco (globals.css); páginas de detalhe e o admin ficam
      // pretos com <SempreEscuro>, a credencial tem tema próprio
      data-tema="branco"
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <ScrollResetOnReload />
        {children}
      </body>
    </html>
  );
}
