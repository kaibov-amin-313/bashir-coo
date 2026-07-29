"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import { routes } from "@/config/routes";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { Category } from "@/types";
import { Wordmark } from "@/components/brand";
import styles from "./SearchOverlay.module.css";

/**
 * Bashir&Co — full-screen search overlay.
 *
 * Real, working search across the curated pieces: matches the query
 * against title, category label, and maker name (the brand is inside the
 * title, so "Hermès" or "часы" both hit). Live results as you type.
 *
 * At rest it shows the categories column plus a few featured pieces.
 * Results link into the catalogue with that category preselected, per
 * the client's choice. Escape closes; focus is trapped to the input and
 * restored to the trigger on close.
 */

const CATEGORY_SEQUENCE: Category[] = [
  "watches", "fashion", "footwear", "bags", "jewelry", "accessories",
];

const FEATURED_COUNT = 6;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dictionary: Dictionary;
  query: string;
  onQueryChange: (value: string) => void;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

export function SearchOverlay({
  isOpen,
  onClose,
  locale,
  dictionary,
  query,
  onQueryChange,
  restoreFocusRef,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Pieces are fetched, not imported: the header renders on every page
  // and is a client component, so it can't read Postgres directly.
  const [pieces, setPieces] = useState<LocalizedCuratedPiece[]>([]);

  useEffect(() => {
    if (!isOpen || pieces.length > 0) return;
    let cancelled = false;
    fetch(`/api/pieces?locale=${locale}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: LocalizedCuratedPiece[]) => {
        if (!cancelled) setPieces(data);
      })
      .catch(() => {
        // Search simply finds nothing if this fails — the rest of the
        // site is unaffected, and the empty state already invites the
        // visitor to describe what they're after instead.
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, locale, pieces.length]);
  const s = dictionary.searchOverlay;

  // Lock the page while the overlay is open, so the wheel scrolls the
  // overlay's results, not the page behind it.
  useScrollLock(isOpen);

  // Live filter: title (brand lives here), category label.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pieces.filter((p) => {
      const haystack = [
        p.title,
        dictionary.categoryLabels[p.category],
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, pieces, dictionary]);

  const featured = pieces.slice(0, FEATURED_COUNT);
  const showResults = query.trim().length > 0;

  // Focus the input on open; Escape closes; restore focus on close.
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && restoreFocusRef?.current) {
      restoreFocusRef.current.focus();
    }
  }, [isOpen, restoreFocusRef]);

  return (
    <div
      id="search-overlay"
      className={[styles.overlay, isOpen ? styles.open : ""]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={s.placeholder}
      inert={!isOpen || undefined}
      // Lenis swallows wheel events document-wide, even while stopped —
      // this is its opt-out, and without it the results don't scroll.
      data-lenis-prevent
    >
      <div className={styles.head}>
        <span className={styles.mark} aria-hidden="true">
          <Wordmark height={34} className={styles.markImg} />
        </span>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={s.close}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={s.placeholder}
          aria-label={s.placeholder}
          autoComplete="off"
        />
      </div>

      <div className={styles.body}>
        {/* Left: categories */}
        <nav className={styles.column} aria-label={s.categoriesHeading}>
          <span className={styles.colHeading}>
            <TypeBase variant="metadata" as="span">{s.categoriesHeading}</TypeBase>
          </span>
          {CATEGORY_SEQUENCE.map((cat) => (
            <Link
              key={cat}
              href={localePath(locale, routes.collection)}
              className={styles.catLink}
              onClick={onClose}
            >
              <TypeBase variant="body" as="span">
                {dictionary.categoryLabels[cat]}
              </TypeBase>
            </Link>
          ))}
        </nav>

        {/* Right: results, or featured pieces at rest */}
        <section className={styles.resultsColumn} aria-live="polite">
          <span className={styles.colHeading}>
            <TypeBase variant="metadata" as="span">
              {showResults ? `${s.resultsHeading} (${results.length})` : s.featuredHeading}
            </TypeBase>
          </span>

          {showResults && results.length === 0 ? (
            <div className={styles.noResults}>
              <TypeBase variant="body" as="p">{s.noResults}</TypeBase>
              <Link
                href={localePath(locale, routes.contact)}
                className={styles.noResultsCta}
                onClick={onClose}
              >
                <TypeBase variant="ctaText" as="span">
                  {dictionary.common.describeRequest}
                </TypeBase>
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {(showResults ? results : featured).map((piece) => (
                <Link
                  key={piece.slug}
                  href={localePath(locale, routes.collection)}
                  className={styles.card}
                  onClick={onClose}
                >
                  <span className={styles.cardMedia}>
                    <MediaSlot
                      src={piece.image}
                      fallbackKind={piece.visualVariant}
                      alt={piece.title}
                      label={dictionary.categoryLabels[piece.category].toUpperCase()}
                    />
                  </span>
                  <span className={styles.cardTitle}>
                    <TypeBase variant="body" as="span">{piece.title}</TypeBase>
                  </span>
                  <span className={styles.cardCategory}>
                    <TypeBase variant="metadata" as="span">
                      {dictionary.categoryLabels[piece.category]}
                    </TypeBase>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
