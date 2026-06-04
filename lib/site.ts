import { promises as fs } from "node:fs";
import { SITE_JSON } from "./paths";
import type { Site } from "./types";

export async function readSite(): Promise<Site> {
  const raw = await fs.readFile(SITE_JSON, "utf8");
  return JSON.parse(raw) as Site;
}

export async function writeSite(site: Site): Promise<void> {
  await fs.writeFile(SITE_JSON, JSON.stringify(site, null, 2), "utf8");
}
