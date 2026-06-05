import { cases as storage } from "./storage";
import type { Case } from "./types";

/** Leitura: Blob em prod, disco em dev. */
export async function readCases(): Promise<Case[]> {
  return await storage.read<Case[]>();
}

export async function getCase(slug: string): Promise<Case | null> {
  // Retry defensivo contra eventual consistency do Vercel Blob.
  // Logo após criar/atualizar um case, o CDN pode demorar 50-300ms
  // pra refletir a nova versão. Tenta até 3 vezes com backoff curto.
  for (let attempt = 0; attempt < 3; attempt++) {
    const all = await readCases();
    const found = all.find((c) => c.slug === slug);
    if (found) return found;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
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
