"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PIECE_QUERY_PARAM } from "@/config/routes";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Bashir&Co — direct object linking handler.
 *
 * Reads the `?piece=` query param on a Collection route and scrolls to
 * the matching `Passage.Wrapper`'s stable id (`piece-<slug>`) after
 * hydration — the v1 behavior the Production Architecture Plan Ch.4
 * specifies: the piece stays inside the Collection's continuous scroll;
 * no product route, no breadcrumb, no isolated layout.
 *
 * Scroll goes through the Lenis singleton when it's running (so smooth
 * scroll and ScrollTrigger stay in one system) and falls back to native
 * `scrollIntoView` otherwise. Under reduced motion both paths are
 * instant — Lenis is off (see CollectionLenis) and `behavior: "auto"`
 * is used.
 *
 * After scrolling, focus moves to the passage's own heading (which
 * carries tabIndex={-1} for exactly this) with `preventScroll`, so a
 * screen reader or keyboard user lands on the piece they were linked
 * to rather than at the top of a long page — the "only if safe and not
 * disruptive" option the brief allows, implemented in its safe form.
 *
 * Must be rendered inside <Suspense>: `useSearchParams` requires it on
 * statically rendered routes (a Next.js App Router requirement, not a
 * style choice — the build fails without it).
 *
 * Renders nothing.
 */
export function PieceScrollHandler() {
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const pieceSlug = searchParams.get(PIECE_QUERY_PARAM);

  useEffect(() => {
    if (!pieceSlug) return;

    // One frame's delay so layout (fonts, placeholder frames) has
    // settled before measuring the scroll target.
    const raf = requestAnimationFrame(() => {
      const target = document.getElementById(`piece-${pieceSlug}`);
      if (!target) return;

      const lenis = getLenis();
      if (lenis && !reducedMotion) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }

      const heading = target.querySelector<HTMLElement>("h3");
      heading?.focus?.({ preventScroll: true });
    });

    return () => cancelAnimationFrame(raf);
  }, [pieceSlug, reducedMotion]);

  return null;
}
