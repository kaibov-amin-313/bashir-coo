/**
 * Bashir&Co — Typography tokens.
 *
 * Fourteen composite tokens, one per Design System Ch.3 category — each
 * bundling size/line-height/tracking/weight together (Component Library
 * Ch.17's "composite token" pattern), since these four properties always
 * travel together in this system. Values here are single canonical
 * numbers chosen from the Design System's stated ranges, not the ranges
 * themselves — a designer choosing a different point within a documented
 * range is a Design System conversation, not a token-file edit.
 *
 * `mobileFontSize` is a fixed px fallback for reference/non-CSS use.
 * In actual CSS (`tokens.css`), the hero headline and act title instead
 * use `clamp()` against `vh`, matching the Design System's rule that
 * mobile scale is proportional to viewport height, not a fixed value.
 *
 * Hard floor, enforced here and never overridden: nothing in this table
 * goes below 12px at any breakpoint; body-reading text never below 16px.
 * (Design System's own typography table lists "11–13px" for Metadata's
 * mobile figure — that row predates the later, more explicit "nothing
 * below 12px, anywhere" rule stated in the same document. This
 * implementation follows the stricter, more deliberate rule. Worth a
 * one-line fix in the Design System's own table if it's ever revised.)
 */

export interface TypeStyle {
  fontSize: number; // px
  mobileFontSize: number; // px — fixed reference value; see note above re: fluid tokens
  lineHeight: number; // unitless multiplier
  letterSpacing: string; // em
  fontWeight: 300 | 400 | 500;
  uppercase?: true;
}

export const typography: Record<string, TypeStyle> = {
  wordmark: {
    fontSize: 20,
    mobileFontSize: 18,
    lineHeight: 1.0,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  heroHeadline: {
    fontSize: 128,
    mobileFontSize: 44, // reference only — CSS uses clamp() against vh
    lineHeight: 1.0,
    letterSpacing: "-0.015em",
    fontWeight: 300,
  },
  actTitle: {
    fontSize: 64,
    mobileFontSize: 32, // reference only — CSS uses clamp() against vh
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    fontWeight: 300,
  },
  sectionStatement: {
    fontSize: 30,
    mobileFontSize: 20,
    lineHeight: 1.28,
    letterSpacing: "-0.005em",
    fontWeight: 400,
  },
  collectionTitle: {
    fontSize: 40,
    mobileFontSize: 26,
    lineHeight: 1.15,
    letterSpacing: "-0.005em",
    fontWeight: 500,
  },
  objectTitle: {
    fontSize: 34,
    mobileFontSize: 22,
    lineHeight: 1.2,
    letterSpacing: "0em",
    fontWeight: 400,
  },
  provenance: {
    fontSize: 17,
    mobileFontSize: 16, // accessibility floor — never lower
    lineHeight: 1.6,
    letterSpacing: "0.002em",
    fontWeight: 400,
  },
  body: {
    fontSize: 17,
    mobileFontSize: 16, // accessibility floor — never lower
    lineHeight: 1.55,
    letterSpacing: "0em",
    fontWeight: 400,
  },
  caption: {
    fontSize: 13,
    mobileFontSize: 12, // system floor — never lower
    lineHeight: 1.45,
    letterSpacing: "0.015em",
    fontWeight: 400,
  },
  metadata: {
    fontSize: 12,
    mobileFontSize: 12, // system floor — never lower (see file header note)
    lineHeight: 1.4,
    letterSpacing: "0.09em",
    fontWeight: 400,
    uppercase: true,
  },
  nav: {
    fontSize: 14,
    mobileFontSize: 14,
    lineHeight: 1.3,
    letterSpacing: "0.03em",
    fontWeight: 400,
  },
  formLabel: {
    fontSize: 13,
    mobileFontSize: 13,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    fontWeight: 500,
  },
  cta: {
    fontSize: 15,
    mobileFontSize: 14,
    lineHeight: 1.2,
    letterSpacing: "0.03em",
    fontWeight: 500,
  },
  legal: {
    fontSize: 12,
    mobileFontSize: 12, // system floor — never lower
    lineHeight: 1.5,
    letterSpacing: "0.005em",
    fontWeight: 400,
  },
};

export type TypographyToken = keyof typeof typography;
