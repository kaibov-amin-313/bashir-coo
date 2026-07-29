import styles from "./Threshold.module.css";

/**
 * Bashir&Co — Threshold.LightReveal.
 *
 * CSS-generated for this phase — no final photographed or CG asset
 * exists yet (Motion Bible Ch.4 allows this explicitly). When a real
 * asset is produced, it replaces this file's background treatment
 * without changing this component's contract: it still renders one
 * full-bleed layer, targeted by `data-threshold-target="light"`, animated
 * from opacity 0 by `buildThresholdTimeline()`.
 *
 * See `Threshold.module.css` for why this is deliberately restrained
 * rather than a typical centered gradient hero.
 */
export function ThresholdLightReveal() {
  return <div className={styles.light} data-threshold-target="light" />;
}
