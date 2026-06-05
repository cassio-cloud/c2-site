"use client";

import { useEffect } from "react";

/**
 * useYouTubeClipLoop — controla um iframe YouTube embed pra rodar
 * em loop curto (default 10s) usando a IFrame Player API.
 *
 * Requer que a URL do iframe tenha `enablejsapi=1`.
 *
 * O loop nativo do YouTube (`loop=1&playlist=ID`) só repete o vídeo
 * INTEIRO. Pra loop curto a gente precisa polling do currentTime e
 * `seekTo(0)` ao atingir o limite.
 */

type YTPlayer = {
  getCurrentTime: () => number;
  seekTo: (s: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  destroy?: () => void;
};

type YTPlayerCtor = new (
  el: HTMLIFrameElement | string,
  config: {
    events?: {
      onReady?: (event: { target: YTPlayer }) => void;
      onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    };
  },
) => YTPlayer;

declare global {
  interface Window {
    YT?: { Player: YTPlayerCtor; PlayerState: { PLAYING: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiReadyPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="iframe_api"]',
    );
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }
    const previousHook = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousHook?.();
      resolve();
    };
    // Edge case: API já estava pronta mas hook não foi chamado
    if (window.YT?.Player) resolve();
  });
  return apiReadyPromise;
}

/**
 * Anexa loop curto a um iframe YouTube e reporta state do player.
 *
 * @param iframeRef ref do iframe (precisa ter src com enablejsapi=1)
 * @param maxSeconds duração do loop (default 10s)
 * @param enabled liga/desliga (útil pra lazy load)
 * @param onPlayingChange callback opcional pra reagir ao state.
 *   `true` quando entrou em PLAYING; `false` durante buffering,
 *   unstarted, paused, ended, cued.
 */
export function useYouTubeClipLoop(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  maxSeconds = 10,
  enabled = true,
  onPlayingChange?: (isPlaying: boolean) => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let player: YTPlayer | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;
      try {
        player = new window.YT.Player(iframe, {
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
            onStateChange: (event) => {
              // 1 = playing, qualquer outro state mostra overlay no YouTube
              const isPlaying = event.data === 1;
              onPlayingChange?.(isPlaying);
              if (isPlaying && !pollId) {
                pollId = setInterval(() => {
                  if (!player) return;
                  const t = player.getCurrentTime();
                  if (t >= maxSeconds) player.seekTo(0, true);
                }, 250);
              }
            },
          },
        });
      } catch {
        // ignore — fallback é o loop nativo do YouTube
      }
    });

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      try {
        player?.destroy?.();
      } catch {
        // ignore
      }
    };
  }, [iframeRef, maxSeconds, enabled, onPlayingChange]);
}
