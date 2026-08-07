"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NavConciergeThread } from "@/components/nav";
import { SkipLink } from "@/components/a11y";
import { SiteHeader } from "@/components/header";
import { FooterRoot } from "@/components/footer";
import { TypeBase } from "@/components/type";
import { CollectionLenis } from "./CollectionLenis";
import { CuratedPieceCard } from "./CuratedPieceCard";
import { FilterPanel, EMPTY_FILTERS, type Filters } from "./FilterPanel";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import { routes } from "@/config/routes";
import { plural, localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { Category } from "@/types";
import styles from "./CuratedPieces.module.css";

/**
 * Bashir&Co — Подборка (catalog, reference-driven layout).
 *
 * Breadcrumbs → subcategory row on a light band → centered serif title →
 * a quiet count/divider row (NO filters/sort — that's marketplace) →
 * grid of large photo cards with a category pill. No wishlist hearts,
 * no cart. Subcategory row scrolls the grid to that category (anchor),
 * and also acts as the active-category filter.
 */

const CATEGORY_SEQUENCE: Category[] = [
  "watches", "fashion", "footwear", "bags", "jewelry", "accessories",
];

interface CuratedPiecesViewProps {
  locale: Locale;
  dictionary: Dictionary;
  /** Pieces come from the server (database, with a file fallback). */
  pieces: LocalizedCuratedPiece[];
}

export function CuratedPiecesView({ locale, dictionary, pieces }: CuratedPiecesViewProps) {
  const all = pieces;
  const d = dictionary.collectionPage;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  // A category can arrive in the URL (?category=watches) — that's how the
  // header's dropdown links here. Read it on mount rather than with
  // useSearchParams, which would force this page out of static rendering.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const param = new URLSearchParams(window.location.search).get("category");
      if (param && CATEGORY_SEQUENCE.includes(param as Category)) {
        setFilters((f) => ({ ...f, categories: [param as Category] }));
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // An empty group means "no constraint", not "match nothing" — so a
  // visitor who picks only a brand still sees every category of it.
  const shown = all.filter((p) => {
    const byCategory =
      filters.categories.length === 0 || filters.categories.includes(p.category);
    const bySubcategory =
      filters.subcategories.length === 0 ||
      (p.subcategory !== null && filters.subcategories.includes(p.subcategory));
    const byBrand =
      filters.brands.length === 0 || filters.brands.includes(p.brand);
    const byGender =
      filters.genders.length === 0 || filters.genders.includes(p.gender);
    return byCategory && bySubcategory && byBrand && byGender;
  });

  const activeFilterCount =
    filters.categories.length +
    filters.subcategories.length +
    filters.brands.length +
    filters.genders.length;

  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} dictionary={dictionary} />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      <CollectionLenis />
      <main id="content" lang={locale === "en" ? "en" : undefined}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs} aria-label="breadcrumb">
          <Link href={localePath(locale, routes.home)} className={styles.crumbLink}>
            <TypeBase variant="navItem" as="span">{dictionary.breadcrumbHome}</TypeBase>
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <span className={styles.crumbCurrent}>
            <TypeBase variant="navItem" as="span">{d.title}</TypeBase>
          </span>
        </nav>

        {/* Centered serif title */}
        <header className={styles.titleBlock}>
          <TypeBase variant="actTitle" as="h1">{d.title}</TypeBase>
        </header>

        {/* Filter bar: count at the left, the Filters button at the right.
             No sort control — with prices held as text ("Цена по запросу"),
             a price sort would be a lie. */}
        <div className={styles.filterBar}>
          <span className={styles.count}>
            <TypeBase variant="metadata" as="span">
              {shown.length}{" "}
              {locale === "ru"
                ? plural(shown.length, "позиция", "позиции", "позиций")
                : shown.length === 1
                  ? "piece"
                  : "pieces"}
            </TypeBase>
          </span>

          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setFiltersOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            <span className={styles.filterIcon} aria-hidden="true" />
            <TypeBase variant="navItem" as="span">
              {locale === "ru" ? "Фильтры" : "Filters"}
            </TypeBase>
            {activeFilterCount > 0 ? (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            ) : null}
          </button>
        </div>

        {/* Grid of large photo cards, or an explanation when the filters
            exclude everything. An empty grid is reachable in one click —
            the Perfume category exists in the filter list but holds no
            pieces yet — and silently rendering nothing reads as a broken
            page rather than an empty result. */}
        {shown.length === 0 ? (
          <section className={styles.emptyState}>
            <TypeBase variant="collectionTitle" as="p">
              {locale === "ru"
                ? "По этим фильтрам ничего нет"
                : "Nothing matches these filters"}
            </TypeBase>
            <TypeBase variant="caption" as="p">
              {locale === "ru"
                ? "Снимите часть условий — или напишите нам, и мы найдём это под заказ."
                : "Loosen the filters — or tell us, and we'll source it."}
            </TypeBase>
            <button
              type="button"
              className={styles.emptyReset}
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              <TypeBase variant="ctaText" as="span">
                {locale === "ru" ? "Сбросить фильтры" : "Clear filters"}
              </TypeBase>
            </button>
          </section>
        ) : (
          <section className={styles.grid} aria-label={d.title}>
            {shown.map((piece) => (
              <CuratedPieceCard key={piece.slug} piece={piece} locale={locale} dictionary={dictionary} />
            ))}
          </section>
        )}

        {/* Bottom inquiry CTA */}
        <section className={styles.closing}>
          <TypeBase variant="collectionTitle" as="p">{d.closing}</TypeBase>
          <Link href={localePath(locale, routes.contact)} className={styles.closingCta}>
            <TypeBase variant="ctaText" as="span">{d.closingCta}</TypeBase>
          </Link>
        </section>
      </main>

      <FilterPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        pieces={all}
        filters={filters}
        onChange={setFilters}
        locale={locale}
        dictionary={dictionary}
      />

      <FooterRoot locale={locale} dictionary={dictionary} />
    </>
  );
}
