// Espelha data/site.json -> team. Mantido aqui pra evitar chamadas async
// no slide engine (que é client-side puro).
export type Pessoa = {
  nome: string
  funcao: string
  code: string
  foto: string
}

export const time: Pessoa[] = [
  {
    nome: "Cássio Caberlon",
    funcao: "Fundador · Direção criativa · Foto",
    code: "CCB · 0114",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01K1TW83AVP0126W4A3A526SZS.jpg",
  },
  {
    nome: "Luana Bier Hans",
    funcao: "Novos negócios · Relacionamento",
    code: "LBH · 0318",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01J748DM24TEXG3PSW29TW25N1.jpg",
  },
  {
    nome: "Cassiano Caberlon",
    funcao: "Direção de arte · Retoque",
    code: "CBC · 0220",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01HZ7ZMFJ49CFM679NF7XWYA6K.jpg",
  },
  {
    nome: "Gabriel Spindler",
    funcao: "Edição · Motion",
    code: "GSP · 0421",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01JNHMP7CX9MEQ6RH64236NSMJ.jpg",
  },
  {
    nome: "Bruno Fiuza",
    funcao: "Produção executiva",
    code: "BFI · 0522",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01JM2SW867HZ3N7TE0290B2BQ2.jpg",
  },
  {
    nome: "Pâmela Oliveira",
    funcao: "Foto · Produção",
    code: "POL · 0623",
    foto: "https://c2content.nyc3.digitaloceanspaces.com/01HZ7ZNBHJ0Z8N7W67NCBNNWKC.jpg",
  },
]
