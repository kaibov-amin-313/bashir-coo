import gsap from "gsap";
import { minimumHolds } from "@/tokens/motion";
import { addPatientTitle } from "./patientTitle";

/**
 * Bashir&Co — Threshold timeline.
 *
 * Beat order, fixed (Homepage Film Script Ch.3; Motion Bible Ch.4):
 * darkness hold → light reveal → wordmark reveal → wordmark hold →
 * first patient-title line → held stillness → (caller fires the hard cut
 * via `onComplete`).
 *
 * Every duration below is a single, considered value chosen from within
 * the documented range for that beat — not the range itself, and not a
 * value invented for this file. Where a range wasn't given a specific
 * point elsewhere (e.g. "resolves within the Standard band"), the
 * existing `/tokens/motion.ts` default for that band is used directly,
 * not re-typed.
 */

export const THRESHOLD_SELECTORS = {
  light: '[data-threshold-target="light"]',
  wordmark: '[data-threshold-target="wordmark"]',
  line: '[data-threshold-target="line"]',
} as const;

export type VisitorState = "first-time" | "returning";

interface ThresholdTiming {
  darknessHold: number;
  lightReveal: number;
  wordmarkReveal: number;
  wordmarkHold: number;
  lineHold: number;
}

/** Motion Bible Ch.4 — first-time visitor. */
const FIRST_TIME_TIMING: ThresholdTiming = {
  darknessHold: 1.3, // 1–1.5s
  lightReveal: 2.5, // 2–3s
  wordmarkReveal: 1.0, // 0.9–1.2s
  wordmarkHold: 1.6, // minimum 1.5s
  lineHold: 1.2, // at least 0.9s, plus additional stillness
};

/** Motion Bible Ch.4 — returning visitor, same beats, compressed. */
const RETURNING_TIMING: ThresholdTiming = {
  darknessHold: 0.5, // 0.4–0.6s
  lightReveal: 1.25, // 1–1.5s
  wordmarkReveal: 1.0, // resolves within Standard band
  wordmarkHold: 0.7, // 0.6–0.8s
  lineHold: minimumHolds.typography, // the 0.9s floor still applies, no extra
};

interface BuildThresholdTimelineArgs {
  visitorState: VisitorState;
  reducedMotion: boolean;
  onComplete: () => void;
}

export function buildThresholdTimeline({
  visitorState,
  reducedMotion,
  onComplete,
}: BuildThresholdTimelineArgs): gsap.core.Timeline {
  const timeline = gsap.timeline({ onComplete });

  if (reducedMotion) {
    // Motion Bible Ch.12: simple opacity resolve only — no drift, no
    // blur, no flashing. Shorter than the full sequence, but the 0.9s
    // minimum hold still applies; this is compressed, never instant.
    timeline
      .to(THRESHOLD_SELECTORS.light, { opacity: 1, duration: 0.3 })
      .to(THRESHOLD_SELECTORS.wordmark, { opacity: 1, duration: 0.3 }, "+=0.15")
      .to(THRESHOLD_SELECTORS.line, { opacity: 1, duration: 0.3 }, "+=0.15")
      .to({}, { duration: minimumHolds.typography });
    return timeline;
  }

  const timing =
    visitorState === "returning" ? RETURNING_TIMING : FIRST_TIME_TIMING;

  timeline
    .addLabel("darkness")
    // Pure hold — zero animated properties. This is the beat most likely
    // to look like "dead time" to someone optimizing for perceived speed;
    // it is precisely the beat this system exists to protect.
    .to({}, { duration: timing.darknessHold })
    .addLabel("light")
    .to(THRESHOLD_SELECTORS.light, {
      opacity: 1,
      duration: timing.lightReveal,
      ease: "power2.out",
    })
    // No overlap with the wordmark below — light must complete fully
    // before the wordmark begins (Motion Bible Ch.4), so no position
    // parameter is passed here; GSAP's own default sequential placement
    // (immediately after the previous tween ends) is exactly correct.
    .addLabel("wordmark")
    .fromTo(
      THRESHOLD_SELECTORS.wordmark,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: timing.wordmarkReveal, ease: "power2.out" }
    )
    .to({}, { duration: timing.wordmarkHold })
    .addLabel("line");

  addPatientTitle(timeline, THRESHOLD_SELECTORS.line, { scale: "intimate" });

  timeline.to({}, { duration: timing.lineHold });

  return timeline;
}
