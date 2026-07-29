"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import {
  mediaConditions,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act V: Private Concierge.
 *
 * The quietest Act — warm register, minimal motion, no object, no form,
 * no CTA (Homepage Film Script Ch.8). This is also where the homepage's
 * nav visibility flips: `onEnterChange(true)` fires when the visitor
 * reaches this Act, `onEnterChange(false)` if they scroll back above it
 * — `Homepage` uses it to reveal Nav.Mark and warm the concierge thread.
 * That trigger runs in every motion branch including reduced motion,
 * since nav availability is function, not decoration.
 */

interface HomeActVFrameProps {
  onEnterChange: (entered: boolean) => void;
}

export function HomeActVFrame({ onEnterChange }: HomeActVFrameProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Visibility trigger — motion-independent, always active.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 75%",
        onEnter: () => onEnterChange(true),
        onLeaveBack: () => onEnterChange(false),
      });

      const mm = gsap.matchMedia();

      mm.add(
        `(prefers-reduced-motion: no-preference)`,
        () => {
          gsap.fromTo('[data-act5-target="line"]', softRevealFrom(), {
            ...softRevealTo(),
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 55%",
              toggleActions: "play reverse play reverse",
            },
          });
        }
      );

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set('[data-act5-target="line"]', { autoAlpha: 1 });
      });
    },
    { scope: rootRef, dependencies: [onEnterChange] }
  );

  return (
    <section ref={rootRef} className={styles.actV} aria-label="Private concierge">
      <PlaceholderMedia
        kind="interiorAtmosphere"
        slot="act-v-interior"
        className={styles.actVAtmosphere}
      />
      <div className={styles.actVLine} data-act5-target="line">
        <TypeBase variant="sectionStatement" as="p">
          Some conversations begin before a single word is spoken.
        </TypeBase>
      </div>
    </section>
  );
}
