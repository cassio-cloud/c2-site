"use client";

import { useEffect, useState } from "react";

/**
 * true depois que a página terminou de carregar e o navegador ficou ocioso.
 * Para mídia pesada que não é o conteúdo principal (vídeo de fundo, player
 * do YouTube): o texto e as imagens pintam primeiro, o que melhora o LCP e
 * o TBT que o Google mede.
 */
export function useDepoisDoLoad(): boolean {
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    let cancelado = false;
    const marcar = () => {
      if (cancelado) return;
      const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 200));
      ric(() => !cancelado && setPronto(true));
    };
    if (document.readyState === "complete") marcar();
    else window.addEventListener("load", marcar, { once: true });
    return () => {
      cancelado = true;
      window.removeEventListener("load", marcar);
    };
  }, []);
  return pronto;
}
