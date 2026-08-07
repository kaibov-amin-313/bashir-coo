"use client";

import { useState } from "react";
import Link from "next/link";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { routes } from "@/config/routes";
import { categoryLabel as categoryLabelOf, localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { Category } from "@/types";
import type { PlaceholderKind } from "@/components/media";
import styles from "./CategoryMenu.module.css";

/**
 * Bashir&Co — the "Подборка" dropdown.
 *
 * A list of the six categories on the left, a photograph on the right
 * that swaps as you move down the list. Hovering a category previews it;
 * clicking opens the catalogue already filtered to it (?category=…),
 * rather than dumping the visitor into the unfiltered grid to find it
 * themselves.
 *
 * Kept keyboard-usable: the panel opens on focus as well as hover, and
 * Escape closes it — a menu that only responds to a mouse would lock out
 * anyone navigating by keyboard.
 */

const CATEGORIES: {
  category: Category;
  image: string;
  fallback: PlaceholderKind;
}[] = [
  { category: "watches", image: "/images/categories/watches.jpg", fallback: "watchMetal" },
  { category: "fashion", image: "/images/categories/clothing.jpg", fallback: "cashmere" },
  { category: "footwear", image: "/images/categories/footwear.jpg", fallback: "leather" },
  { category: "bags", image: "/images/categories/bags.jpg", fallback: "bagLeather" },
  { category: "jewelry", image: "/images/categories/jewelry.jpg", fallback: "jewelryLight" },
  { category: "accessories", image: "/images/categories/accessories.jpg", fallback: "silk" },
  // No real photo yet — MediaSlot falls back to this placeholder art
  // gracefully until a real perfume photo is added at this path.
  { category: "perfume", image: "/images/categories/perfume.jpg", fallback: "productStill" },
];

interface CategoryMenuProps {
  isOpen: boolean;
  locale: Locale;
  dictionary: Dictionary;
  onClose: () => void;
}

export function CategoryMenu({
  isOpen,
  locale,
  dictionary,
  onClose,
}: CategoryMenuProps) {
  const [preview, setPreview] = useState(0);
  const shown = CATEGORIES[preview] ?? CATEGORIES[0];

  return (
    <div
      className={[styles.panel, isOpen ? styles.open : ""]
        .filter(Boolean)
        .join(" ")}
      inert={!isOpen || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"}
        >
          <span aria-hidden="true">×</span>
        </button>

        {/* Left: the categories */}
        <ul className={styles.list}>
          {CATEGORIES.map((c, i) => (
            <li key={c.category}>
              <Link
                href={`${localePath(locale, routes.collection)}?category=${c.category}`}
                className={[styles.item, i === preview ? styles.itemActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setPreview(i)}
                onFocus={() => setPreview(i)}
                onClick={onClose}
              >
                <TypeBase variant="body" as="span">
                  {dictionary.categoryLabels[c.category]}
                </TypeBase>
              </Link>
            </li>
          ))}

          <li className={styles.allRow}>
            <Link
              href={localePath(locale, routes.collection)}
              className={styles.allLink}
              onClick={onClose}
            >
              <TypeBase variant="ctaText" as="span">
                {locale === "ru" ? "Вся подборка" : "View all"}
              </TypeBase>
            </Link>
          </li>
        </ul>

        {/* Right: the photograph, with a white caption card over its foot */}
        <div className={styles.previewPane}>
          <Link
            href={`${localePath(locale, routes.collection)}?category=${shown.category}`}
            className={styles.previewLink}
            onClick={onClose}
            tabIndex={-1}
            aria-hidden="true"
          >
            <span className={styles.previewMedia}>
              <MediaSlot
                src={shown.image}
                fallbackKind={shown.fallback}
                alt=""
                label={categoryLabelOf(dictionary, shown.category).toUpperCase()}
              />
            </span>

            <span className={styles.previewCaption}>
              <span className={styles.previewTitle}>
                <TypeBase variant="objectTitle" as="span">
                  {dictionary.categoryLabels[shown.category]}
                </TypeBase>
              </span>
              <span className={styles.previewCta}>
                <TypeBase variant="ctaText" as="span">
                  {locale === "ru" ? "Смотреть" : "Discover More"}
                </TypeBase>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
