"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import {
  mediaConditions,
  objectRevealFrom,
  objectRevealTo,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";
import styles from "./HomeActs.module.css";

/**
 * Bashir&Co — Home Act IV: Collection.
 *
 * The first named, specific objects — a small cross-world selection
 * (never a grid; one object dominates the viewport at a time), object
 * anchor alternating left/right-third on desktop and collapsing to
 * full-width on mobile (Design System Ch.5). Exactly one object carries
 * the singular color arrival (Homepage Film Script Ch.7).
 *
 * Placeholder objects drawn from different luxury worlds, per the
 * Film Script's cross-Collection rule — a watch, a jewel, a bag, a rare
 * object. Titles are example fragments; no prices, no CTA, no
 * Recognition Gesture yet (that dwell system is a later phase).
 */

interface ActIVObject {
  slot: string;
  title: string;
  singularColor?: boolean;
}

const OBJECTS: ActIVObject[] = [
  { slot: "act-iv-object-watch", title: "Reference 1958" },
  { slot: "act-iv-object-jewel", title: "The Meridian Stone", singularColor: true },
  { slot: "act-iv-object-bag", title: "The Diplomat's Case" },
  { slot: "act-iv-object-rare", title: "One of One" },
];

export function HomeActIVFrame() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        `(prefers-reduced-motion: no-preference)`,
        () => {
          gsap.utils
            .toArray<HTMLElement>('[data-act4-target="object"]')
            .forEach((objectEl) => {
              const media = objectEl.querySelector(
                '[data-act4-target="media"]'
              );
              const title = objectEl.querySelector(
                '[data-act4-target="title"]'
              );

              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: objectEl,
                  start: "top 60%",
                  toggleActions: "play reverse play reverse",
                },
              });

              tl.fromTo(media, objectRevealFrom(), objectRevealTo())
                // Title follows the object, never precedes it — the
                // micro rhythm's object-before-typography order.
                .fromTo(title, softRevealFrom(), softRevealTo(), "-=0.6");
            });
        }
      );

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set(
          '[data-act4-target="media"], [data-act4-target="title"]',
          { autoAlpha: 1 }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.actIV} aria-label="From the collection">
      {OBJECTS.map((object, index) => (
        <div
          key={object.slot}
          data-act4-target="object"
          className={[
            styles.actIVObject,
            index % 2 === 0 ? styles.anchorLeft : styles.anchorRight,
          ].join(" ")}
        >
          <div className={styles.actIVMedia} data-act4-target="media">
            <PlaceholderMedia
              kind="objectSilhouette"
              slot={object.slot}
              singularColor={object.singularColor}
            />
          </div>
          <div className={styles.actIVTitle} data-act4-target="title">
            <TypeBase variant="objectTitle" as="h2">
              {object.title}
            </TypeBase>
          </div>
        </div>
      ))}
    </section>
  );
}
