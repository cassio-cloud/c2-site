# C2 Content — site institucional

Produtora audiovisual brasileira. Site Next.js 16 com painel admin embutido.

- **Stack:** Next.js 16 (App Router · Turbopack · React 19) · Tailwind 4 · TypeScript estrito · NextAuth v5
- **Páginas:** `/` (home), `/trabalho` (portfólio com filtros), `/trabalho/[slug]` (case page SSG), `/admin` (CMS)
- **Mídia:** servida estaticamente de `public/media/` + uploads novos em Vercel Blob
- **Persistência:** JSON em disco (dev) ou Vercel Blob (prod). Admin escreve via Server Actions
- **SEO:** sitemap.xml dinâmico (21 URLs), robots.txt, OG image fallback, JSON-LD Schema.org

## Setup local

```bash
npm install
cp .env.example .env.local   # edite ADMIN_PASSWORD e AUTH_SECRET
npm run dev                  # http://localhost:3000
```

- Home: <http://localhost:3000>
- Portfólio: <http://localhost:3000/trabalho>
- Admin: <http://localhost:3000/admin> (senha em `ADMIN_PASSWORD`)

Em dev, **sem `BLOB_READ_WRITE_TOKEN`**, o app lê e grava direto em
`./data/*.json` e `./public/media/`. Conveniente pra desenvolvimento.

## Deploy na Vercel

### 1. Conectar o repositório

1. <https://vercel.com/new> → import `cassio-cloud/c2-site`
2. Framework: Next.js (auto-detect). Root directory: `.`
3. **Não fazer deploy ainda** — preciso das env vars primeiro

### 2. Provisionar o Blob store

1. No projeto Vercel: **Storage** → **Create Database** → **Blob**
2. Nome: `c2-content` (ou qualquer)
3. Conectar ao projeto → a env var `BLOB_READ_WRITE_TOKEN` é injetada automaticamente

### 3. Setar env vars do admin

Em **Project Settings → Environment Variables**, adicionar (Production + Preview):

| Nome | Valor | Como gerar |
|---|---|---|
| `ADMIN_PASSWORD` | senha forte | <https://1password.com/password-generator> |
| `AUTH_SECRET` | 32 bytes hex | `openssl rand -hex 32` |
| `NEXTAUTH_URL` | `https://c2content.com.br` | URL canônica final |

### 4. Deploy + custom domain

1. Trigger deploy (push qualquer commit ou redeploy manual)
2. Após sucesso, **Settings → Domains** → adicionar `c2content.com.br`
3. Apontar DNS no Registro.br: `A` record pra IP da Vercel (instruções aparecem lá)
4. HTTPS automático via Let's Encrypt

### Como o Blob funciona

Na primeira request em prod, `lib/storage.ts` detecta `BLOB_READ_WRITE_TOKEN`
e tenta ler `cases.json`/`site.json` do Blob. **Como ainda não existem**,
faz fallback pro arquivo bundlado (`data/cases.json` do repo). A primeira
escrita do admin sobe pro Blob e a partir daí é a fonte de verdade.

Mídia legada (`public/media/cases/*`) continua servida estaticamente pela
CDN da Vercel — não vai pro Blob. Uploads **novos** do admin vão pro Blob
e a URL absoluta é guardada no JSON. Componentes lidam com ambos via
`lib/media-url.ts`.

## Estrutura

```
.
├── app/
│   ├── page.tsx                    # home (RSC)
│   ├── trabalho/
│   │   ├── page.tsx                # listagem + filtros (RSC)
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
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg
│   └── layout.tsx · globals.css
├── components/
│   ├── home/                       # Hero, BentoGrid, IaSection, etc
│   ├── work/                       # WorkTile, FilterChips, Lightbox, CaseMedia
│   └── seo/JsonLd.tsx
├── lib/
│   ├── auth.ts                     # NextAuth Credentials (fail-closed)
│   ├── storage.ts                  # abstração Blob ↔ fs
│   ├── cases.ts · site.ts          # read/write JSON via storage
│   ├── tags.ts                     # fonte única TAG_LABELS, normTag, fmtTag
│   ├── upload.ts                   # saveUploadedFile + deleteMedia
│   ├── media-url.ts                # mediaSrc(path|URL) → URL final
│   ├── embed.ts                    # YouTube/Vimeo → iframe
│   ├── home-layout.ts              # bento curado da home
│   ├── work-layout.ts              # SIZE_PATTERN cíclico de /trabalho
│   └── paths.ts · types.ts
├── data/
│   ├── cases.json                  # 19 cases (seed inicial / fallback)
│   └── site.json                   # hero · logos · contato · time
└── public/
    └── media/
        ├── cases/<slug>/NN.<ext>   # imagens dos cases
        ├── logos/*.{svg,png}       # marcas dos clientes
        ├── team/                   # uploads de fotos do time
        └── reel.mp4                # NÃO commitado (>100MB) — ver below
```

## Painel admin

Acesso em `/admin`, login com `ADMIN_PASSWORD`. Sessão JWT em cookie httpOnly via NextAuth v5.

Operações (todas via Server Actions com `revalidatePath`):

| Área | Add | Reorder | Edit | Delete | Upload |
|---|---|---|---|---|---|
| Cases | ✓ | ✓ | ✓ (campos + mídia) | ✓ | múltiplos arquivos |
| Logos | ✓ | ✓ | ✓ | ✓ | SVG/PNG/JPG |
| Time | ✓ | ✓ | ✓ | ✓ | foto por pessoa |
| Redes sociais | ✓ | ✓ | ✓ | ✓ | — |
| Hero · contato | — | — | ✓ | — | URL YouTube/Vimeo |

## Hero vídeo

Suporta **3 modos**, com prioridade nesta ordem:

1. **YouTube/Vimeo embed** (recomendado) — configure em `/admin/site` com URL completa. Iframe com autoplay+mute+loop+sem-controles.
2. **Arquivo local** `public/media/reel.mp4` — fallback. Não comitado pelo limite do GitHub.
3. **Vazio** — fundo `--ink` puro.

Lógica em `lib/embed.ts` (`parseEmbedUrl`).

## SEO

- `/sitemap.xml` — 21 URLs (home + listagem + 19 cases)
- `/robots.txt` — permite tudo, bloqueia `/admin/` e `/api/`
- `/opengraph-image` — fallback PNG 1200×630 da home (Satori/Edge)
- Por case: `generateMetadata` com `og:image` apontando pra cover
- JSON-LD: `Organization` na home, `CreativeWork` em cada case

## Arquivo grande não-commitado

`public/media/reel.mp4` (104MB) está no `.gitignore` (limite GitHub).

**Opções pra prod:**

- **Recomendado:** subir o vídeo no Vimeo/YouTube e colar a URL em
  `/admin/site` (campo "Hero · vídeo do topo"). Zero peso no servidor.
- **Alternativa:** após primeiro deploy, fazer upload manual pro Blob
  via Storage UI da Vercel e setar `hero.embed` com a URL.

## Build local de produção

```bash
npm run build
npm run start
```
