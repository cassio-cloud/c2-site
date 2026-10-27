import Image from "next/image";
import { clientes, type ClienteLogo } from "@/data/credencial/clientes";
import { Reveal } from "./Reveal";

/**
 * Mesma área visual para todas as marcas: largura ∝ √proporção, altura
 * ∝ 1/√proporção (o mesmo cálculo do slide de clientes da credencial).
 * Medido em cqh da célula; tetos em % da célula garantem respiro.
 */
const AREA = 60;

/**
 * Quem abre a grade da home, nesta ordem; o resto segue a ordem da
 * credencial. A credencial em si não muda: o mural do deck foi
 * equilibrado à mão e tem a ordem dele.
 */
const DESTAQUE = ["Nomad", "Keeta", "Magalu", "Americanas", "Grêmio", "Husqvarna", "Odontoprev"];

/** Marcas que estão no site mas (ainda) não no mural da credencial. */
const SO_SITE: ClienteLogo[] = [
  // logo enviado pela C2 (já com fundo transparente), recortado rente
  { name: "Odontoprev", src: "/media/credencial/logos/odontoprev-logo.png", ratio: 5.97 },
];

const todos = [...clientes, ...SO_SITE];
const ordenados = [
  ...DESTAQUE.flatMap((n) => todos.filter((c) => c.name === n)),
  ...todos.filter((c) => !DESTAQUE.includes(c.name)),
];

/**
 * Clientes da home = os da credencial (data/credencial/clientes.ts):
 * mesma lista e os mesmos logos recortados, então site e apresentação
 * não divergem. Sem moldura: 8 por linha no desktop e 3 no resto, e a
 * última linha centraliza.
 */
export function Clientes() {
  return (
    <section id="clientes" className="section">
      <div className="wrap">
        <Reveal className="mb-12">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(44px, 6.8vw, 112px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            clientes.
          </h2>
        </Reveal>

        <div className="flex flex-wrap justify-center">
          {ordenados.map((logo) => (
            <div
              key={logo.name}
              className="flex aspect-[5/3] w-1/3 items-center justify-center lg:w-1/8"
              style={{ containerType: "size" }}
            >
              <div
                className="relative"
                style={{
                  width: `min(80cqw, ${(AREA * Math.sqrt(logo.ratio) * (logo.ajuste ?? 1)).toFixed(1)}cqh)`,
                  maxHeight: "64cqh",
                  aspectRatio: String(logo.ratio),
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 1024px) 26vw, 12vw"
                  className="object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
