// Selos dos prêmios — logos oficiais, baixados dos sites de cada festival
// (canneslions.com, clios.com, effie.org, clubedecriacao.com.br,
// newyorkfestivals.com, elojodeiberoamerica.com) e convertidos para
// preto com fundo transparente. Ficam em public/media/credencial/premios/.
//
// O perfil do diretor mostra o selo de cada prêmio citado em `premios`
// que bater com `casa`. Prêmio sem selo aqui segue só no texto.

export type SeloPremio = {
  id: string
  nome: string
  src: string
  /** largura/altura do desenho recortado — o perfil iguala a ÁREA visual */
  ratio: number
  casa: RegExp
}

const P = "/media/credencial/premios"

export const selosPremios: SeloPremio[] = [
  { id: "cannes", nome: "Cannes Lions", src: `${P}/cannes.png`, ratio: 0.89, casa: /cannes/i },
  { id: "nyf", nome: "New York Festivals", src: `${P}/nyf.png`, ratio: 12.45, casa: /new york festivals/i },
  { id: "clio", nome: "Clio Awards", src: `${P}/clio.png`, ratio: 5.69, casa: /clio/i },
  { id: "effie", nome: "Effie Awards", src: `${P}/effie.png`, ratio: 1.91, casa: /effie/i },
  { id: "elojo", nome: "El Ojo de Iberoamérica", src: `${P}/elojo.png`, ratio: 6.99, casa: /el ojo/i },
  { id: "ccsp", nome: "Clube de Criação", src: `${P}/ccsp.png`, ratio: 8.37, casa: /clube de cria/i },
]

/** Selos dos prêmios citados, na ordem em que aparecem, sem repetir. */
export function selosDe(premios: string[] = []): SeloPremio[] {
  const vistos = new Set<string>()
  const out: SeloPremio[] = []
  for (const p of premios) {
    for (const s of selosPremios) {
      if (s.casa.test(p) && !vistos.has(s.id)) {
        vistos.add(s.id)
        out.push(s)
      }
    }
  }
  return out
}
