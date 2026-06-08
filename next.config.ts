import type { NextConfig } from "next";
import path from "node:path";

/**
 * Content Security Policy — restringe origens permitidas pra reduzir
 * superfície XSS / injection.
 *
 * Trade-offs aceitos:
 * - `unsafe-inline` em style: Next/Tailwind 4 injetam estilos inline
 * - `unsafe-inline` + `unsafe-eval` em script: necessário pelo Next/RSC
 *   (parsing de payloads RSC usa eval). Considerar nonces no futuro.
 * - youtube/vimeo permitidos em frame e script pro embed do hero/cases
 * - blob.vercel-storage.com em img/media pro Blob público
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com https://player.vimeo.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://vercel.live",
  "connect-src 'self' https: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Silencia o warning do Turbopack ao detectar lockfile no parent dir.
  turbopack: {
    root: path.join(__dirname),
  },

  // Mídia em public/media é servida estática pela CDN — não deve ser
  // empacotada nas funções serverless (estourava o limite de 300MB).
  outputFileTracingExcludes: {
    "*": ["public/media/**"],
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

  /** Security headers em todas as rotas. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
