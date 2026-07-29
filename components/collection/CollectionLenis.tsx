"use client";

import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Bashir&Co — Collection routes' Lenis lifecycle.
 *
 * Starts the global Lenis singleton for the Collection pages (native
 * scroll under reduced motion — the calmer choice, same rule as the
 * homepage). Renders nothing; exists so the route files stay Server
 * Components able to use `generateStaticParams`/`notFound` while still
 * getting smooth scroll.
 *
 * Named Collection-scoped for now because these routes are its only
 * consumers — if a later phase gives every content route smooth scroll,
 * this graduates to a shared location and the collection pages' imports
 * change, nothing else.
 */
export function CollectionLenis() {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);
  return null;
}
