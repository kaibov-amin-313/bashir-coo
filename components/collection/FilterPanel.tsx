"use client";

import { useEffect, useMemo, useState } from "react";
import { TypeBase } from "@/components/type";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { LocalizedCuratedPiece, Gender } from "@/data/curatedPieces";
import { subcategoriesFor } from "@/data/subcategories";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Category } from "@/types";
import styles from "./FilterPanel.module.css";

/**
 * Bashir&Co — the catalogue's filter panel.
 *
 * Slides in from the right over a dimmed page. Three groups: category,
 * brand, who it's for.
 *
 * Brands are derived from the pieces themselves rather than hard-coded,
 * so a piece added in the admin with a new maker appears in the filter
 * automatically — a hard-coded list would silently omit it and the
 * client would never know why their new Chanel bag was unfindable.
 *
 * Counts sit beside each option: an option that would return nothing is
 * still shown but marked (0), which is more honest than hiding it and
 * leaving the visitor wondering where it went.
 */

const CATEGORY_SEQUENCE: Category[] = [
  "watches", "fashion", "footwear", "bags", "jewelry", "accessories",
];

export interface Filters {
  categories: Category[];
  subcategories: string[];
  brands: string[];
  genders: Gender[];
}

export const EMPTY_FILTERS: Filters = {
  categories: [],
  subcategories: [],
  brands: [],
  genders: [],
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pieces: LocalizedCuratedPiece[];
  filters: Filters;
  onChange: (next: Filters) => void;
  locale: Locale;
  dictionary: Dictionary;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function FilterPanel({
  isOpen,
  onClose,
  pieces,
  filters,
  onChange,
  locale,
  dictionary,
}: FilterPanelProps) {
  useScrollLock(isOpen);

  // Which category is expanded. One at a time — several open at once
  // turns the panel into a wall of checkboxes.
  const [expanded, setExpanded] = useState<Category | null>(null);

  const genderLabels: Record<Gender, string> =
    locale === "ru"
      ? { men: "Мужское", women: "Женское", unisex: "Унисекс" }
      : { men: "Men", women: "Women", unisex: "Unisex" };

  // Brands present in the actual stock, alphabetical.
  const brands = useMemo(
    () =>
      [...new Set(pieces.map((p) => p.brand).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [pieces]
  );

  const genders = useMemo(
    () =>
      (["men", "women", "unisex"] as Gender[]).filter((g) =>
        pieces.some((p) => p.gender === g)
      ),
    [pieces]
  );

  const countBy = (predicate: (p: LocalizedCuratedPiece) => boolean) =>
    pieces.filter(predicate).length;

  const activeCount =
    filters.categories.length +
    filters.subcategories.length +
    filters.brands.length +
    filters.genders.length;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const t = (ru: string, en: string) => (locale === "ru" ? ru : en);

  return (
    <>
      <div
        className={[styles.scrim, isOpen ? styles.scrimOpen : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[styles.panel, isOpen ? styles.open : ""]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={t("Фильтры", "Filters")}
        inert={!isOpen || undefined}
      >
        <header className={styles.head}>
          <TypeBase variant="objectTitle" as="h2">
            {t("Фильтры", "Filters")}
          </TypeBase>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("Закрыть", "Close")}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {/* data-lenis-prevent: Lenis hijacks the wheel across the whole
            document, and even when stopped it swallows the event before it
            reaches a nested scroller. This attribute is its own opt-out —
            without it, this list simply doesn't scroll. */}
        <div className={styles.body} data-lenis-prevent>
          {/* Category — an accordion: expanding one reveals its own
              subcategories, since "верхняя одежда" is meaningless under
              Watches and a shared flat list would be wrong. */}
          <section className={styles.group}>
            <span className={styles.groupTitle}>
              <TypeBase variant="metadata" as="span">
                {t("Категория", "Category")}
              </TypeBase>
            </span>

            {CATEGORY_SEQUENCE.map((c) => {
              const n = countBy((p) => p.category === c);
              const subs = subcategoriesFor(c);
              const isExpanded = expanded === c;

              return (
                <div key={c} className={styles.accordionItem}>
                  <div className={styles.accordionHead}>
                    <label className={styles.option}>
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(c)}
                        onChange={() =>
                          onChange({
                            ...filters,
                            categories: toggle(filters.categories, c),
                          })
                        }
                      />
                      <span className={styles.optionLabel}>
                        <TypeBase variant="body" as="span">
                          {dictionary.categoryLabels[c]}
                        </TypeBase>
                      </span>
                      <span className={styles.count}>({n})</span>
                    </label>

                    {subs.length > 0 ? (
                      <button
                        type="button"
                        className={[styles.chevron, isExpanded ? styles.chevronOpen : ""]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => setExpanded(isExpanded ? null : c)}
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded ? t("Свернуть", "Collapse") : t("Развернуть", "Expand")
                        }
                      >
                        <span aria-hidden="true">›</span>
                      </button>
                    ) : null}
                  </div>

                  {subs.length > 0 ? (
                    <div
                      className={[styles.subList, isExpanded ? styles.subListOpen : ""]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className={styles.subListInner}>
                        {subs.map((s) => {
                          const sn = countBy((p) => p.subcategory === s.id);
                          return (
                            <label key={s.id} className={styles.subOption}>
                              <input
                                type="checkbox"
                                checked={filters.subcategories.includes(s.id)}
                                onChange={() =>
                                  onChange({
                                    ...filters,
                                    subcategories: toggle(filters.subcategories, s.id),
                                  })
                                }
                              />
                              <span className={styles.optionLabel}>
                                <TypeBase variant="body" as="span">
                                  {locale === "ru" ? s.ru : s.en}
                                </TypeBase>
                              </span>
                              <span className={styles.count}>({sn})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>

          {/* Brand */}
          {brands.length > 0 ? (
            <section className={styles.group}>
              <span className={styles.groupTitle}>
                <TypeBase variant="metadata" as="span">
                  {t("Бренд", "Brand")}
                </TypeBase>
              </span>
              {brands.map((b) => {
                const n = countBy((p) => p.brand === b);
                return (
                  <label key={b} className={styles.option}>
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(b)}
                      onChange={() =>
                        onChange({ ...filters, brands: toggle(filters.brands, b) })
                      }
                    />
                    <span className={styles.optionLabel}>
                      <TypeBase variant="body" as="span">{b}</TypeBase>
                    </span>
                    <span className={styles.count}>({n})</span>
                  </label>
                );
              })}
            </section>
          ) : null}

          {/* Gender */}
          {genders.length > 0 ? (
            <section className={styles.group}>
              <span className={styles.groupTitle}>
                <TypeBase variant="metadata" as="span">
                  {t("Кому", "For")}
                </TypeBase>
              </span>
              {genders.map((g) => {
                const n = countBy((p) => p.gender === g);
                return (
                  <label key={g} className={styles.option}>
                    <input
                      type="checkbox"
                      checked={filters.genders.includes(g)}
                      onChange={() =>
                        onChange({ ...filters, genders: toggle(filters.genders, g) })
                      }
                    />
                    <span className={styles.optionLabel}>
                      <TypeBase variant="body" as="span">{genderLabels[g]}</TypeBase>
                    </span>
                    <span className={styles.count}>({n})</span>
                  </label>
                );
              })}
            </section>
          ) : null}
        </div>

        <footer className={styles.foot}>
          <button
            type="button"
            className={styles.reset}
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={activeCount === 0}
          >
            <TypeBase variant="ctaText" as="span">
              {t("Сбросить", "Reset")}
            </TypeBase>
          </button>
          <button type="button" className={styles.apply} onClick={onClose}>
            <TypeBase variant="ctaText" as="span">
              {t("Показать", "Show")}
            </TypeBase>
          </button>
        </footer>
      </aside>
    </>
  );
}
