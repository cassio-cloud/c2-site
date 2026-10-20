// Diretores de cena — seção da apresentação /advertising.
//
// Ordem do array = ordem dos slides. Cada diretor vira: 1 slide de perfil
// (foto, nome, prêmios, marcas, mini bio) + 1 slide por filme (até 3).
// Sem `foto`/`bio`/`filmes` o diretor entra como placeholder: perfil com
// "em breve" e nenhum slide de filme — preencha aqui e os slides aparecem.
//
// Fotos: padrão P&B gerado (Seedream 5 Pro, ref. "estilo 3": fundo branco,
// luz lateral dura + fill no rosto, ângulo baixo e aberto), 1500×2000.

const F = "/media/credencial/diretores"

export type Filme = {
  marca: string
  /** Nome da peça, quando houver (ex.: "Máfia"). */
  titulo?: string
  /** URL do YouTube/Vimeo ou caminho local. */
  video: string
}

export type Diretor = {
  id: string
  nome: string
  /** Linha sob o nome — ex.: os nomes de uma dupla. */
  sub?: string
  /** Versão curta do `sub` para a legenda estreita do elenco. */
  subCurto?: string
  foto?: string
  /** Frase-assinatura, em caixa alta mono. */
  frase?: string
  bio?: string
  premios?: string[]
  marcas?: string[]
  /** Até 3. */
  filmes: Filme[]
  /**
   * Fora da apresentação por ora — dados e foto ficam aqui, prontos.
   * Para reativar, apague a linha `standby: true`.
   */
  standby?: true
}

