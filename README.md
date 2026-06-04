# C2 Content — site institucional

Produtora audiovisual brasileira. Site Next.js 16 com painel admin embutido.

- **Stack:** Next.js 16 (App Router · Turbopack · React 19) · Tailwind 4 · TypeScript estrito · NextAuth v5
- **Páginas:** `/` (home), `/trabalho` (portfólio com filtros), `/trabalho/[slug]` (case page SSG), `/admin` (CMS)
- **Mídia:** servida por route handler `/media/[...path]` com byte-range pra vídeo
- **Persistência:** JSON em disco (`data/cases.json`, `data/site.json`) — admin escreve via Server Actions
- **SEO:** sitemap.xml dinâmico (21 URLs), robots.txt, OG image fallback, JSON-LD Schema.org

## Setup local

```bash
npm install
cp .env.example .env.local   # edite ADMIN_PASSWORD, AUTH_SECRET
npm run dev                  # http://localhost:3000
```

- Home: <http://localhost:3000>
- Portfólio: <http://localhost:3000/trabalho>
- Admin: <http://localhost:3000/admin> (senha padrão `c2admin` se não setar)

## Estrutura

```
.
├── app/
│   ├── page.tsx                    # home
│   ├── trabalho/
│   │   ├── page.tsx                # listagem + filtros
│   │   └── [slug]/page.tsx         # case (SSG + generateMetadata)
│   ├── admin/
│   │   ├── login/page.tsx          # login público
│   │   └── (authed)/               # route group protegido por auth()
│   │       ├── page.tsx            # cases
│   │       ├── cases/[slug]/page.tsx
│   │       ├── site/page.tsx
│   │       ├── team/page.tsx
│   │       └── logos/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── media/[...path]/route.ts    # servidor de mídia com byte-range
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg
│   └── layout.tsx · globals.css
├── components/
│   ├── home/                       # Hero, BentoGrid, IaSection, etc
│   ├── work/                       # WorkTile, FilterChips, Lightbox, CaseMedia
│   └── seo/JsonLd.tsx
├── lib/
│   ├── auth.ts                     # NextAuth Credentials provider
│   ├── cases.ts · site.ts          # read/write JSON
│   ├── tags.ts                     # fonte única TAG_LABELS, normTag, fmtTag
│   ├── upload.ts                   # resolveUpload + saveUploadedFile
│   ├── embed.ts                    # YouTube/Vimeo URL → iframe embed
│   ├── home-layout.ts              # bento curado da home
│   ├── work-layout.ts              # SIZE_PATTERN cíclico de /trabalho
│   └── paths.ts · types.ts
├── data/
│   ├── cases.json                  # 19 cases
│   └── site.json                   # hero · logos · contato · time
└── media/
    ├── cases/<slug>/NN.<ext>
    ├── logos/*.{svg,png}
    ├── team/                       # uploads do admin
    └── reel.mp4                    # NÃO commitado (>100MB) — sincronizar manualmente
```

## Painel admin

Acesso em `/admin`, login com `ADMIN_PASSWORD`. Sessão JWT em cookie httpOnly via NextAuth v5.

Operações disponíveis (todas via Server Actions com `revalidatePath`):

| Área | Add | Reorder | Edit | Delete | Upload mídia |
|---|---|---|---|---|---|
| Cases | ✓ | ✓ | ✓ (campos + mídia) | ✓ | múltiplos arquivos |
| Logos | ✓ | ✓ | ✓ | ✓ | SVG/PNG/JPG |
| Time | ✓ | ✓ | ✓ | ✓ | foto por pessoa |
| Site (contato + hero embed) | — | — | ✓ | — | URL YouTube/Vimeo |

## Hero vídeo

O hero suporta **3 modos**, com prioridade nesta ordem:

1. **YouTube/Vimeo embed** (recomendado) — configure em `/admin/site` com URL completa. Iframe com autoplay+mute+loop+sem-controles.
2. **Arquivo local** `media/reel.mp4` — fallback. Não comitado pelo limite do GitHub; sincronizar via `rsync` separado.
3. **Vazio** — fundo `--ink` puro.

Lógica em `lib/embed.ts` (`parseEmbedUrl`).

## SEO

- `/sitemap.xml` — 21 URLs (home + listagem + 19 cases), regenerado em build
- `/robots.txt` — permite tudo, bloqueia `/admin/` e `/api/`
- `/opengraph-image` — fallback PNG 1200×630 da home (Satori/Edge)
- Por case: `generateMetadata` com `og:image` apontando pra cover
- JSON-LD: `Organization` na home, `CreativeWork` em cada case

## Deploy

Configurado para **DigitalOcean Droplet + PM2 + Caddy** (Ubuntu 24, 1GB RAM).

```bash
npm run build                # gera .next/standalone
NODE_ENV=production node .next/standalone/server.js
```

Variáveis obrigatórias:

- `ADMIN_PASSWORD` — senha admin
- `AUTH_SECRET` — gere com `openssl rand -hex 32`
- `NEXTAUTH_URL` — URL canônica (`https://c2content.com.br`)

Após deploy inicial, fazer `rsync media/reel.mp4` do local pro Droplet (gitignored).
