"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns whether the visitor currently prefers reduced motion, per the
 * `prefers-reduced-motion` media query. Live-updating — if the OS setting
 * changes while the tab is open, this reflects it.
 *
 * Implemented with `useSyncExternalStore` rather than useState+useEffect:
 * a media query is exactly the kind of external, subscribable browser
 * state this hook is designed for, and it avoids the cascading-render
 * problem of writing state synchronously inside an effect. The server
 * snapshot is always `false` — a safe, deterministic default that can't
 * cause a hydration mismatch, since the real value is only read on the
 * client.
 */
function subscribe(callback: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getClientSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}
