import { cases as storage } from "./storage";
import type { Case } from "./types";

/** Leitura: Blob em prod, disco em dev. */
export async function readCases(): Promise<Case[]> {
  return await storage.read<Case[]>();
}

export async function getCase(slug: string): Promise<Case | null> {
  // Retry agressivo contra eventual consistency do Vercel Blob.
  // Após criar/atualizar um case, o CDN da Blob pode demorar até
  // alguns segundos pra refletir a nova versão mesmo com cache-buster.
  // Total wait: até ~8s no pior caso.
  const delays = [0, 400, 800, 1500, 2500, 3500];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) {
      await new Promise((r) => setTimeout(r, delays[i]));
    }
    const all = await readCases();
    const found = all.find((c) => c.slug === slug);
    if (found) return found;
  }
  return null;
}

export async function listSlugs(): Promise<string[]> {
  const all = await readCases();
  return all.map((c) => c.slug);
}

/** Sobrescreve o JSON inteiro. */
export async function writeCases(cases: Case[]): Promise<void> {
  await storage.write(cases);
}

export function getFeatured(cases: Case[]): Case[] {
  return cases.filter((c) => c.featured);
}

export function filterByTag(cases: Case[], tag: string | null): Case[] {
  if (!tag) return cases;
  return cases.filter((c) => c.tags.includes(tag));
}
