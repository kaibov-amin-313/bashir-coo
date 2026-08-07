"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/store/CartContext";
import { TypeBase } from "@/components/type";
import type { Locale } from "@/lib/i18n";
import styles from "./CartToast.module.css";

/**
 * Bashir&Co — add-to-cart confirmation.
 *
 * Briefly names the piece just added and offers a way straight into the
 * cart. It exists because the two existing signals both fail on a phone:
 * the header badge scrolls out of view with the header, and the bookmark
 * that fills in is under the reader's thumb at the moment they tap it.
 * Without this the action could complete with nothing to show for it,
 * and the natural response — tapping again — now *removes* the piece,
 * because the bookmark toggles.
 *
 * Rendered through a portal to the body, and anchored to the bottom of
 * the viewport: the header carries a transform, which would make a fixed
 * child anchor to the header and slide away with it.
 *
 * Announced politely to screen readers — they get the same confirmation
 * without having it interrupt whatever is being read.
 */
export function CartToast({ locale }: { locale: Locale }) {
  const { lastAdded, open } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const visible = lastAdded !== null;

  return createPortal(
    <div
      className={[styles.toast, visible ? styles.visible : ""]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      // Keep it out of the tab order while hidden, so the button inside
      // isn't a stop on an invisible element.
      inert={!visible || undefined}
    >
      <span className={styles.text}>
        <TypeBase variant="caption" as="span">
          {locale === "ru" ? "Добавлено:" : "Added:"} {lastAdded}
        </TypeBase>
      </span>
      <button type="button" className={styles.action} onClick={open}>
        <TypeBase variant="caption" as="span">
          {locale === "ru" ? "В корзину" : "View cart"}
        </TypeBase>
      </button>
    </div>,
    document.body
  );
}
