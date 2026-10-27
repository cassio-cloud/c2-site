import { readCasesCached } from "@/lib/cases";
import { HOME_IA } from "@/lib/home-layout";
import { BentoTile } from "./BentoTile";
import { Reveal } from "./Reveal";
import { JanelaCiclo } from "./JanelaCiclo";
import { PreviaCursor, type Previa } from "./PreviaCursor";

/** Frames dos cases de IA da home (as versões 1920px da credencial). */
const L = "/media/credencial/lib2";
const PREVIAS_IA: Previa[] = [
  { src: `${L}/ia-goat/01.jpg`, legenda: "The Goat Collection" },
  { src: `${L}/ia-gremio/01.jpg`, legenda: "Grêmio · New Balance" },
  { src: `${L}/ia-carrano/01.jpg`, legenda: "Carrano · Summer 25" },
  { src: `${L}/ia-baikal/01.jpg`, legenda: "Golden Lake · Lançamento Baikal" },
  { src: `${L}/ia-goat/02.jpg`, legenda: "The Goat Collection" },
  { src: `${L}/ia-gremio/03.jpg`, legenda: "Grêmio · New Balance" },
  { src: `${L}/ia-carrano/02.jpg`, legenda: "Carrano · Summer 25" },
  { src: `${L}/ia-baikal/02.jpg`, legenda: "Golden Lake · Lançamento Baikal" },
];
/** A janela do título corta entre os mesmos trabalhos, mais devagar. */
const FOTOS_IA = PREVIAS_IA.slice(0, 4).map((p) => p.src);

export async function IaSection() {
  const cases = await readCasesCached();
  const bySlug = new Map(cases.map((c) => [c.slug, c]));

  return (
    // menos respiro em cima: a seção anterior já termina com bastante espaço
    <section id="ia" className="section" style={{ paddingTop: "clamp(32px, 4vw, 72px)" }}>
      <div className="wrap">
        {/* título na largura toda, em negrito, com UMA janela de fotos dos
            cases de IA. Passando o mouse no título, os trabalhos surgem
            seguindo o cursor (o gesto do índice de /diretores).
            Sem `lowercase`: "IA" é sempre maiúsculo, o resto já vai em
            minúscula no texto. */}
        <Reveal className="mb-10">
          <PreviaCursor previas={PREVIAS_IA}>
            <h2
              className="h-display font-bold tracking-tight"
              style={{
                fontSize: "clamp(40px, 7.4vw, 128px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.98,
                textWrap: "pretty",
              }}
            >
              a <span className="sm:whitespace-nowrap">IA<JanelaCiclo fotos={FOTOS_IA} /></span>{" "}
              democratizou{" "}
              {/* "a produção." e "não o" quebram juntos: artigo nunca fica
                  pendurado no fim da linha */}
              <span className="whitespace-nowrap">a&nbsp;produção.</span>{" "}
              <span className="text-mute-2">
                <span className="whitespace-nowrap">não&nbsp;o</span> critério.
              </span>
            </h2>
          </PreviaCursor>
        </Reveal>

        <Reveal delay={120} className="mb-16 grid lg:grid-cols-12">
          <p
            className="max-w-md text-mute-1 lg:col-span-5 lg:col-start-8"
            style={{ fontSize: "clamp(16px, 1.2vw, 19px)" }}
          >
            Trabalhamos com IA antes dela virar assunto. Onde entrega, não onde
            aparece. Decisão técnica, não modismo.
          </p>
        </Reveal>

        <div className="space-y-20">
          {HOME_IA.map((group) => (
            <div key={group.label}>
              <Reveal className="mb-6 flex items-end justify-between border-b border-line pb-3">
                <p className="rotulo text-mute-1">
                  {group.label}
                </p>
                <p className="rotulo text-mute-3">
                  {String(group.tiles.length).padStart(2, "0")} cases
                </p>
              </Reveal>
              <div
                className="grid grid-cols-12"
                style={{
                  columnGap: "clamp(12px, 1.4vw, 24px)",
                  rowGap: "clamp(32px, 3.5vw, 56px)",
                }}
              >
                {group.tiles.map((layout, i) => {
                  const c = bySlug.get(layout.slug);
                  if (!c) return null;
                  return (
                    <BentoTile
                      key={layout.slug}
                      layout={layout}
                      c2case={c}
                      index={i}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
