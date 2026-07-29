/**
 * Bashir&Co — Breakpoint tokens.
 *
 * The six tiers from Design System Ch.14. This is the single source of
 * truth — `/config` does not maintain its own duplicate copy (the
 * Production Architecture Plan's "mirrored" phrasing is resolved here by
 * having exactly one file, imported wherever needed, rather than two
 * files kept manually in sync).
 *
 * Real, load-bearing CSS limitation, stated so nobody "fixes" it later:
 * CSS Custom Properties CANNOT be used inside `@media` query conditions
 * in standard CSS. That means these numbers are consumed two ways —
 * (1) here, in JS, for `gsap.matchMedia()` and any `window.matchMedia()`
 * check, and (2) as literal, hand-typed pixel values inside actual
 * `@media` rules in CSS files. If a future edit changes a breakpoint here,
 * every `@media` rule using the old literal value must be updated by hand
 * — there is no way to make CSS media queries reference a variable.
 */

export const breakpoints = {
  smallMobile: 360,
  mobile: 391,
  tablet: 600,
  laptop: 1024,
  desktop: 1440,
  largeDesktop: 1920,
} as const;

export type BreakpointToken = keyof typeof breakpoints;
