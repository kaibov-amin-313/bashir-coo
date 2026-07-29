import { TypeBase } from "@/components/type";
import styles from "./Threshold.module.css";

/**
 * Bashir&Co — Threshold.WordmarkReveal.
 *
 * Wraps one `Type.Wordmark` instance, targeted by
 * `data-threshold-target="wordmark"`. The wrapper starts at opacity 0
 * (see CSS); `buildThresholdTimeline()` animates it in. `splitReady` is
 * false — the wordmark is a single word and is never line-split.
 */
export function ThresholdWordmarkReveal() {
  return (
    <div className={styles.wordmark} data-threshold-target="wordmark">
      <TypeBase variant="wordmark" as="span" splitReady={false}>
        Bashir&amp;Co
      </TypeBase>
    </div>
  );
}
