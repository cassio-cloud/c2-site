// Logos da credencial — cópias RECORTADAS (sem sobra transparente) em
// public/media/credencial/logos/. Os originais em public/media/logos/
// seguem intocados: são os do site (data/site.json).
//
// `ratio` = largura/altura do desenho já recortado. O grid usa isso para
// dar a todas as marcas a mesma ÁREA visual — uma marca quadrada não
// pesa mais que uma comprida. `ajuste` (padrão 1) corrige a mão o peso
// óptico de um traço muito fino ou muito cheio.
export type ClienteLogo = {
  name: string
  src: string
  ratio: number
  ajuste?: number
}

export const clientes: ClienteLogo[] = [
  { name: "Carrano", src: "/media/credencial/logos/carrano.png", ratio: 7.73 },
  { name: "Unicred", src: "/media/credencial/logos/unicred.png", ratio: 6.61 },
  { name: "Escala", src: "/media/credencial/logos/escala.png", ratio: 4.05 },
  { name: "Rissul", src: "/media/credencial/logos/rissul.png", ratio: 1.3 },
  { name: "Stok Center", src: "/media/credencial/logos/stokcenter.png", ratio: 1.84, ajuste: 0.9 },
  { name: "Nomad", src: "/media/credencial/logos/nomad.png", ratio: 4.44 },
  { name: "Americanas", src: "/media/credencial/logos/americanas.png", ratio: 5.03 },
  { name: "Ipanema", src: "/media/credencial/logos/ipanema.png", ratio: 3.89, ajuste: 1.1 },
  { name: "ParkShopping Canoas", src: "/media/credencial/logos/park.png", ratio: 6.79 },
  { name: "Via Marte", src: "/media/credencial/logos/viamarte.png", ratio: 5.12 },
  { name: "Abicalçados", src: "/media/credencial/logos/abicalcados.png", ratio: 1.51 },
  { name: "Vicenza", src: "/media/credencial/logos/vicenza.png", ratio: 1.11, ajuste: 1.15 },
  { name: "BarraShopping Sul", src: "/media/credencial/logos/barra.png", ratio: 5.36 },
  { name: "Grêmio", src: "/media/credencial/logos/gremio.png", ratio: 0.98 },
  { name: "Brivia", src: "/media/credencial/logos/brivia.png", ratio: 3.74 },
  { name: "WT.AG", src: "/media/credencial/logos/wtag.png", ratio: 3.87 },
  { name: "Husqvarna", src: "/media/credencial/logos/husqvarna.png", ratio: 5.03 },
  { name: "Nürnbergmesse", src: "/media/credencial/logos/nurnbergmesse.png", ratio: 2.57, ajuste: 1.35 },
  { name: "Golden Lake", src: "/media/credencial/logos/golden.png", ratio: 1.58, ajuste: 1.3 },
  // Keeta: logo enviado pela C2 (500×500), recortado e com fundo transparente
  { name: "Keeta", src: "/media/credencial/logos/keeta.png", ratio: 1.89 },
  { name: "Magalu", src: "/media/credencial/logos/magalu.png", ratio: 3.5 },
]
