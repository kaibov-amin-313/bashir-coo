"use client";

import { useCart, type CartLine } from "@/store/CartContext";
import type { Locale } from "@/lib/i18n";
import styles from "./AddToCartButton.module.css";

/**
 * Bashir&Co — add-to-cart control, over the top-right of the piece photo.
 *
 * Draws the same bag the header uses, not a bookmark. A bookmark reads as
 * "save for later" everywhere else on the web, so tapping one and finding
 * a panel called "Корзина" put the sign and the thing at odds — the
 * screen-reader label already said "В корзину" while the icon said
 * something else. One vocabulary now: bag icon, bag in the header, cart
 * panel.
 *
 * Outline when the piece isn't in the cart, filled once it is. A small
 * client island in the otherwise-server card; it takes the flattened line
 * data as props so it never has to look anything up.
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
      className={[styles.cartMark, inCart ? styles.saved : ""]
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
        {/* Same open-top bag as the header control. fill is set by CSS:
            none until the piece is in the cart, currentColor after. */}
        <path
          d="M8 8V6.5a4 4 0 0 1 8 0V8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5.5 8h13l1 12H4.5l1-12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
