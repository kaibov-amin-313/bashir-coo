import { TypeBase } from "@/components/type";
import styles from "./Threshold.module.css";

/**
 * Bashir&Co — Threshold first line.
 *
 * The intimate opening statement, targeted by
 * `data-threshold-target="line"`, revealed via the Patient Title
 * behavior. Example copy only — not a final marketing commitment
 * (Homepage Film Script Ch.3 lists this among example fragments).
 *
 * Uses the `sectionStatement` variant — intimate scale, not the hero
 * headline, matching Threshold's restrained register (the monumental
 * scale belongs to Act I, a later phase).
 */
export function ThresholdLine() {
  return (
    <div className={styles.line} data-threshold-target="line">
      <TypeBase variant="sectionStatement" as="p" align="center">
        Some things are only ever shown.
      </TypeBase>
    </div>
  );
}
