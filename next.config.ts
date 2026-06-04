import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Silencia o warning do Turbopack ao detectar lockfile no parent dir.
  turbopack: {
    root: path.join(__dirname),
  },

  // Mídia: public/media/** (estática) + Blob (uploads em prod).
  images: {
    qualities: [60, 75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "c2content.nyc3.digitaloceanspaces.com",
      },
    ],
  },

  // Server Actions usadas pra upload de mídia (vídeos de case ~até 500MB).
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
