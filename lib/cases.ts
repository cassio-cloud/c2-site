import { cases as storage } from "./storage";
import type { Case } from "./types";

/** Leitura: Blob em prod, disco em dev. */
export async function readCases(): Promise<Case[]> {
  return await storage.read<Case[]>();
}

export async function getCase(slug: string): Promise<Case | null> {
  const all = await readCases();
  return all.find((c) => c.slug === slug) ?? null;
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
