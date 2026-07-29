"use client";

import { useState, useCallback } from "react";
import { ThresholdSequence } from "@/components/threshold";
import { TypeBase } from "@/components/type";
import styles from "./page.module.css";

/**
 * Bashir&Co — Threshold development preview.
 *
 * Development-only, not a public page. The production Threshold has no
 * controls of any kind — the replay/reset buttons below exist only on
 * this route, to make the sequence testable.
 *
 * Demonstrates the hard cut: when the sequence's `onComplete` fires, the
 * component swaps instantly to the Act I placeholder — a true state
 * change, no fade, no transition. That placeholder is deliberately
 * minimal (Act I animation is a later phase).
 */

type Stage = "threshold" | "actOne";

export default function ThresholdPreviewPage() {
  const [stage, setStage] = useState<Stage>("threshold");
  // `key` forces a full remount of ThresholdSequence on replay, so the
  // whole GSAP timeline rebuilds cleanly from the first frame.
  const [runKey, setRunKey] = useState(0);

  const handleComplete = useCallback(() => setStage("actOne"), []);

  const replay = useCallback(() => {
    setStage("threshold");
    setRunKey((k) => k + 1);
  }, []);

  const resetVisitor = useCallback(() => {
    try {
      window.localStorage.removeItem("bashirco_visited");
    } catch {
      // ignore — private browsing, nothing to reset
    }
    replay();
  }, [replay]);

  return (
    <div className={styles.page}>
      {stage === "threshold" ? (
        <ThresholdSequence key={runKey} onComplete={handleComplete} />
      ) : (
        <main className={styles.actOne}>
          <TypeBase variant="heroHeadline" as="h1" align="center">
            Not everything is meant to be found.
          </TypeBase>
        </main>
      )}

      <div className={styles.devControls} role="group" aria-label="Dev controls">
        <p className={styles.devNote}>Threshold — dev preview. Not public.</p>
        <button type="button" className={styles.devButton} onClick={replay}>
          Replay
        </button>
        <button
          type="button"
          className={styles.devButton}
          onClick={resetVisitor}
        >
          Reset visitor (replay as first-time)
        </button>
        <p className={styles.devHint}>
          First run this session plays first-time timing; Replay plays as
          returning. Reset clears the stored flag. Enable OS reduced-motion
          to check that branch.
        </p>
      </div>
    </div>
  );
}
