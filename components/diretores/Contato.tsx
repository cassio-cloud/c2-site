import { sabrina } from "@/data/credencial/time";

/** Quem atende quem quer filmar com um dos diretores parceiros. */
export const CONTATO_DIRETORES = {
  nome: sabrina.nome,
  funcao: sabrina.funcao,
  email: "sabrina@c2content.com.br",
  whatsapp: "+55 11 98388-1502",
  whatsappLink: "https://wa.me/5511983881502",
};

/**
 * Faixa de contato no pé do índice de /diretores (branco). O índice é uma
 * tela só, então ela fica no rodapé — mas em corpo maior e com o convite
 * escrito, não só o nome. Só Inter, como o resto da aba.
 */
export function Contato() {
  const c = CONTATO_DIRETORES;
  return (
    <footer className="wrap shrink-0 border-t border-black/10 py-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2"
        style={{ fontSize: "clamp(14px, 1.15vw, 18px)" }}
      >
        <p className="m-0 text-black/55">
          para filmar com um dos diretores, fale com{" "}
          <span className="font-semibold text-black">{c.nome}</span>, {c.funcao.toLowerCase()}.
        </p>
        <p className="m-0 flex flex-wrap gap-x-8 gap-y-3 font-semibold text-black">
          <a href={`mailto:${c.email}`} className="toque underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black">
            {c.email}
          </a>
          <a href={c.whatsappLink} target="_blank" rel="noopener" className="toque underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black">
            WhatsApp {c.whatsapp}
          </a>
        </p>
      </div>
    </footer>
  );
}
