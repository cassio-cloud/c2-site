import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Elenco, type ElencoItem } from "@/components/diretores/Elenco";
import { listarDiretores } from "@/lib/diretores";
import { Contato } from "@/components/diretores/Contato";

export const metadata: Metadata = {
  title: "Diretores de cena parceiros",
  description:
    "Diretores de cena parceiros da C2 Content: Bia Flecha, John Porciúncula, Raoni Rodrigues, Diego Lisboa e Cássio Caberlon. Filmes, rolos e prêmios como Cannes Lions e New York Festivals.",
  alternates: { canonical: "/diretores" },
};

// os trabalhos do Cássio vêm dos cases, que o admin edita no Blob
export const dynamic = "force-dynamic";

/** Janelas e prévia são pequenas: a versão de 640px da miniatura basta. */
const leve = (src: string) => src.replace("d_1280", "d_640");

export default async function DiretoresPage() {
  const diretores = await listarDiretores();
  const itens: ElencoItem[] = diretores.map((d) => ({
    slug: d.slug,
    nome: d.nome,
    frames: d.obras.slice(0, 8).map((o) => ({
      src: leve(o.thumb),
      legenda: o.titulo ? `${o.marca}. ${o.titulo}` : `${o.marca}.`,
    })),
  }));

  return (
    <>
      {/* a aba é a única parte branca do site, e o índice é uma tela só:
          sem rolagem, nem o elástico do overscroll */}
      <style>{"html,body{background:#fff;height:100%;overflow:hidden;overscroll-behavior:none}"}</style>
      {/* sem JS os nomes não são medidos: aparecem no tamanho de partida */}
      <noscript>
        <style>{".caber{visibility:visible!important}"}</style>
      </noscript>
      <Header tone="light" />
      <main className="flex h-[100dvh] flex-col overflow-hidden bg-white text-ink">
        <div
          className="wrap flex min-h-0 flex-1 flex-col"
          style={{ paddingTop: "clamp(92px, 10vw, 132px)", paddingBottom: "clamp(20px, 3vw, 40px)" }}
        >
          <h1
            className="m-0 shrink-0 font-bold lowercase"
            style={{ fontSize: "clamp(17px, 1.4vw, 22px)", letterSpacing: "-0.025em" }}
          >
            diretores parceiros.
          </h1>
          <div className="min-h-0 flex-1 pt-[clamp(16px,3vw,40px)]">
            <Elenco itens={itens} />
          </div>
        </div>
        <Contato />
      </main>
    </>
  );
}
