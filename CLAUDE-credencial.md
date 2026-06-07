# C2 Credencial — Instruções para Claude Code

## O que é isso
Apresentação comercial da C2 Content como web app full-screen.
Rota: `/credencial` dentro do projeto next-site existente.
25 slides com navegação por teclado/touch e transições via Framer Motion.

## Stack
- Next.js 15 (app router) · React 19 · TypeScript · Tailwind CSS v4
- Framer Motion para animações e transições entre slides
- Sem backend. Sem chamadas a API. Dados em `/data/credencial/*.ts`

## Design — regras absolutas
- Tokens em `/app/globals.css` — nunca inventar cor fora de `--ink`, `--paper`, `--mute-*`
- Tipografia: Helvetica Neue em tudo. Não usar Inter nos slides
- Grain overlay (`.grain` class) em todos os slides com fundo escuro
- Animações sempre via Framer Motion — nunca `transition` inline ou CSS keyframes
- Slides ocupam exatamente `100vh × 100vw`

## Estrutura de arquivos a criar
```
app/credencial/
  page.tsx              ← entry point, renderiza <SlideEngine>
  layout.tsx            ← sem header/footer do site principal

components/credencial/
  SlideEngine.tsx        ← estado, navegação, teclado/touch
  SlideProgress.tsx      ← barra 1px no topo
  SlideCounter.tsx       ← "01 / 25" mono mute-3 canto inferior direito
  C2LogoMark.tsx         ← "C2." sticky canto superior esquerdo
  Grain.tsx              ← reutilizar ou importar do home
  SlideTransition.tsx    ← wrapper Framer Motion

  slides/
    SlideCapa.tsx
    SlideReel.tsx
    SlideMoodboard.tsx
    SlideManifesto.tsx
    SlideServicos.tsx
    SlideDivider.tsx       ← reutilizável: props { label, titulo, bg }
    SlideCase.tsx          ← reutilizável: props { case: Case }
    SlideIAManifesto.tsx
    SlideIASplit.tsx        ← reutilizável: props { esq, dir, label }
    SlideEstrutura.tsx
    SlideTime.tsx
    SlideClientes.tsx
    SlideContato.tsx

data/credencial/
  cases.ts      ← ✅ criado
  ia.ts         ← ✅ criado
  moodboard.ts  ← ✅ criado
  time.ts       ← ✅ criado (fotos do time a adicionar depois)
```

## Assets disponíveis (placeholders)
```
public/media/credencial/
  cases/      ← 30 imagens (3 por cliente × 10 clientes)
  ia/         ← 7 imagens (odontoprev, goat x2, carrano-ia x2, gremio x2)
  moodboard/  ← 12 imagens (mb-01 a mb-12)
  reel/       ← VAZIO — adicionar reel.mp4 + reel-cover.jpg depois
  time/       ← VAZIO — adicionar fotos P&B do time depois
```

## Navegação dos slides
```
→ / Space / click metade direita  → avança
← / click metade esquerda         → volta
Escape                             → vai para slide 1
Swipe left/right                   → avança/volta (touch)
```

## Transição padrão entre slides
```typescript
// saída
{ x: -60, opacity: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }
// entrada
{ x: 60, opacity: 0 } → { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }
// slides divider: só fade, sem translate
```

## Sequência dos 25 slides
```
01  SlideCapa
02  SlideReel
03  SlideMoodboard
04  SlideManifesto
05  SlideServicos
06  SlideDivider   { label: "03 · TRABALHO", titulo: "trabalho.", bg: "dark" }
07  SlideCase      { case: cases[0] }  // Unicred
08  SlideCase      { case: cases[1] }  // Nomad
09  SlideCase      { case: cases[2] }  // Gollog
10  SlideCase      { case: cases[3] }  // BarraShopping
11  SlideCase      { case: cases[4] }  // Carrano
12  SlideCase      { case: cases[5] }  // VOA
13  SlideCase      { case: cases[6] }  // Unidasul
14  SlideCase      { case: cases[7] }  // Yam
15  SlideCase      { case: cases[8] }  // Golden Lake
16  SlideCase      { case: cases[9] }  // ParkShopping
17  SlideDivider   { label: "04 · IA", titulo: "ia.", bg: "dark" }
18  SlideIAManifesto
19  SlideIASplit   { esq: iaCases[0], dir: iaCases[1], label: "100% IA" }
20  SlideIASplit   { esq: iaCases[2], dir: iaCases[3], label: "híbrido" }
21  SlideDivider   { label: "05 · ESTRUTURA", titulo: "estrutura.", bg: "light" }
22  SlideEstrutura
23  SlideTime
24  SlideClientes
25  SlideContato
```

## Ordem de implementação
1. Scaffold `/credencial` com `SlideEngine` e navegação por teclado
2. `SlideProgress` + `SlideCounter` + `C2LogoMark`
3. `SlideTransition` com Framer Motion
4. Slides de texto puro: `SlideCapa`, `SlideManifesto`, `SlideServicos`, `SlideDivider`, `SlideContato`
5. `SlideCase` com imagens reais dos placeholders
6. `SlideReel` (video + fallback)
7. `SlideMoodboard` (grid stagger)
8. Slides de IA
9. `SlideTime` + `SlideClientes`
10. Polish: grain, animações, responsivo mobile

## Spec completo
Ver `/credencial-web-spec.md` na raiz do projeto C2 SP para descrição detalhada de cada slide.
