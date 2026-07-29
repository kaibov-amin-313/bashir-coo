import type { ReactNode } from "react";

/**
 * Bashir&Co — Threshold component types.
 *
 * `Threshold.DarknessFrame`, `Threshold.LightReveal`,
 * `Threshold.WordmarkReveal` — Component Library Ch.3.
 */

export interface ThresholdDarknessFrameProps {
  children: ReactNode;
}

export interface ThresholdSequenceProps {
  /**
   * Called once the full sequence (or its reduced-motion equivalent) has
   * completed and held its final stillness — the caller decides what
   * happens next (the hard cut). `ThresholdSequence` itself has no
   * opinion about what comes after; in this phase, the dev preview route
   * shows an Act I placeholder, and a later phase will show the real one.
   */
  onComplete: () => void;
}
