"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ThresholdDarknessFrame } from "./ThresholdDarknessFrame";
import { ThresholdLightReveal } from "./ThresholdLightReveal";
import { ThresholdWordmarkReveal } from "./ThresholdWordmarkReveal";
import { ThresholdLine } from "./ThresholdLine";
import {
  buildThresholdTimeline,
  type VisitorState,
} from "@/animations/thresholdTimeline";
import { getVisitorState, markVisited } from "@/lib/visitorState";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ThresholdSequenceProps } from "./threshold.types";

/**
 * Bashir&Co — Threshold sequence controller.
 *
 * The one Client Component in the Threshold system. Everything it
 * animates is a plain Server Component targeted via data-attribute
 * selectors — GSAP never runs during server render, and there is no
 * top-level `gsap.to` anywhere (all timeline construction happens inside
 * `useGSAP`, which only runs client-side, after mount).
 *
 * Visitor state is resolved in a client-only way: the component renders
 * "first-time" timing deterministically on the server and first client
 * paint, then reads the real localStorage value inside `useGSAP` (client
 * only) before building the timeline. This avoids any hydration mismatch
 * — the server never tries to guess the returning-visitor state.
 *
 * No Lenis, no ScrollTrigger — the Threshold is an internal timeline, not
 * scroll-driven. No skip control, no progress indicator, no spinner.
 */
export function ThresholdSequence({ onComplete }: ThresholdSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [, setHasStarted] = useState(false);

  useGSAP(
    () => {
      const visitorState: VisitorState = getVisitorState();
      // Mark visited immediately once the sequence begins for real — a
      // returning visitor on their *next* visit gets compressed timing.
      markVisited();
      setHasStarted(true);

      const timeline = buildThresholdTimeline({
        visitorState,
        reducedMotion,
        onComplete,
      });

      return () => {
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={rootRef}>
      <ThresholdDarknessFrame>
        <ThresholdLightReveal />
        <ThresholdWordmarkReveal />
        <ThresholdLine />
      </ThresholdDarknessFrame>
    </div>
  );
}
