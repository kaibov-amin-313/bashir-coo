/**
 * Bashir&Co — Motion reference tokens.
 *
 * These are POINTERS into the Motion Bible's already-established duration
 * bands and easing families (Motion Bible Ch.2) — this file does not
 * define new motion values, and per the Production Architecture Plan,
 * this phase does not configure GSAP/ScrollTrigger/Lenis deeply. This
 * exists so later phases (and simple CSS transitions, see below) have a
 * single place to import a duration or ease from, rather than a hand-typed
 * number appearing in a component file.
 *
 * `default`/`min`/`max` are provided per band because the Motion Bible
 * specifies each as a range, context-dependent on the specific beat being
 * built — `default` is a reasonable starting point, not a mandate to
 * ignore the documented range when a specific case calls for a different
 * point within it.
 *
 * Two consumption paths, deliberately: GSAP tweens (later phases) read
 * these as plain numbers in seconds. Simple, non-choreographed states —
 * a hover opacity shift, a focus ring appearing — are correctly implemented
 * as a plain CSS `transition`, not a GSAP tween; for that reason the
 * micro/standard bands are ALSO exposed as CSS custom properties in
 * `tokens.css` (in seconds, e.g. `0.14s`), so a `:hover` rule can reference
 * `var(--motion-micro)` directly without pulling in GSAP for something
 * this simple. Complex, scroll-linked, or timeline-based sequences use
 * GSAP and read from this file instead.
 */

export const motion = {
  micro: { min: 0.1, default: 0.14, max: 0.18 },
  standard: { min: 0.7, default: 1.0, max: 1.3 },
  macro: { min: 1.6, default: 2.0, max: 2.8 },
  threshold: { min: 2.5, default: 3.5, max: 5.0 },
} as const;

/**
 * Global minimum-hold floors (Motion Bible Ch.2) — referenced by name
 * throughout every prior document, but never given their own token until
 * now (a small, justified correction, not a new concept). These are
 * floors, not targets: individual sequences may hold longer, but nothing
 * in the system holds for less.
 */
export const minimumHolds = {
  /** Every fully-resolved typographic statement. */
  typography: 0.9,
  /** Every major object reveal (macro rhythm's "darkness" beat, micro
   * rhythm's "pause" beat). */
  object: 1.6,
} as const;

export const easing = {
  /** GSAP ease string. Decelerating, non-oscillating — the system default. */
  default: "power2.out",
  /** GSAP ease string. Symmetric in/out — for motion that must leave and
   * arrive with equal weight (e.g. Collection preview crossfades). */
  symmetric: "power3.inOut",
} as const;

/**
 * Banned outright, everywhere, no exceptions (Motion Bible Ch.1–2):
 * "back", "bounce", "elastic", any CustomWiggle/CustomBounce/Physics2D
 * ease. If a future change introduces one of these, that is drift from
 * the Motion Bible, not a valid creative choice.
 */
