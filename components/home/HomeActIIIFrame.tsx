"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import {
  mediaConditions,
  objectRevealFrom,
  objectRevealTo,
} from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act III: Craft.
 *
 * Six sequential macro beats — metal, fabric, leather, stone, hardware,
 * stitching — deliberately unlabeled: cross-category craft shown without
 * ever listing categories (Homepage Film Script Ch.6; the material names
 * exist only as media-slot identifiers for the future asset swap, never
 * as visible text). Each beat is its own near-full-viewport frame,
 * revealed via toggleActions as it enters — Push/Hold register, no
 * carousel, no grid, and structurally incapable of becoming one: the
 * beats only ever exist stacked in sequence.
 */

const MACRO_BEATS = [
  "act-iii-macro-metal",
  "act-iii-macro-fabric",
  "act-iii-macro-leather",
  "act-iii-macro-stone",
  "act-iii-macro-hardware",
  "act-iii-macro-stitching",
] as const;

export function HomeActIIIFrame() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        `(prefers-reduced-motion: no-preference)`,
        () => {
          gsap.utils
            .toArray<HTMLElement>('[data-act3-target="beat"]')
            .forEach((beat) => {
              gsap.fromTo(beat.firstElementChild, objectRevealFrom(), {
                ...objectRevealTo(),
                scrollTrigger: {
                  trigger: beat,
                  start: "top 65%",
                  toggleActions: "play reverse play reverse",
                },
              });
            });
        }
      );

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set('[data-act3-target="beat"] > *', { autoAlpha: 1 });
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className={styles.actIII}
      aria-label="Craft, before it has a name"
    >
      {MACRO_BEATS.map((slot) => (
        <div key={slot} className={styles.actIIIBeat} data-act3-target="beat">
          <PlaceholderMedia kind="macroTexture" slot={slot} />
        </div>
      ))}
    </section>
  );
}
