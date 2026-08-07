/* ═══════════════════════════════════════════════════════════════════
 * SERVIÇOS — as três frentes
 *
 * Cada frente carrega um conjunto de imagens, não uma só: enquanto o
 * mouse fica na linha, a caixa lateral vai trocando de quadro dentro
 * da mesma categoria. Trocar de linha troca a categoria; ficar na
 * linha mostra o repertório dela.
 *
 * Vive em `data/` porque o preloader também precisa desta lista —
 * assim a caixa nunca pisca esperando o próximo quadro.
 * ═══════════════════════════════════════════════════════════════════ */

export type Servico = {
  index: string
  titulo: string
  tag: string
  desc: string
  fotos: string[]
}

const L = "/media/credencial/lib2"

export const servicos: Servico[] = [
  {
    index: "01",
    titulo: "campanha.",
    tag: "produção audiovisual",
    desc: "Onde o conceito encontra o craft. Campanhas com direção apurada, intenção criativa e excelência técnica.",
    fotos: [`${L}/nomad/01.jpg`, `${L}/voa/02.jpg`, `${L}/golden/01.jpg`, `${L}/barra/02.jpg`],
  },
  {
    index: "02",
    titulo: "conteúdo.",
    tag: "always-on · projetos",
    desc: "Do always-on aos projetos especiais. Conteúdo audiovisual com intenção criativa, ritmo e craft.",
    fotos: [`${L}/unidasul/01.jpg`, `${L}/park/02.jpg`, `${L}/gollog/03.jpg`, `${L}/unicred/02.jpg`],
  },
  {
    index: "03",
    titulo: "ia.",
    tag: "100% ia · híbrido",
    desc: "Quando usar, como usar. Produção com IA sem mistificação — decisão técnica, não modismo.",
    // sem BYD: é carro em todos os quadros. O repertório aqui mostra
    // amplitude de linguagem — moda, esporte, animação — não veículo.
    fotos: [
      `${L}/ia-carrano/02.jpg`,
      `${L}/ia-gremio/02.jpg`,
      `${L}/ia-vbet/01.jpg`,
      `${L}/ia-odontoprev/03.png`,
    ],
  },
]

/** Todas as imagens dos serviços — usado pelo preloader. */
export const fotosServicos = servicos.flatMap((s) => s.fotos)
