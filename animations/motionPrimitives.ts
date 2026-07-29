import { motion, minimumHolds } from "@/tokens/motion";
import { breakpoints } from "@/tokens/breakpoints";

/**
 * Bashir&Co — shared motion primitives (homepage v1 scope).
 *
 * Only what homepage v1 needs (Production Architecture Plan: "build only
 * enough for homepage v1, do not over-engineer the future system").
 * Larger primitives — the Threshold Door, Objects' Own Time at full
 * fidelity, the Recognition Gesture — belong to later phases.
 *
 * Every number here traces to /tokens/motion.ts or a documented Motion
 * Bible figure. The reveal transform values (y: 16, scale floor 0.97)
 * are the Design System Ch.2 global reveal rule's documented bands
 * (12–24px paired movement; 0.97–1 object scale).
 *
 * Types: GSAP 3 declares its `gsap` namespace globally, so
 * `gsap.TweenVars` below needs no import — the gsap package's type
 * definitions provide it project-wide.
 */

/**
 * gsap.matchMedia() condition strings, built from the same breakpoint
 * tokens CSS uses — one source of truth, two consumers (Production
 * Architecture Plan Ch.15).
 */
export const mediaConditions = {
  desktop: `(min-width: ${breakpoints.tablet}px) and (prefers-reduced-motion: no-preference)`,
  mobile: `(max-width: ${breakpoints.tablet - 1}px) and (prefers-reduced-motion: no-preference)`,
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/**
 * The standard discrete reveal: autoAlpha paired with a modest y-offset
 * (never opacity alone — Motion Bible Ch.2). For typography and quiet
 * frame content arriving via toggleActions.
 */
export function softRevealFrom(): gsap.TweenVars {
  return { autoAlpha: 0, y: 16 };
}

export function softRevealTo(): gsap.TweenVars {
  return {
    autoAlpha: 1,
    y: 0,
    duration: motion.standard.default,
    ease: "power2.out",
  };
}

/**
 * Object-level reveal: autoAlpha paired with a scale settle from the
 * documented 0.97 floor — for Act III macro beats and Act IV objects.
 */
export function objectRevealFrom(): gsap.TweenVars {
  return { autoAlpha: 0, scale: 0.97 };
}

export function objectRevealTo(): gsap.TweenVars {
  return {
    autoAlpha: 1,
    scale: 1,
    duration: motion.macro.min,
    ease: "power2.out",
  };
}

/**
 * Reduced-motion equivalent of any reveal: simple opacity, brief, no
 * transform, no blur (Motion Bible Ch.12's 200–300ms band).
 */
export function reducedRevealTo(): gsap.TweenVars {
  return { autoAlpha: 1, duration: 0.25, ease: "none" };
}

export { minimumHolds };
