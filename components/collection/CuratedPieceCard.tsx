import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { AddToCartButton } from "@/components/cart";
import { formatUsd } from "@/lib/price";
import { routes } from "@/config/routes";
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
  // The card now opens the piece's own page instead of jumping straight
  // to the enquiry form. The old destination skipped the step where
  // interest becomes intent: there was no way to see the photograph
  // larger, read the description, or link to the piece at all.
  const pieceHref = localePath(locale, routes.piece(piece.slug));
  const categoryLabel = categoryLabelOf(dictionary, piece.category);

  return (
    <article className={styles.card} aria-label={piece.title}>
      <Link href={pieceHref} className={styles.mediaLink}>
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
              <TypeBase variant="ctaText" as="span">{dictionary.collectionPage.viewPiece}</TypeBase>
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
          priceUsd: piece.priceUsd,
          // The key, not the label — the panel translates it, so a cart
          // filled in Russian reads correctly in English.
          category: piece.category,
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
        {/* Touch-only label: on hover devices this sits inside the slide-up
            card; on touch there is no hover, so it surfaces here. It reads
            "смотреть", not "оставить запрос" — the card opens the piece's
            page now, and the enquiry lives one step further on. */}
        <span className={styles.bodyCta}>
          <TypeBase variant="ctaText" as="span">{dictionary.collectionPage.viewPiece}</TypeBase>
        </span>
      </div>
    </article>
  );
}
