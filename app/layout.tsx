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
    default: "C2 Content — where content meets craft.",
    template: "%s · C2 Content",
  },
  description:
    "Produtora audiovisual brasileira em Novo Hamburgo e São Paulo. Campanhas, conteúdo e produções híbridas com IA.",
  keywords: [
    "produtora audiovisual",
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
    title: "C2 Content — where content meets craft.",
    description:
      "Produtora audiovisual brasileira. Campanhas, conteúdo e produções híbridas com IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "C2 Content — where content meets craft.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <ScrollResetOnReload />
        {children}
      </body>
    </html>
  );
}