const todos: Diretor[] = [
  {
    // grafia da dupla: "ANGRY" (bio enviada por eles e vimeo.com/angryfilms)
    id: "angry-duo",
    nome: "Angry Duo",
    sub: "Bruno Silva e Gabe Maruyama",
    subCurto: "Bruno e Gabe",
    foto: `${F}/angry-duo.jpg`,
    frase: "força visual, sensibilidade narrativa e experimentação.",
    bio:
      "Dupla de diretores entre a publicidade, os projetos autorais e os filmes com inteligência artificial, com experiência de set, direção de arte e acabamento cinematográfico. Na produção autoral, Xondaro-Ka’aguy Reguá, de Kunumí MC, foi premiado internacionalmente e exibido em mais de 20 países.",
    premios: [
      "Profissionais do Ano 2025 · Globo",
      "Ouro Colunistas 2025",
      "Bronze FestVideo 2026",
      "Effie Awards",
      "Clio Awards",
      "Clube de Criação",
    ],
    marcas: ["Mercedes-Benz", "Samsung", "Shell", "TikTok", "iFood", "O Boticário"],
    filmes: [
      { marca: "Wyda", titulo: "Extraterrestre", video: "https://vimeo.com/1024512920" },
      // o link do docx é por nome (vimeo.com/angryfilms/heroinasdogame) —
      // o embed precisa do número do vídeo
      { marca: "O Boticário", titulo: "Heroínas do Game", video: "https://vimeo.com/851136506" },
      { marca: "TCL", titulo: "The Four-Year Gap", video: "https://vimeo.com/1174218887" },
    ],
  },
  // dados e foto a caminho — até lá entra como placeholder ("em breve")
  { id: "thiago-artmonte", nome: "Thiago Artmonte", filmes: [] },
  {
    id: "bia-flecha",
    nome: "Bia Flecha",
    foto: `${F}/bia-flecha.jpg`,
    frase: "a emoção certa, a intenção correta.",
    bio:
      "Diretora de cinema e publicidade, do digital ao offline: web séries, curtas, videoclipes e branded content para TV. Dirigiu “O Meu Sangue É Rubro-Negro”, da Leo Burnett Tailor Made para o Vitória e o Hemoba, vencedor de 7 Leões de Ouro em Cannes, e, na Espanha, uma campanha protagonizada por Pedro Almodóvar. Conta histórias a partir do comportamento das pessoas no dia a dia, com atenção especial à fotografia, à direção de arte e à direção de atores.",
    premios: [
      "Cannes Lions · 7 Leões de Ouro",
      "London Film Festival",
      "New York Festivals",
      "FIAP",
      "Colunistas",
      "Profissionais do Ano",
    ],
    marcas: ["Amstel", "Intelbras", "Ademicon", "Cachaça 51", "GNT", "FOX"],
    filmes: [
      // o link enviado era de showcase (vimeo.com/showcase/…?video=…) —
      // o embed precisa do número do vídeo
      { marca: "Amstel", titulo: "Dna. Neide", video: "https://vimeo.com/1008522177" },
      { marca: "Intelbras", titulo: "Restaurante", video: "https://vimeo.com/1117578544" },
      { marca: "Ademicon", titulo: "Café", video: "https://vimeo.com/917292958" },
    ],
  },
  {
    id: "john-porciuncula",
    nome: "John Porciúncula",
    foto: `${F}/john-porciuncula.jpg`,
    frase: "transformar ideias em experiências audiovisuais.",
    bio:
      "Diretor de cinema, publicidade, televisão e documentário. Transita entre linguagens e formatos, do conteúdo digital e do branded content ao entretenimento e a projetos internacionais, transformando conceitos em narrativas que precisam dizer alguma coisa. “Dirigir é saber o que fazer alguém sentir quando a imagem termina.”",
    premios: ["Cannes Lions", "New York Festivals", "El Ojo", "Gramado", "Colunistas"],
    marcas: ["P&G", "Mastercard", "Coca-Cola", "Renner"],
    filmes: [
      { marca: "Hyundai", video: "https://vimeo.com/291579979" },
      // no Vimeo a peça se chama "Chicken Parm"
      { marca: "Bullguer", titulo: "Máfia", video: "https://vimeo.com/1090920090" },
      { marca: "Localiza", video: "https://vimeo.com/269678314" },
    ],
  },
  {
    id: "raoni-rodrigues",
    nome: "Raoni Rodrigues",
    foto: `${F}/raoni-rodrigues.jpg`,
    frase: "colaboração, escuta, respeito e troca.",
    bio:
      "Diretor de cena e montador, há 16 anos entre o entretenimento e a publicidade. Dirigiu cena, ação e segunda unidade em séries e filmes para Globo, Netflix, HBO Max, Prime Video e Disney: Os Ausentes, Cangaço Novo, Temporada de Verão, Carcereiros e Passagrana. Na publicidade, leva a mesma direção de atores para celebridades, elenco consagrado e elenco real, num set leve e colaborativo.",
    premios: [
      "Cannes Lions · montagem de “Kombi Last Wishes”",
      "Ouro New York Festivals · Quebrando o Tabu",
      "Indicado APCA 2022 · Os Ausentes",
    ],
    marcas: ["Coca-Cola", "Itaucard", "Volkswagen", "Guaraná Antarctica", "Bayer", "Ypê"],
    filmes: [
      { marca: "Elefante", titulo: "Descoberta", video: "https://vimeo.com/1019550842" },
      { marca: "RedoxMax", titulo: "Rodrigo Hilbert", video: "https://vimeo.com/458182225" },
      // enviado por WhatsApp (848×480) — sem versão no Vimeo
      { marca: "Sebrae", titulo: "Feira do Empreendedor", video: `${F}/raoni/sebrae.mp4` },
    ],
  },
  {
    id: "diego-lisboa",
    nome: "Diego Lisboa",
    foto: `${F}/diego-lisboa.jpg`,
    frase: "histórias reais que emocionam e comunicam.",
    bio:
      "Diretor de cena e cineasta baiano, com mais de 20 anos entre publicidade, documentário e ficção. Combina força visual e experimentação de linguagem com uma habilidade central: encontrar em pessoas reais histórias capazes de emocionar. Na publicidade, dirigiu para o Governo Federal e a Embratur, com agências como Propeg, Leiaute e Calia. A campanha “Depoimentos”, do Governo da Bahia, levou Profissionais do Ano, Galo de Bronze em Gramado e o Grand Prix Bahia Recall.",
    premios: [
      "Profissionais do Ano",
      "Galo de Bronze · Gramado",
      "Grand Prix Bahia Recall",
      "Melhor Direção e Melhor Roteiro · “Ode”",
    ],
    marcas: ["Governo Federal", "Embratur", "Governo da Bahia"],
    filmes: [
      { marca: "Embratur", titulo: "Amazônia", video: "https://vimeo.com/1006608110" },
      { marca: "Governo Federal", titulo: "Mãe Gentil", video: "https://vimeo.com/893069981" },
      { marca: "Governo da Bahia", video: "https://vimeo.com/1120172427" },
    ],
  },
  // dados e foto a caminho — até lá entra como placeholder ("em breve")
  { id: "cassio-caberlon", nome: "Cássio Caberlon", filmes: [] },
]

/** O que entra na apresentação — elenco, perfis, filmes e preload. */
export const diretores: Diretor[] = todos.filter((d) => !d.standby)
