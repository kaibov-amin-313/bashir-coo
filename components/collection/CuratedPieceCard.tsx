import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { AddToCartButton } from "@/components/cart";
import { formatUsd } from "@/lib/price";
import { routes, PIECE_QUERY_PARAM } from "@/config/routes";
import { categoryLabel as categoryLabelOf, localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import styles from "./CuratedPieceCard.module.css";

/**
 * Bashir&Co — CuratedPieceCard (Loro Piana hover treatment).
 *
 * Large photo fills the card. At rest, a category pill sits top-left.
 * On hover, the pill fades out and a white detail card slides up from
 * the bottom over the image: title → category → "Оставить запрос" link.
 * Pure CSS hover (a group class on the article) — no JS, works with the
 * grid's scroll animation. No wishlist bookmark, no price, no swatches
 * (single-of-one pieces, price on request).
 */

interface CuratedPieceCardProps {
  piece: LocalizedCuratedPiece;
  locale: Locale;
  dictionary: Dictionary;
}

export function CuratedPieceCard({ piece, locale, dictionary }: CuratedPieceCardProps) {
  const inquiryHref = `${localePath(locale, routes.contact)}?${PIECE_QUERY_PARAM}=${piece.slug}`;
  const categoryLabel = categoryLabelOf(dictionary, piece.category);

  return (
    <article className={styles.card} aria-label={piece.title}>
      <Link href={inquiryHref} className={styles.mediaLink}>
        <span className={styles.media}>
          <MediaSlot
            src={piece.image}
            fallbackKind={piece.visualVariant}
            sizes="(max-width: 599px) 50vw, (max-width: 1023px) 33vw, 25vw"
            alt={piece.title}
            label={categoryLabel.toUpperCase()}
          />

          {/* At-rest category pill (fades out on hover). */}
          <span className={styles.pill}>
            <TypeBase variant="metadata" as="span">{categoryLabel.toUpperCase()}</TypeBase>
          </span>

          {/* Hover detail card: slides up from the bottom over the photo. */}
          <span className={styles.hoverCard}>
            <TypeBase variant="objectTitle" as="span">{piece.title}</TypeBase>
            <span className={styles.hoverCategory}>
              <TypeBase variant="metadata" as="span">{categoryLabel}</TypeBase>
            </span>
            <span className={styles.hoverCta}>
              <TypeBase variant="ctaText" as="span">{dictionary.collectionPage.inquire}</TypeBase>
            </span>
          </span>
        </span>
      </Link>

      {/* Save-to-cart bookmark, over the photo's top-right corner. Sits
          outside the <Link> (a button can't be nested in an anchor) but is
          absolutely positioned onto the image via the card's relative
          context. */}
      <AddToCartButton
        locale={locale}
        line={{
          slug: piece.slug,
          title: piece.title,
          image: piece.image,
          priceLabel: piece.priceLabel,
          priceUsd: piece.priceUsd,
          category: categoryLabel,
          visualVariant: piece.visualVariant,
        }}
      />

      {/* Below-image label (always visible, like Loro Piana's name + material). */}
      <div className={styles.body}>
        <TypeBase variant="objectTitle" as="h3">{piece.title}</TypeBase>
        <span className={styles.material}>
          <TypeBase variant="metadata" as="span">{categoryLabel}</TypeBase>
        </span>
        {/* Price in USD. Falls back to the piece's "on request" wording
            when no numeric price is set, so an unpriced commission reads
            deliberately rather than as a missing value. */}
        <span className={styles.price}>
          <TypeBase variant="body" as="span">
            {piece.priceUsd !== null
              ? formatUsd(piece.priceUsd, locale)
              : piece.priceLabel}
          </TypeBase>
        </span>
        {/* Touch-only CTA: on hover devices the request link lives inside the
            slide-up hover card; on touch there is no hover, so it surfaces
            here instead. Hidden on hover-capable devices via CSS. */}
        <span className={styles.bodyCta}>
          <TypeBase variant="ctaText" as="span">{dictionary.collectionPage.inquire}</TypeBase>
        </span>
      </div>
    </article>
  );
}
