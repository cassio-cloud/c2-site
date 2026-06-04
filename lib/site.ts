import { site as storage } from "./storage";
import type { Site } from "./types";

export async function readSite(): Promise<Site> {
  return await storage.read<Site>();
}

export async function writeSite(s: Site): Promise<void> {
  await storage.write(s);
}
