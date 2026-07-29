"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Bashir&Co — Lenis singleton (client-only).
 *
 * One global instance, synced to GSAP's own ticker so both systems share
 * a single requestAnimationFrame loop (Motion Bible Ch.12; Production
 * Architecture Plan Ch.7 — "an unsynced pairing is one of the most
 * common sources of subtle scroll-scrub drift and is treated as a
 * build-blocking defect"). This is Lenis's own documented GSAP
 * integration pattern: ScrollTrigger.update on Lenis's scroll event,
 * Lenis driven from gsap.ticker (seconds → ms), lagSmoothing disabled so
 * the two clocks never disagree after a dropped frame.
 *
 * Never instantiate Lenis anywhere else — `useLenis` (in /hooks) is the
 * React-facing way to start/stop this singleton.
 */

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function startLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    // Motion Bible Ch.3's calibration band: lerp 0.08–0.11. A single
    // considered value from within that documented range.
    lerp: 0.1,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopLenis(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}
