import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { SkipLink } from "@/components/a11y";
import { SiteHeader } from "@/components/header";
import { FooterRoot } from "@/components/footer";
import { AddToCartButton } from "@/components/cart";
import { CuratedPieceCard } from "./CuratedPieceCard";
import { formatUsd } from "@/lib/price";
import { routes, PIECE_QUERY_PARAM } from "@/config/routes";
import {
  categoryLabel as categoryLabelOf,
  localePath,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import styles from "./PieceView.module.css";

/**
 * Bashir&Co — a single piece.
 *
 * Until now a piece had no page: tapping a card went straight to the
 * contact form, so the photograph could never be seen larger, the
 * description had nowhere to live, and no piece could be linked to or
 * indexed. This is the missing step between interest and enquiry.
 *
 * Everything below the photograph is conditional. The twelve pieces
 * currently in the catalogue carry no description or specifications, so
 * the page has to read as deliberate when it holds only a photograph and
 * a name — which is why the layout leans on the image and the type
 * rather than on a grid of fields that would show up half-empty.
 */

interface PieceViewProps {
  locale: Locale;
  dictionary: Dictionary;
  piece: LocalizedCuratedPiece;
  related: LocalizedCuratedPiece[];
}

export function PieceView({
  locale,
  dictionary,
  piece,
  related,
}: PieceViewProps) {
  const t = (ru: string, en: string) => (locale === "ru" ? ru : en);
  const category = categoryLabelOf(dictionary, piece.category);
  const inquiryHref = `${localePath(locale, routes.contact)}?${PIECE_QUERY_PARAM}=${piece.slug}`;

  const specs = [
    { label: t("Референс", "Reference"), value: piece.reference },
    { label: t("Размер", "Size"), value: piece.size },
    { label: t("Состояние", "Condition"), value: piece.condition },
    { label: t("Комплект", "Completeness"), value: piece.completeness },
  ].filter((s) => s.value);

  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} dictionary={dictionary} variant="solid" />

      <main id="content" lang={locale === "en" ? "en" : undefined}>
        <nav className={styles.breadcrumbs} aria-label={t("Хлебные крошки", "Breadcrumb")}>
          <Link href={localePath(locale, routes.home)}>
            <TypeBase variant="metadata" as="span">{dictionary.breadcrumbHome}</TypeBase>
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={localePath(locale, routes.collection)}>
            <TypeBase variant="metadata" as="span">{dictionary.nav.collection}</TypeBase>
          </Link>
          <span aria-hidden="true">·</span>
          <span className={styles.crumbCurrent}>
            <TypeBase variant="metadata" as="span">{category}</TypeBase>
          </span>
        </nav>

        <article className={styles.piece}>
          <div className={styles.mediaColumn}>
            <div className={styles.media}>
              <MediaSlot
                src={piece.image}
                fallbackKind={piece.visualVariant}
                alt={piece.title}
                priority
                sizes="(max-width: 899px) 100vw, 56vw"
                label={category.toUpperCase()}
              />
            </div>
          </div>

          <div className={styles.detail}>
            <span className={styles.brand}>
              <TypeBase variant="metadata" as="span">{piece.brand}</TypeBase>
            </span>

            <TypeBase variant="collectionTitle" as="h1">{piece.title}</TypeBase>

            <span className={styles.price}>
              <TypeBase variant="body" as="p">
                {piece.priceUsd !== null
                  ? formatUsd(piece.priceUsd, locale)
                  : piece.priceLabel}
              </TypeBase>
            </span>

            {piece.description ? (
              <div className={styles.description}>
                <TypeBase variant="body" as="p">{piece.description}</TypeBase>
              </div>
            ) : null}

            {specs.length > 0 ? (
              <dl className={styles.specs}>
                {specs.map((s) => (
                  <div key={s.label} className={styles.specRow}>
                    <dt>
                      <TypeBase variant="metadata" as="span">{s.label}</TypeBase>
                    </dt>
                    <dd>
                      <TypeBase variant="body" as="span">{s.value}</TypeBase>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className={styles.actions}>
              <Link href={inquiryHref} className={styles.inquire}>
                <TypeBase variant="ctaText" as="span">
                  {dictionary.common.submitInquiry}
                </TypeBase>
              </Link>
              <span className={styles.cartAction}>
                <AddToCartButton
                  locale={locale}
                  line={{
                    slug: piece.slug,
                    title: piece.title,
                    image: piece.image,
                    priceUsd: piece.priceUsd,
                    category: piece.category,
                    visualVariant: piece.visualVariant,
                  }}
                />
              </span>
            </div>

            <p className={styles.assurance}>
              <TypeBase variant="caption" as="span">
                {dictionary.home.lifestyle.statement}
              </TypeBase>
            </p>
          </div>
        </article>

        {related.length > 0 ? (
          <section className={styles.related} aria-label={t("Похожие вещи", "Related pieces")}>
            <span className={styles.relatedHead}>
              <TypeBase variant="metadata" as="span">
                {t("Из этой же категории", "More in this category")}
              </TypeBase>
            </span>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <CuratedPieceCard
                  key={r.slug}
                  piece={r}
                  locale={locale}
                  dictionary={dictionary}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <FooterRoot locale={locale} dictionary={dictionary} />
    </>
  );
}
