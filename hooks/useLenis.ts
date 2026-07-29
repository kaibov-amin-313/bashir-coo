"use client";

import { useEffect } from "react";
import { startLenis, stopLenis } from "@/lib/lenis";

/**
 * Starts the global Lenis instance while `active` is true, stops and
 * destroys it when false or on unmount. The singleton lives in
 * `/lib/lenis.ts`; this hook is only its React lifecycle wrapper.
 *
 * On the homepage, `active` is false during the Threshold (which is an
 * internal timeline, not scroll-driven — Motion Bible Ch.4) and true
 * once the Acts mount and the page actually has scrollable content.
 *
 * Reduced motion: Lenis smoothing is a scroll *feel* layer, not an
 * animation — but under prefers-reduced-motion the calmer choice is
 * native scroll, so callers pass `active: false` in that branch (see
 * `Homepage.tsx`).
 */
export function useLenis(active: boolean) {
  useEffect(() => {
    if (!active) return;

    startLenis();
    return () => {
      stopLenis();
    };
  }, [active]);
}
