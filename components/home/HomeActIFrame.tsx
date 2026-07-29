"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { addPatientTitle } from "@/animations/patientTitle";
import { mediaConditions } from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act I: Enter the World.
 *
 * Type only. No object, no media, no CTA (Homepage Film Script Ch.4).
 * The headline reveals on mount — not on scroll — via the Patient Title
 * behavior at monumental scale, because Act I appears via the hard cut
 * from the Threshold, and its reveal is part of that cut's landing, not
 * a scroll event. The page's single h1.
 */
export function HomeActIFrame() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.to('[data-act1-target="headline"]', {
          autoAlpha: 1,
          duration: 0.25,
        });
      });

      mm.add(
        `(prefers-reduced-motion: no-preference)`,
        () => {
          const tl = gsap.timeline();
          addPatientTitle(tl, '[data-act1-target="headline"]', {
            scale: "monumental",
          });
          // Extended hold after resolve (Homepage Film Script Ch.4:
          // 2–3s of pure stillness). Nothing else animates during it —
          // it exists so scroll-triggered Act II motion never visually
          // competes with Act I's landing on a fast scroll.
          tl.to({}, { duration: 2.5 });
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.actI} aria-label="Enter the world">
      <div data-act1-target="headline" className={styles.actIHeadline}>
        <TypeBase variant="heroHeadline" as="h1">
          Not everything is meant to be found.
        </TypeBase>
      </div>
    </section>
  );
}
