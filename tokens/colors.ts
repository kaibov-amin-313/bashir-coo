/**
 * Bashir&Co — Color tokens.
 *
 * Source of truth for every color in the system, per Design System Ch.2
 * and Production Architecture Plan Ch.6 ("one source of truth, two
 * consumption paths"). The values here MUST stay in lockstep with
 * `/tokens/tokens.css` — this file is the JS/TS-readable path (for GSAP
 * tweens, canvas fill/stroke colors, or any future logic that needs a raw
 * value), the CSS file is the CSS-readable path (`var(--color-*)`).
 *
 * Deliberately absent: a "success" color. Confirmation states are
 * communicated through typography and motion only — see Design System
 * Ch.2 and Ch.17. Do not add one back without updating that document first.
 */

export const colors = {
  surfacePrimary: "#faf7f1",
  surfaceSecondary: "#f2ede3",
  surfaceTertiary: "#ede6d9",

  textPrimary: "#262220",
  /** Reserved for Threshold's wordmark and Home Act I's hero headline only. */
  textPrimaryMax: "#241f19",
  textSecondary: "#6f665d",
  textMuted: "#9a9186",

  /**
   * Border/divider color. In CSS this is implemented via `color-mix()`
   * against `--color-text-primary` at low opacity (Design System: 8–12%),
   * so it stays derived from the primary text token rather than a second,
   * independently-hardcoded value. This JS-side value approximates that
   * same result for any non-CSS consumer (e.g. a canvas stroke).
   */
  border: "#e4ddd0",

  /** Same value as textPrimaryMax — kept as its own semantic token per
   * Design System Ch.17, so a future rebrand only touches one meaning. */
  focusRing: "#241f19",

  /**
   * The single deliberate exception to "no UI color" — muted and
   * desaturated on purpose. Always paired with a non-color signal
   * (border-weight increase, inline text) — see Form.ValidationMessage.
   */
  stateError: "#96604f",

  /** Warm charcoal — the only dark surface; contrast blocks only. */
  surfaceContrast: "#4a2c28",
  textOnContrast: "#f2e4df",

  /** Bashir Rosewood — signature accent; small-scale use only. */
  accent: "#7a3b34",
  accentStrong: "#5e2c26",
} as const;

export type ColorToken = keyof typeof colors;
