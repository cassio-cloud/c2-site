import Image from "next/image";
import { readSite } from "@/lib/site";
import { mediaSrc } from "@/lib/media-url";
import { Reveal } from "./Reveal";

export async function Clientes() {
  const { logos } = await readSite();

  return (
    <section id="clientes" className="section">
      <div className="wrap">
        <Reveal className="mb-12">
          <h2
            className="h-display font-bold lowercase tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 132px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
            }}
          >
            clientes.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-px border-t border-b border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo, i) => (
            <div
              key={logo.name}
              className="relative flex aspect-[5/3] items-center justify-center bg-ink"
            >
              <span className="absolute left-3 top-3 font-mono text-[9px] tracking-[0.2em] text-mute-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative h-1/2 w-3/5">
                <Image
                  src={mediaSrc(logo.src)}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 900px) 40vw, 14vw"
                  className={
                    "object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 " +
                    (logo.large ? "scale-[1.4]" : "")
                  }
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
