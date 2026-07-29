import type { ThresholdDarknessFrameProps } from "./threshold.types";
import styles from "./Threshold.module.css";

/**
 * Bashir&Co — Threshold.DarknessFrame.
 *
 * The full-viewport stage — true black (Deepest register), holding zero
 * animated properties of its own. Everything else in the Threshold
 * sequence renders as its children, layered on top.
 *
 * Not a Client Component — it has no hooks or handlers of its own.
 * `ThresholdSequence` (the Client Component parent) targets its children
 * via data-attribute selectors for animation.
 */
export function ThresholdDarknessFrame({
  children,
}: ThresholdDarknessFrameProps) {
  return <div className={styles.stage}>{children}</div>;
}
