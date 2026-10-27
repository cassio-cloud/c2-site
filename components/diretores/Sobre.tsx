import Image from "next/image";

/** Bio, retrato e marcas, sempre à vista, logo abaixo do nome. */
export function Sobre({
  nome,
  foto,
  frase,
  bio,
  marcas,
  canal,
}: {
  nome: string;
  foto?: string;
  frase?: string;
  bio?: string;
  marcas: string[];
  canal?: string;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-[160px_minmax(0,62ch)_minmax(0,1fr)]">
        {foto && (
          <div className="relative w-[120px] overflow-hidden bg-white md:w-[160px]" style={{ aspectRatio: "3 / 4" }}>
            <Image src={foto} alt={`Retrato de ${nome}`} fill sizes="160px" className="object-cover grayscale" />
          </div>
        )}
        <div className="grid gap-4">
          {frase && <p className="m-0 text-[17px] font-semibold lowercase tracking-[-0.01em]">{frase}</p>}
          {bio && <p className="m-0 text-[15px] leading-relaxed text-mute-1">{bio}</p>}
        </div>
        {marcas.length > 0 && (
          <div className="grid content-start gap-2">
            <p className="m-0 text-[13px] text-mute-2">marcas</p>
            <p className="m-0 text-[15px] leading-relaxed text-mute-1">{marcas.join(" · ")} e muitas outras.</p>
          </div>
        )}
      </div>

      {canal && (
        <a href={canal} target="_blank" rel="noopener" className="toque justify-self-start text-[15px] font-semibold text-mute-2 transition-colors hover:text-paper">
          vimeo ↗
        </a>
      )}
    </div>
  );
}
