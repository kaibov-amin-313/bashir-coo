"use client";

import { useCart, type CartLine } from "@/store/CartContext";
import type { Locale } from "@/lib/i18n";
import styles from "./AddToCartButton.module.css";

/**
 * Bashir&Co — add-to-cart control, styled as a bookmark glyph that sits
 * over the top-right of the piece photo (the reference pattern). Outline
 * when the piece isn't saved, filled once it is. A small client island in
 * the otherwise-server card; it takes the flattened line data as props so
 * it never has to look anything up.
 */

interface AddToCartButtonProps {
  line: Omit<CartLine, "qty">;
  locale: Locale;
}

export function AddToCartButton({ line, locale }: AddToCartButtonProps) {
  const { add, remove, has } = useCart();
  const inCart = has(line.slug);
  const t = (ru: string, en: string) => (locale === "ru" ? ru : en);

  return (
    <button
      type="button"
      className={[styles.bookmark, inCart ? styles.saved : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) => {
        // The card is wrapped in a Link — don't navigate when the intent
        // was to save the piece. Toggle: tap again to remove.
        e.preventDefault();
        e.stopPropagation();
        if (inCart) remove(line.slug);
        else add(line);
      }}
      aria-pressed={inCart}
      aria-label={
        inCart
          ? `${t("Убрать из корзины", "Remove from cart")}: ${line.title}`
          : `${t("В корзину", "Add to cart")}: ${line.title}`
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        {/* Bookmark ribbon. fill is set by CSS: none when unsaved,
            currentColor when saved. */}
        <path
          d="M6 4h12v16l-6-4-6 4V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
