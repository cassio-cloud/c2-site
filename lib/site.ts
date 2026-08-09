import { cache } from "react";
import { site as storage } from "./storage";
import type { Site } from "./types";

/**
 * Leitura crua — vai no Blob toda vez que é chamada.
 *
 * É a que o admin usa: uma Server Action lê, grava e o Next re-renderiza
 * a página dentro da MESMA request. Se essa leitura fosse memoizada, o
 * render pós-save devolveria o snapshot anterior à gravação e o painel
 * mostraria dado velho — exatamente o sintoma que já nos mordeu antes.
 */
export async function readSite(): Promise<Site> {
  return await storage.read<Site>();
}

/**
 * Versão memoizada por request — para as páginas públicas, que só leem.
 *
 * A home monta seis componentes que precisam do site.json (page, Clientes,
 * Team, Contact…) e cada chamada custava um `head()` + um `fetch()` no
 * Blob. Com o `cache()` do React, a primeira chamada da request paga o
 * round-trip e as demais reaproveitam a mesma Promise.
 */
export const readSiteCached = cache(readSite);

export async function writeSite(s: Site): Promise<void> {
  await storage.write(s);
}
