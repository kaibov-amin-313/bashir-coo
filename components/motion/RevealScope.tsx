"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  mediaConditions,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";

/**
 * Bashir&Co — RevealScope.
 *
 * A minimal client island whose only job is to run the standard
 * `[data-reveal]` scroll-reveal over whatever it wraps. The children it
 * animates are ordinary Server Components — this component never renders
 * content itself, it only attaches behaviour to content rendered above
 * it on the server.
 *
 * This is the boundary pattern the Type.Base header comment already
 * anticipates: "the animation that targets this markup lives in a
 * wrapping Client Component, not inside Type.Base itself." Previously the
 * homepage inverted that — the whole section tree carried "use client"
 * just so one `useGSAP` call could find its targets. Moving the effect
 * here lets the entire content tree render on the server (zero client JS
 * for the copy, links, and markup), while only this wrapper and the
 * genuine islands (MediaSlot, header, nav) ship to the browser.
 *
 * Behaviour is identical to the old inline effect: under no-preference,
 * each [data-reveal] element fades and lifts in on scroll; under
 * reduced-motion, everything is simply shown. The selector-based,
 * scoped approach means adding or removing a data-reveal element in the
 * server markup needs no change here.
 */
export function RevealScope({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(el, softRevealFrom(), {
            ...softRevealTo(),
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      });
      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set("[data-reveal]", { autoAlpha: 1 });
      });
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
