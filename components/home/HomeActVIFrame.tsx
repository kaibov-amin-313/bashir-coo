"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import {
  mediaConditions,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act VI: Contact transition / A Way In placeholder.
 *
 * Resolves the homepage — warm register, no object imagery, hold and a
 * simple reveal, no spectacle (Homepage Film Script Ch.9). The
 * atmosphere placeholder deliberately reuses the Final Held Breath
 * treatment, rhyming with the Threshold's own light geometry.
 *
 * "A Way In" renders as quiet, non-interactive placeholder text rather
 * than a link: `/contact` has no page yet (Form system is a later
 * phase), and a link that lands on a 404 would be worse than a visual
 * placeholder. When the Contact page exists, this becomes the real path
 * in.
 */
export function HomeActVIFrame() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        `(prefers-reduced-motion: no-preference)`,
        () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 55%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            '[data-act6-target="line"]',
            softRevealFrom(),
            softRevealTo()
          ).fromTo(
            '[data-act6-target="wayIn"]',
            softRevealFrom(),
            softRevealTo(),
            "+=0.4"
          );
        }
      );

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set(
          '[data-act6-target="line"], [data-act6-target="wayIn"]',
          { autoAlpha: 1 }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.actVI} aria-label="A way in">
      <PlaceholderMedia
        kind="finalHeldBreath"
        slot="act-vi-final-held-breath"
        className={styles.actVIAtmosphere}
      />
      <div className={styles.actVIContent}>
        <div data-act6-target="line">
          <TypeBase variant="sectionStatement" as="p" align="center">
            The house is listening.
          </TypeBase>
        </div>
        <div data-act6-target="wayIn">
          <TypeBase variant="ctaText" as="span">
            A Way In
          </TypeBase>
        </div>
      </div>
    </section>
  );
}
