"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/store/CartContext";
import { CartPanel } from "./CartPanel";
import type { Locale } from "@/lib/i18n";
import styles from "./CartButton.module.css";

/**
 * Bashir&Co — cart trigger for the header.
 *
 * A bag glyph with a count badge. Open/closed state lives in the cart
 * context (not here) so the header can also read it and switch to its
 * solid theme while the panel is open.
 *
 * The panel is rendered through a portal into document.body, NOT inline
 * here. The header carries `transform` (for its hide-on-scroll slide and
 * will-change), and a transformed ancestor becomes the containing block
 * for any `position: fixed` descendant — so a panel rendered inside the
 * header would anchor to the header (and slide away with it) instead of
 * the viewport. The portal lifts the panel out to the body, where fixed
 * positioning behaves correctly on every page and every scroll state.
 */

interface CartButtonProps {
  locale: Locale;
}

export function CartButton({ locale }: CartButtonProps) {
  const { count, isOpen, open, close } = useCart();
  const [mounted, setMounted] = useState(false);
  const label = locale === "ru" ? "Корзина" : "Cart";

  // Portals need a DOM target, which only exists on the client.
  useEffect(() => setMounted(true), []);

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={open}
        aria-label={count > 0 ? `${label} (${count})` : label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Simple open-top bag: two handles arcing above a trapezoid body. */}
          <path
            d="M8 8V6.5a4 4 0 0 1 8 0V8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M5.5 8h13l1 12H4.5l1-12Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 ? <span className={styles.badge}>{count}</span> : null}
      </button>

      {mounted
        ? createPortal(
            <CartPanel isOpen={isOpen} onClose={close} locale={locale} />,
            document.body
          )
        : null}
    </>
  );
}
