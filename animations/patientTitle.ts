import gsap from "gsap";

/**
 * Bashir&Co — The Patient Title behavior.
 *
 * A primitive, not content (Component Library Ch.3; Motion Bible Ch.4) —
 * a drift-into-position reveal: blur (5px to 0) plus a modest position
 * resolve, never a snap. Consumed by name from Threshold's first line now,
 * and from Home Act I's hero headline once a later phase builds it, at a
 * different scale — this is why duration lives behind a `scale` argument
 * rather than being copy-pasted per caller. Never reused twice at
 * identical scale within the same session.
 */

export type PatientTitleScale = "intimate" | "monumental";

const SCALE_DURATIONS: Record<PatientTitleScale, number> = {
  /** Threshold scale — Motion Bible Ch.4: 1.2–2s. */
  intimate: 1.6,
  /** Home Act I's extended scale — Motion Bible Ch.4: 1.8–2.4s. */
  monumental: 2.1,
};

interface PatientTitleOptions {
  scale?: PatientTitleScale;
  /** Position in the parent timeline — omit to add sequentially, per
   * GSAP's own default (immediately after the previous tween ends). */
  position?: gsap.Position;
}

export function addPatientTitle(
  timeline: gsap.core.Timeline,
  target: string,
  { scale = "intimate", position }: PatientTitleOptions = {}
): gsap.core.Timeline {
  return timeline.fromTo(
    target,
    { opacity: 0, filter: "blur(5px)", y: 12 },
    {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: SCALE_DURATIONS[scale],
      ease: "power2.out",
    },
    position
  );
}
