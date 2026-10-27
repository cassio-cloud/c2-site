import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/home/Header";
import { SempreEscuro } from "@/components/SempreEscuro";
import { Rolo } from "@/components/diretores/Rolo";
import { Obras } from "@/components/diretores/Obras";
import { Sobre } from "@/components/diretores/Sobre";
import { CONTATO_DIRETORES as C } from "@/components/diretores/Contato";
import { ContatoSecao } from "@/components/home/Contact";
import { acharDiretor, slugsDiretores } from "@/lib/diretores";

type Props = {
  params: Promise<{ slug: string }>;
};

// os trabalhos do Cássio vêm dos cases, que o admin edita no Blob
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return slugsDiretores().map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const achado = await acharDiretor(slug);
  if (!achado) return { title: "Diretor não encontrado" };
  const d = achado.diretor;
  const desc = (d.frase ? `${d.frase} ` : "") + "Diretor parceiro da C2 Content.";
  const og = d.reel?.thumb ?? d.obras[0]?.thumb;
  return {
    title: `${d.nome} · Diretores parceiros`,
    description: desc,
    openGraph: {
      title: `${d.nome} · C2 Content`,
      description: desc,
      images: og ? [{ url: og }] : undefined,
    },
  };
}

export default async function DiretorPage(props: Props) {
  const { slug } = await props.params;
  const achado = await acharDiretor(slug);
  if (!achado) notFound();
  const { diretor: d, anterior, proximo } = achado;

  return (
    <SempreEscuro>
      <Header />
      <main className="text-paper">
        <div className="wrap" style={{ paddingTop: "clamp(128px, 13vw, 196px)" }}>
          <Link
            href="/diretores"
            className="toque text-[14px] font-semibold text-mute-2 transition-colors hover:text-paper"
          >
            ← diretores parceiros
          </Link>

          <h1
            className="mt-6 font-extrabold lowercase"
            style={{ fontSize: "clamp(46px, 8vw, 132px)", letterSpacing: "-0.055em", lineHeight: 0.92 }}
          >
            {d.nome.toLowerCase()}.
          </h1>
          {d.sub && <p className="mt-4 text-[17px] font-semibold text-mute-2">{d.sub}</p>}

          {/* prêmios: o selo de cada festival e, ao lado, o que foi ganho */}
          {d.premios.length > 0 && (
            <div className="mt-[clamp(32px,4vw,56px)] grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10">
              {d.selos.length > 0 && (
                <div className="flex flex-wrap items-center gap-7">
                  {d.selos.map((s) => {
                    // iguala a ÁREA visual dos selos, como na credencial
                    const h = Math.round(34 / Math.sqrt(s.ratio));
                    return (
                      <Image
                        key={s.id}
                        src={s.src}
                        alt={s.nome}
                        title={s.nome}
                        width={Math.round(h * s.ratio)}
                        height={h}
                        className="invert"
                      />
                    );
                  })}
                </div>
              )}
              <p className="m-0 max-w-[80ch] text-[15px] leading-relaxed text-mute-1">
                {d.premios.join(" · ")}
              </p>
            </div>
          )}

          <div className="mt-[clamp(32px,4vw,56px)]">
            <Sobre nome={d.nome} foto={d.foto} frase={d.frase} bio={d.bio} marcas={d.marcas} canal={d.canal} />
          </div>
        </div>

        <div className="wrap mt-[clamp(40px,5vw,72px)] grid gap-[6px]">
          {d.reel && <Rolo vimeo={d.reel.vimeo} thumb={d.reel.thumb} nome={d.nome} />}
          <Obras obras={d.obras} />
        </div>

        {/* a mesma base de contato da home, com quem atende os diretores */}
        <ContatoSecao
          email={C.email}
          whatsapp={C.whatsapp}
          whatsappLink={C.whatsappLink}
          nota={
            <>
              com <span className="font-semibold text-paper">{C.nome}</span>, {C.funcao.toLowerCase()}.
            </>
          }
        />

        <nav
          aria-label="Outros diretores"
          className="wrap mt-[clamp(40px,5vw,72px)] mb-[clamp(24px,3vw,48px)] grid grid-cols-1 border-t border-line sm:grid-cols-2"
        >
          <Link href={`/diretores/${anterior.slug}`} className="group grid gap-2 py-8 sm:pr-8">
            <span className="text-[13px] text-mute-2">anterior</span>
            <span className="font-extrabold lowercase transition-colors group-hover:text-mute-2" style={{ fontSize: "clamp(26px, 3.4vw, 52px)", letterSpacing: "-0.045em", lineHeight: 1 }}>
              ← {anterior.nome.toLowerCase()}.
            </span>
          </Link>
          <Link href={`/diretores/${proximo.slug}`} className="group grid gap-2 border-t border-line py-8 sm:border-l sm:border-t-0 sm:pl-8 sm:text-right">
            <span className="text-[13px] text-mute-2">próximo</span>
            <span className="font-extrabold lowercase transition-colors group-hover:text-mute-2" style={{ fontSize: "clamp(26px, 3.4vw, 52px)", letterSpacing: "-0.045em", lineHeight: 1 }}>
              {proximo.nome.toLowerCase()}. →
            </span>
          </Link>
        </nav>
      </main>
    </SempreEscuro>
  );
}
