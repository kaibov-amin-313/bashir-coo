/**
 * Bashir&Co — Border, radius, shadow, and z-index tokens.
 *
 * Grouped in one file because each is a single value or a very short list —
 * per Design System Ch.17, this system deliberately does not have a radius
 * *scale*, a shadow/elevation *system*, or more than a handful of z-index
 * layers. If a future need seems to require more of any of these, that is
 * a Design System conversation, not a quiet local addition here.
 */

export const borders = {
  /** Width only — pair with `colors.border` for the actual rendered border. */
  hairline: 1,
  /** Width only — pair with `colors.focusRing`. Design System range: 2–4px. */
  focus: 3,
} as const;

/**
 * Radius across the entire button and media system is 0–2px —
 * "effectively square corners" (Design System Ch.7). This is the single
 * token for the whole system; there is no radius scale.
 */
export const radius = {
  minimal: 2,
} as const;

/**
 * The one shadow in the system — a soft inset vignette for contained media
 * against a same-toned dark background (Design System Ch.11). There is no
 * card-elevation model; this token exists because no card component does.
 */
export const shadow = {
  mediaEdge: "inset 0 0 32px rgba(0, 0, 0, 0.35)",
} as const;

/**
 * Five layers, ordered. A sixth layer added "just for this one component"
 * is a signal to reconsider stacking context, not a reason to extend this
 * list (Component Library Ch.17).
 */
export const zIndex = {
  baseContent: 0,
  stickyNavMark: 10,
  recognitionGestureOverlay: 20,
  fullScreenNavOverlay: 30,
  thresholdTopLayer: 40,
} as const;
