"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { TypeBase } from "@/components/type";
import { PlaceholderMedia } from "@/components/media";
import { routes } from "@/config/routes";
import {
  mediaConditions,
  objectRevealFrom,
  objectRevealTo,
  softRevealFrom,
  softRevealTo,
} from "@/animations/motionPrimitives";
import type { Collection } from "@/types";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./Collection.module.css";

/**
 * Bashir&Co — Collection page components.
 *
 * `CollectionSequence` — v1 renders the previews as full-viewport
 * sequential frames with quiet reveals, NOT yet the pinned scale-and-
 * crossfade sequence the Component Library Ch.7 ultimately specifies.
 * This is the brief's own sanctioned conservative option: the pinned
 * crossfade is the single most complex motion mechanic on this page, and
 * shipping it half-right would read worse than shipping the sequential
 * version fully right. The component name and contract are already the
 * final ones, so the motion-polish phase upgrades the inside of this
 * file only. What is already final: one dominant preview per viewport
 * (no grid can form, structurally), the whole composition as the tap
 * target, title-only text, the 1.02–1.03 hover ceiling.
 *
 * `CollectionQuieterWayThrough` — deliberately the least prominent
 * element on the page; standard reveal only, no bespoke choreography
 * (its restraint is its spec — Component Library Ch.7).
 *
 * `CollectionSpecialPiecesBlock` — near-static; no object media ever
 * (its product-free state is structural, not a placeholder).
 */

interface CollectionSequenceProps {
  collections: Collection[];
  locale: Locale;
}

export function CollectionSequence({ collections, locale }: CollectionSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        gsap.utils
          .toArray<HTMLElement>('[data-collection-target="preview"]')
          .forEach((preview) => {
            const media = preview.querySelector(
              '[data-collection-target="media"]'
            );
            const text = preview.querySelectorAll(
              '[data-collection-target="text"]'
            );

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: preview,
                start: "top 65%",
                toggleActions: "play reverse play reverse",
              },
            });

            tl.fromTo(media, objectRevealFrom(), objectRevealTo()).fromTo(
              text,
              softRevealFrom(),
              { ...softRevealTo(), stagger: 0.12 },
              "-=0.7"
            );
          });
      });

      mm.add(mediaConditions.reducedMotion, () => {
        gsap.set(
          '[data-collection-target="media"], [data-collection-target="text"]',
          { autoAlpha: 1 }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.sequence}>
      {collections.map((collection) => (
        <Link
          key={collection.slug}
          href={localePath(locale, routes.collectionDetail(collection.slug))}
          className={styles.preview}
          data-collection-target="preview"
          aria-label={`Enter ${collection.name}`}
        >
          <div
            className={styles.previewMedia}
            data-collection-target="media"
          >
            <PlaceholderMedia
              kind="collectionRoom"
              temperature={collection.lightingTemperature}
              slot={`collection-${collection.slug}-room`}
            />
          </div>
          <div className={styles.previewTitle} data-collection-target="text">
            <TypeBase variant="collectionTitle" as="h2">
              {collection.name}
            </TypeBase>
          </div>
        </Link>
      ))}
    </div>
  );
}

interface LocalizedBlockProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function CollectionQuieterWayThrough({
  locale,
  dictionary,
}: LocalizedBlockProps) {
  return (
    <section
      className={styles.quieterWay}
      aria-label={dictionary.collectionPage.quieterWayCta}
    >
      <TypeBase variant="sectionStatement" as="p">
        {dictionary.collectionPage.quieterWay}
      </TypeBase>
      <Link
        href={localePath(locale, routes.specialPiecesByRequest)}
        className={styles.quietLink}
      >
        <TypeBase variant="ctaText" as="span">
          {dictionary.collectionPage.quieterWayCta}
        </TypeBase>
      </Link>
    </section>
  );
}

export function CollectionSpecialPiecesBlock({
  locale,
  dictionary,
}: LocalizedBlockProps) {
  return (
    <section
      className={styles.specialPieces}
      aria-label={dictionary.specialPieces.title}
    >
      <TypeBase variant="actTitle" as="h1">
        {dictionary.specialPieces.title}
      </TypeBase>
      <div className={styles.specialPiecesBody}>
        <TypeBase variant="body" as="p">
          {dictionary.specialPieces.text}
        </TypeBase>
      </div>
      <Link
        href={localePath(locale, routes.contact)}
        className={styles.quietLink}
      >
        <TypeBase variant="ctaText" as="span">
          {dictionary.specialPieces.cta}
        </TypeBase>
      </Link>
    </section>
  );
}
