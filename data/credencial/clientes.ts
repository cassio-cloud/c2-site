// Logos espelhados de data/site.json -> logos (paths em public/media/logos/)
export type ClienteLogo = {
  name: string
  src: string
  large: boolean
}

export const clientes: ClienteLogo[] = [
  { name: "Carrano", src: "/media/logos/carrano.svg", large: false },
  { name: "Unicred", src: "/media/logos/unicred.png", large: false },
  { name: "Escala", src: "/media/logos/escala.png", large: false },
  { name: "Rissul", src: "/media/logos/rissul.png", large: false },
  { name: "Stok Center", src: "/media/logos/stokcenter.png", large: false },
  { name: "Nomad", src: "/media/logos/nomad.png", large: false },
  { name: "Americanas", src: "/media/logos/americanas.svg", large: false },
  { name: "Ipanema", src: "/media/logos/ipanema.png", large: false },
  { name: "ParkShopping Canoas", src: "/media/logos/park.png", large: false },
  { name: "Via Marte", src: "/media/logos/viamarte.png", large: false },
  { name: "Abicalçados", src: "/media/logos/abicalcados.png", large: false },
  { name: "Vicenza", src: "/media/logos/vicenza.png", large: true },
  { name: "BarraShopping Sul", src: "/media/logos/barra.png", large: false },
  { name: "Grêmio", src: "/media/logos/gremio.png", large: false },
  { name: "Brivia", src: "/media/logos/brivia.png", large: false },
  { name: "WT.AG", src: "/media/logos/wtag.png", large: false },
  { name: "Husqvarna", src: "/media/logos/husqvarna.png", large: true },
  { name: "Ismo", src: "/media/logos/ismo.png", large: false },
  { name: "Nürnbergmesse", src: "/media/logos/nurnbergmesse.png", large: false },
  { name: "Golden Lake", src: "/media/logos/golden.png", large: true },
]
