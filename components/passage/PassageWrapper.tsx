"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { passageVariants } from "./passageVariants";
import {
  mediaConditions,
  objectRevealFrom,
  objectRevealTo,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";
import { minimumHolds } from "@/tokens/motion";
import type { Piece } from "@/types";
import Link from "next/link";
import { routes, PIECE_QUERY_PARAM } from "@/config/routes";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./Passage.module.css";

/**
 * Bashir&Co — Passage.Wrapper (with its internal blocks).
 *
 * One object's full passage within a Collection room: title + quiet
 * category mention → macro media → object media → Provenance →
 * inquiry emergence. No routed product page exists or ever will — this
 * renders inline in the Collection's continuous scroll, addressable via
 * the `?piece=` query param through its stable DOM id (Production
 * Architecture Plan Ch.4, Ch.10).
 *
 * The internal blocks (MacroMedia, ObjectMedia, ProvenanceBlock,
 * InquiryEmergence) are file-local render functions rather than exported
 * components: none is instantiated anywhere except inside this wrapper,
 * and v1 has no reason to pretend otherwise. If a later phase genuinely
 * needs one standalone, extracting it then is a rename, not a redesign.
 *
 * Order rule enforced in the timeline itself: Provenance reveals only
 * after the object media has resolved and held (the micro rhythm's
 * object-before-typography order), and the inquiry line reveals last,
 * gated behind Provenance's own hold (Component Library Ch.8's
 * InquiryEmergence gating, at v1 fidelity).
 *
 * Category appears exactly once, as quiet Metadata-scale plain text —
 * never a tag, chip, badge, or link (Design System Ch.10).
 *
 * No price, no Add to Cart, no related items, no Recognition Gesture yet
 * (the dwell system is a later phase).
 */

interface PassageWrapperProps {
  piece: Piece;
  /** Alternating anchor, supplied by the Collection room in sequence. */
  anchor: "left" | "right";
  dictionary: Dictionary;
  locale: Locale;
}

export function PassageWrapper({ piece, anchor, dictionary, locale }: PassageWrapperProps) {
  const rootRef = useRef<HTMLElement>(null);
  const variant = passageVariants[piece.category];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        // Macro frame — its own quiet reveal as it enters.
        gsap.fromTo('[data-passage-target="macro"]', objectRevealFrom(), {
          ...objectRevealTo(),
          scrollTrigger: {
            trigger: '[data-passage-target="macro"]',
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        });

        // Object → hold → Provenance → hold → inquiry, one timeline, so
        // the minimum holds are structural, not incidental gaps.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-passage-target="objectRow"]',
            start: "top 60%",
            toggleActions: "play reverse play reverse",
          },
        });

        tl.fromTo(
          '[data-passage-target="objectMedia"]',
          objectRevealFrom(),
          objectRevealTo()
        )
          .to({}, { duration: minimumHolds.object - 1.0 })
          .fromTo(
            '[data-passage-target="provenance"]',
            softRevealFrom(),
            softRevealTo()
          )
          .to({}, { duration: minimumHolds.typography })
          .fromTo(
            '[data-passage-target="inquiry"]',
            softRevealFrom(),
            softRevealTo()
          );
      });

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set(
          '[data-passage-target="macro"], [data-passage-target="objectMedia"], [data-passage-target="provenance"], [data-passage-target="inquiry"]',
          { autoAlpha: 1 }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <article
      ref={rootRef}
      id={`piece-${piece.slug}`}
      className={styles.wrapper}
      aria-label={piece.title}
    >
      <header className={styles.header}>
        <TypeBase variant="objectTitle" as="h3" tabIndex={-1}>
          {piece.title}
        </TypeBase>
        <TypeBase variant="metadata" as="span">
          {dictionary.categoryLabels[piece.category]}
        </TypeBase>
      </header>

      <div className={styles.macro} data-passage-target="macro">
        <MediaSlot
          src={`/images/products/${piece.slug}-macro.jpg`}
          fallbackKind={variant.macroKind}
          alt={piece.title}
          className={styles.fillSlot}
        />
      </div>

      <div
        className={[
          styles.objectRow,
          anchor === "left" ? styles.anchorLeft : styles.anchorRight,
        ].join(" ")}
        data-passage-target="objectRow"
      >
        <div className={styles.objectMedia} data-passage-target="objectMedia">
          <MediaSlot
            src={`/images/products/${piece.slug}.jpg`}
            fallbackKind={variant.objectKind}
            alt={piece.title}
            className={styles.fillSlot}
          />
        </div>
        <div className={styles.objectText}>
          <div data-passage-target="provenance">
            <TypeBase variant="provenance" as="p">
              {piece.provenance}
            </TypeBase>
          </div>
          <div className={styles.inquiry} data-passage-target="inquiry">
            <Link
              href={`${localePath(locale, routes.contact)}?${PIECE_QUERY_PARAM}=${piece.slug}`}
              className={styles.inquiryLine}
            >
              <TypeBase variant="ctaText" as="span">
                {dictionary.common.askAboutPiece}
              </TypeBase>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
