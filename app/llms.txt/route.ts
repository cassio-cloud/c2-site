import { readCasesCached } from "@/lib/cases";
import { listarDiretores } from "@/lib/diretores";
import { PERFIS } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

/**
 * /llms.txt: resumo do site em texto puro para buscadores com IA (ChatGPT,
 * Perplexity, Gemini, Claude). É o que eles leem para responder "quem é a
 * C2 Content" ou "produtora audiovisual em Novo Hamburgo" com fatos certos
 * e links para as páginas. Montado a partir dos mesmos dados do site.
 */
export const revalidate = 3600;

export async function GET() {
  const [cases, diretores] = await Promise.all([readCasesCached(), listarDiretores()]);

  const linhaCase = (c: (typeof cases)[number]) => {
    const meta = [c.client, c.year, c.tags.join(", ")].filter(Boolean).join(" · ");
    const desc = c.description && !/lorem ipsum/i.test(c.description) ? `: ${c.description}` : "";
    return `- [${c.title}](${SITE_URL}/trabalho/${c.slug}) (${meta})${desc}`;
  };

  const texto = `# C2 Content

> Produtora audiovisual brasileira, fundada em 2018, com estúdios em Novo Hamburgo (RS) e São Paulo (SP). Faz campanhas publicitárias, filmes, fotografia, conteúdo de marca e produções híbridas com IA (captação real combinada com IA generativa), com diretores de cena parceiros. Lema: "where content meets craft."

## Sobre
- Fundador e diretor criativo: Cássio Caberlon. Sócia e diretora comercial: Luana Bier Hans.
- Estúdio 311, em Novo Hamburgo, RS: 300 m² para campanha publicitária, conteúdo de marca e foto de produto.
- Estúdio 909, em São Paulo, SP: espaço de criação, reunião e produção de conteúdo no centro.
- Atende marcas e agências no Brasil. Clientes incluem Nomad, Keeta, Magalu, Americanas, Grêmio, Husqvarna, Odontoprev, Unicred, Carrano, Golden Lake e Multiplan (BarraShoppingSul, ParkShopping Canoas).
- Sobre IA: usa IA generativa desde antes de ela virar assunto, como decisão técnica, em filmes 100% IA e em produções híbridas.

## Contato
- E-mail: luana@c2content.com.br
- WhatsApp: +55 51 99535-4727
- Diretores parceiros (coordenação de produção, Sabrina Lippi): sabrina@c2content.com.br, +55 11 98388-1502
- Perfis: ${PERFIS.join(", ")}

## Páginas principais
- [Início](${SITE_URL}/): trabalhos selecionados, IA, estrutura, clientes, time e contato
- [Portfólio](${SITE_URL}/trabalho): todos os cases, com filtro por campanha, conteúdo, captação e motion, 100% IA e híbrido IA
- [Diretores parceiros](${SITE_URL}/diretores): diretores de cena representados pela C2

## Diretores parceiros
${diretores
  .map((d) => {
    const extra = [d.premios.length ? `prêmios: ${d.premios.join(", ")}` : "", d.marcas.length ? `marcas: ${d.marcas.join(", ")}` : ""]
      .filter(Boolean)
      .join("; ");
    return `- [${d.nome}](${SITE_URL}/diretores/${d.slug})${extra ? ` (${extra})` : ""}`;
  })
  .join("\n")}

## Cases
${cases.map(linhaCase).join("\n")}
`;

  return new Response(texto, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
