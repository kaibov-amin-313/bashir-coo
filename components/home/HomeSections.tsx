import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot, type PlaceholderKind } from "@/components/media";
import { CuratedPieceCard } from "@/components/collection";
import { RevealScope } from "@/components/motion/RevealScope";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import { routes } from "@/config/routes";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { Category } from "@/types";
import styles from "./HomeSections.module.css";

/**
 * Bashir&Co — Homepage (fashion-house composition, full rebuild).
 *
 * Structure (deliberately NOT the old split-hero / equal-tile layout):
 *   1. Full-width centered editorial hero image with an overlaid ivory
 *      text card near the bottom.
 *   2. Three editorial story blocks (provenance / condition / discretion).
 *   3. Asymmetric category grid: two large tiles, a three-up smaller row,
 *      one wide tile.
 *   4. Curated pieces product row.
 *   5. Private sourcing process (five steps).
 *   6. Full-width editorial service banner (image + overlay statement).
 *   7. (Footer is mounted by the page, not here.)
 *
 * All imagery is MediaSlot → real photos drop in with zero code change.
 * Copy from the dictionary; motion is a quiet one-way fade, off under
 * reduced motion.
 */

const CATEGORY_MAP: Record<
  number,
  { category: Category; kind: PlaceholderKind; image: string }
> = {
  0: { category: "watches", kind: "watchMetal", image: "/images/categories/watches.jpg" },
  1: { category: "fashion", kind: "cashmere", image: "/images/categories/clothing.jpg" },
  2: { category: "footwear", kind: "leather", image: "/images/categories/footwear.jpg" },
  3: { category: "bags", kind: "bagLeather", image: "/images/categories/bags.jpg" },
  4: { category: "jewelry", kind: "jewelryLight", image: "/images/categories/jewelry.jpg" },
  5: { category: "accessories", kind: "silk", image: "/images/categories/accessories.jpg" },
};

interface HomeSectionsProps {
  locale: Locale;
  dictionary: Dictionary;
  /** Pieces come from the server (database, with a file fallback). */
  pieces: LocalizedCuratedPiece[];
}

