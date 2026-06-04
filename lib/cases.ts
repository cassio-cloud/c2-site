import { promises as fs } from "node:fs";
import { CASES_JSON } from "./paths";
import type { Case } from "./types";

/** Leitura crua do arquivo. Não cacheada — cada call lê do disco. */
export async function readCases(): Promise<Case[]> {
  const raw = await fs.readFile(CASES_JSON, "utf8");
  return JSON.parse(raw) as Case[];
}

export async function getCase(slug: string): Promise<Case | null> {
  const all = await readCases();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function listSlugs(): Promise<string[]> {
  const all = await readCases();
  return all.map((c) => c.slug);
}

/** Sobrescreve o JSON inteiro. Usado pelo admin (PUT /api/cases). */
export async function writeCases(cases: Case[]): Promise<void> {
  await fs.writeFile(CASES_JSON, JSON.stringify(cases, null, 2), "utf8");
}

export function getFeatured(cases: Case[]): Case[] {
  return cases.filter((c) => c.featured);
}

export function filterByTag(cases: Case[], tag: string | null): Case[] {
  if (!tag) return cases;
  return cases.filter((c) => c.tags.includes(tag));
}
