import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Silencia o warning do Turbopack ao detectar lockfile no parent dir
  // (o site legacy em ../ tem seu próprio package-lock.json).
  turbopack: {
    root: path.join(__dirname),
  },

  // Mídia segue o esquema atual: /media/cases/<slug>/01.jpg, /media/reel.mp4, etc.
  // Em produção será servida via rota custom; em dev, importamos do parent dir.
  images: {
    qualities: [60, 75, 90],
  },

  // Build standalone para deploy em PM2 no Droplet (sem precisar de Node global).
  output: "standalone",

  // Server Actions usadas pra upload de mídia (vídeos de case ~até 500MB).
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