export function HomeSections({ locale, dictionary, pieces }: HomeSectionsProps) {
  const d = dictionary;
  const showcasePieces = pieces.slice(0, 3);

  // This component is now a Server Component: it renders all of the
  // homepage's copy, links, and markup with zero client JS. The scroll
  // reveal is the only client behaviour, and it lives in <RevealScope>,
  // a thin island wrapping this server-rendered tree — it finds the
  // [data-reveal] elements below and animates them, exactly as the old
  // inline useGSAP did, but without dragging the whole page across the
  // client boundary.
  return (
    <RevealScope>
    <div className={styles.page}>
      {/* 1 — Full-bleed hero: фото на весь первый экран, текст снизу */}
      <section className={styles.hero} aria-label={d.home.hero.title}>
        <MediaSlot
          src="/images/hero/home-hero.jpg"
          fallbackKind="editorialLifestyle"
          priority
          label="BASHIR&CO"
          className={styles.heroImage}
        />
        <span className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>
            <TypeBase variant="metadata" as="span">{d.home.hero.label}</TypeBase>
          </span>
          <TypeBase variant="heroHeadline" as="h1">{d.home.hero.title}</TypeBase>
          <div className={styles.heroActions}>
            <Link href={localePath(locale, routes.contact)} className={styles.heroCtaPrimary}>
              <TypeBase variant="ctaText" as="span">{d.common.submitInquiry}</TypeBase>
            </Link>
            <Link href={localePath(locale, routes.collection)} className={styles.heroCtaLink}>
              <TypeBase variant="ctaText" as="span">{d.common.viewCurated}</TypeBase>
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.pageContent}>

      {/* 2 — Three editorial story blocks */}
      <section className={styles.stories} aria-label={d.home.categories.heading}>
        {d.home.stories.map((story, i) => (
          <div key={story.title} className={styles.story} data-reveal>
            <span className={styles.storyIndex}>{String(i + 1).padStart(2, "0")}</span>
            <TypeBase variant="objectTitle" as="h2">{story.title}</TypeBase>
            <TypeBase variant="body" as="p">{story.text}</TypeBase>
          </div>
        ))}
      </section>

      {/* 3 — Showcase row: three real pieces, photo on a cream ground,
             label → name → a thin link. No prices, no buttons — a house
             shows the object, it doesn't sell it off a shelf. */}
      <section className={styles.showcase} aria-label={d.home.showcase.label}>
        <div className={styles.showcaseRow}>
          {showcasePieces.map((piece) => (
            <Link
              key={piece.slug}
              href={localePath(locale, routes.collection)}
              className={styles.showcaseItem}
              data-reveal
            >
              <span className={styles.showcaseMedia}>
                <MediaSlot
                  src={piece.image}
                  fallbackKind={piece.visualVariant}
                  alt={piece.title}
                  label={dictionary.categoryLabels[piece.category].toUpperCase()}
                />
              </span>
              <span className={styles.showcaseLabel}>
                <TypeBase variant="metadata" as="span">
                  {d.home.showcase.label}
                </TypeBase>
              </span>
              <TypeBase variant="objectTitle" as="h2">{piece.title}</TypeBase>
              <span className={styles.showcaseCta}>
                <TypeBase variant="ctaText" as="span">{d.home.showcase.cta}</TypeBase>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4 — Split: text on cream at left, a tall photograph at right.
             The quiet one — cream emptiness beside an image is what makes
             a page feel expensive rather than crowded. */}
      <section className={styles.split} aria-label={d.home.split.title}>
        <div className={styles.splitText} data-reveal>
          <span className={styles.splitThumb}>
            <MediaSlot
              src="/images/editorial/sourcing-detail.jpg"
              fallbackKind="macroTexture"
              label={d.home.split.label.toUpperCase()}
            />
          </span>
          <span className={styles.splitLabel}>
            <TypeBase variant="metadata" as="span">{d.home.split.label}</TypeBase>
          </span>
          <TypeBase variant="actTitle" as="h2">{d.home.split.title}</TypeBase>
          <div className={styles.splitBody}>
            <TypeBase variant="body" as="p">{d.home.split.text}</TypeBase>
          </div>
          <div className={styles.splitLinks}>
            <Link href={localePath(locale, routes.privateSourcing)} className={styles.dashLink}>
              <TypeBase variant="ctaText" as="span">{d.home.split.ctaPrimary}</TypeBase>
            </Link>
            <Link href={localePath(locale, routes.contact)} className={styles.dashLink}>
              <TypeBase variant="ctaText" as="span">{d.home.split.ctaSecondary}</TypeBase>
            </Link>
          </div>
        </div>
        <div className={styles.splitPhoto}>
          <MediaSlot
            src="/images/editorial/sourcing-hero.jpg"
            fallbackKind="editorialLifestyle"
            label="BASHIR&CO"
            className={styles.splitPhotoImg}
          />
        </div>
      </section>

      {/* 5 — Private sourcing process */}
      <section className={styles.process} aria-label={d.home.howItWorks.heading}>
        <div className={styles.processHead} data-reveal>
          <TypeBase variant="actTitle" as="h2">{d.home.howItWorks.heading}</TypeBase>
        </div>
        <ol className={styles.steps}>
          {d.home.howItWorks.steps.map((step, index) => (
            <li key={step.title} className={styles.step} data-reveal>
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
              <TypeBase variant="objectTitle" as="h3">{step.title}</TypeBase>
              <TypeBase variant="caption" as="p">{step.text}</TypeBase>
            </li>
          ))}
        </ol>
      </section>

      {/* 6 — Full-width editorial service banner */}
      <section className={styles.banner} aria-label={d.home.serviceBanner.statement}>
        <MediaSlot
          src="/images/editorial/house.jpg"
          fallbackKind="interiorWarm"
          label="BASHIR&CO"
          className={styles.bannerImage}
        />
        <span className={styles.bannerScrim} aria-hidden="true" />
        <div className={styles.bannerContent} data-reveal>
          <span className={styles.bannerLabel}>
            <TypeBase variant="metadata" as="span">{d.home.serviceBanner.label}</TypeBase>
          </span>
          <TypeBase variant="collectionTitle" as="p">{d.home.serviceBanner.statement}</TypeBase>
          <Link href={localePath(locale, routes.contact)} className={styles.bannerCta}>
            <TypeBase variant="ctaText" as="span">{d.home.serviceBanner.cta}</TypeBase>
          </Link>
        </div>
      </section>
    </div>
    </div>
    </RevealScope>
  );
}
