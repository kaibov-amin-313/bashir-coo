/**
 * Bashir&Co — Spacing tokens.
 *
 * The twelve-step scale from Design System Ch.4, base unit 8px.
 * Every margin, padding, and gap value in the system traces to one of
 * these twelve numbers — an eighth-step value or an arbitrary intermediate
 * number is a defect, not a style preference (Production Architecture Ch.6).
 */

export const spacing = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 48,
  6: 64,
  7: 96,
  8: 120,
  9: 160,
  10: 200,
  11: 240,
  12: 320,
} as const;

export type SpacingStep = keyof typeof spacing;
