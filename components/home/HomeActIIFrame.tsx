"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { mediaConditions } from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act II: Time.
 *
 * A still, watch-adjacent surface a single light crosses with almost
 * geological slowness — the visitor's own scroll speed governs the
 * light's travel, trailing raw input via numeric scrub (never 1:1;
 * Motion Bible Ch.3). Camera register: Drift.
 *
 * Desktop: pinned, ~250vh of scroll distance (Motion Bible Ch.3's pin
 * band), scrub 0.9. Mobile: same content, no pin, ~60–70% of desktop's
 * effective distance expressed through the section's own scroll range
 * (Motion Bible Ch.11 restaging). Reduced motion: the static surface
 * frame, content order preserved, no forced movement.
 */
export function HomeActIIFrame() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(mediaConditions.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '[data-act2-target="stage"]',
              start: "top top",
              end: "+=250%",
              pin: true,
              scrub: 0.9,
            },
          })
          .fromTo(
            '[data-act2-target="light"]',
            { xPercent: -25, autoAlpha: 0.6 },
            { xPercent: 55, autoAlpha: 1, ease: "none" }
          )
          .fromTo(
            '[data-act2-target="line"]',
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, ease: "none" },
            0.55
          );
      });

      mm.add(mediaConditions.mobile, () => {
        // Restaged: same beats, no pin — the light scrubs across the
        // section's natural scroll range at a shorter effective distance.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '[data-act2-target="stage"]',
              start: "top 70%",
              end: "bottom top",
              scrub: 0.9,
            },
          })
          .fromTo(
            '[data-act2-target="light"]',
            { xPercent: -25, autoAlpha: 0.6 },
            { xPercent: 55, autoAlpha: 1, ease: "none" }
          )
          .fromTo(
            '[data-act2-target="line"]',
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, ease: "none" },
            0.55
          );
      });

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set('[data-act2-target="light"]', { autoAlpha: 1 });
        gsap.set('[data-act2-target="line"]', { autoAlpha: 1 });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.actII} aria-label="Time">
      <div className={styles.actIIStage} data-act2-target="stage">
        <PlaceholderMedia
          kind="lightSurface"
          slot="act-ii-time-surface"
          className={styles.actIIMedia}
        />
        <div className={styles.actIILight} data-act2-target="light" />
        <div className={styles.actIILine} data-act2-target="line">
          <TypeBase variant="sectionStatement" as="p">
            Nothing here is in a hurry.
          </TypeBase>
        </div>
      </div>
    </section>
  );
}
