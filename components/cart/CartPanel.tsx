"use client";

import { useEffect, useRef, useState } from "react";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { useCart, MAX_QTY } from "@/store/CartContext";
import { whatsappLink } from "@/lib/contacts";
import { formatUsd, sumUsd, priceOnRequestLabel } from "@/lib/price";
import { categoryLabel as categoryLabelOf, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./CartPanel.module.css";

/**
 * Bashir&Co — cart panel.
 *
 * Slides in from the right, mirroring the catalogue filter panel. Lists
 * the pieces the visitor has gathered, with quantity controls and a
 * per-line remove. There is no checkout in this phase: the footer CTA
 * builds a single WhatsApp message listing every gathered piece and hands
 * the conversation to the concierge — the request stays personal, which
 * is the house's model, rather than routing to a payment flow.
 *
 * Prices are shown in USD, the house's trading currency, and the footer
 * totals them. A piece with no numeric price falls back to its "on
 * request" wording, and a cart mixing the two says so rather than
 * quietly presenting a partial sum as the whole.
 */

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dictionary: Dictionary;
}

export function CartPanel({ isOpen, onClose, locale, dictionary }: CartPanelProps) {
  const { lines, count, remove, setQty, clear } = useCart();
  const panelRef = useRef<HTMLElement>(null);
  useScrollLock(isOpen);
  useDialogFocus(isOpen, panelRef, onClose);

  const t = (ru: string, en: string) => (locale === "ru" ? ru : en);

  /**
   * Fresh titles in the current language, keyed by slug.
   *
   * A line stores the title as it read when the piece was added, so a
   * cart filled on the Russian site showed Russian names after switching
   * to English. The catalogue endpoint the search overlay already uses
   * returns titles in the requested locale; matching by slug lets the
   * panel show the right language while the stored snapshot stays as the
   * fallback for anything since removed from the catalogue.
   */
  const [titles, setTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen || lines.length === 0) return;
    let cancelled = false;
    fetch(`/api/pieces?locale=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((pieces: { slug: string; title: string }[] | null) => {
        if (cancelled || !Array.isArray(pieces)) return;
        setTitles(
          Object.fromEntries(pieces.map((p) => [p.slug, p.title]))
        );
      })
      .catch(() => {
        // Offline or the endpoint is down — the stored titles still
        // render, just in whichever language they were added.
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, locale, lines.length]);

  const titleOf = (line: { slug: string; title: string }) =>
    titles[line.slug] ?? line.title;

  // Sum of the priced lines. `null` when nothing in the cart carries a
  // price, so an all-on-request cart shows the wording, not "$0".
  const total = sumUsd(lines);
  // Some pieces may be quoted personally; if the cart mixes priced and
  // unpriced items the total is only part of the story, and says so.
  const hasUnpriced = lines.some((l) => l.priceUsd === null);

  // Build the concierge message: a titled list of everything gathered.
  const requestMessage = (() => {
    const intro = t(
      "Здравствуйте! Меня интересуют следующие позиции:",
      "Hello! I'm interested in the following pieces:"
    );
    const items = lines
      .map((l) => {
        const qty = l.qty > 1 ? ` ×${l.qty}` : "";
        const price =
          l.priceUsd !== null ? ` — ${formatUsd(l.priceUsd, locale)}` : "";
        return `• ${titleOf(l)}${qty}${price}`;
      })
      .join("\n");
    const full = `${intro}\n${items}`;

    // wa.me carries the message in the URL, and Cyrillic percent-encodes
    // to six characters per letter — a ten-line cart already crosses
    // 2,000 characters, past which some clients silently truncate. A
    // request that arrives cut in half is worse than a short one that
    // asks to continue in chat, so long carts send a summary instead.
    const URL_SAFE_CHARS = 1200;
    if (encodeURIComponent(full).length <= URL_SAFE_CHARS) return full;

    const count = lines.reduce((n, l) => n + l.qty, 0);
    return t(
      `Здравствуйте! Меня интересуют ${count} позиций из подборки — пришлю список следующим сообщением.`,
      `Hello! I'm interested in ${count} pieces from my selection — I'll send the list in my next message.`
    );
  })();

  return (
    <>
      <div
        className={[styles.overlay, isOpen ? styles.overlayOpen : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        className={[styles.panel, isOpen ? styles.panelOpen : ""]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={t("Корзина", "Cart")}
        data-lenis-prevent
        inert={!isOpen || undefined}
      >
        <div className={styles.head}>
          <span className={styles.title}>
            <span className={styles.titleMain}>{t("Корзина", "Cart")}</span>
            <span className={styles.titleCount}>
              {count > 0
                ? `${count} ${t("поз.", count === 1 ? "item" : "items")}`
                : t("Пусто", "Empty")}
            </span>
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("Закрыть", "Close")}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {lines.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.emptyIcon}>
                <path d="M8 8V6.5a4 4 0 0 1 8 0V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M5.5 8h13l1 12H4.5l1-12Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span className={styles.emptyTitle}>
                {t("Пока пусто", "Nothing here yet")}
              </span>
              <span className={styles.emptyHint}>
                <TypeBase variant="caption" as="p">
                  {t(
                    "Отмечайте вещи закладкой в коллекции — они появятся здесь.",
                    "Bookmark pieces in the collection and they'll appear here."
                  )}
                </TypeBase>
              </span>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.slug} className={styles.line}>
                <span className={styles.lineMedia}>
                  <MediaSlot
                    src={line.image}
                    fallbackKind={line.visualVariant as never}
                    sizes="76px"
                    alt={titleOf(line)}
                    label={categoryLabelOf(dictionary, line.category).toUpperCase()}
                  />
                </span>

                <div className={styles.lineInfo}>
                  <span className={styles.lineTop}>
                    <span className={styles.lineCategory}>
                      {categoryLabelOf(dictionary, line.category)}
                    </span>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => remove(line.slug)}
                      aria-label={`${t("Убрать", "Remove")}: ${titleOf(line)}`}
                    >
                      ✕
                    </button>
                  </span>
                  <TypeBase variant="objectTitle" as="h3">{titleOf(line)}</TypeBase>
                  <span className={styles.linePrice}>
                    <TypeBase variant="caption" as="span">
                      {line.priceUsd !== null
                        ? formatUsd(line.priceUsd, locale)
                        : priceOnRequestLabel(locale)}
                    </TypeBase>
                  </span>

                  <span className={styles.qtyRow}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => setQty(line.slug, line.qty - 1)}
                      aria-label={t("Убавить", "Decrease")}
                      disabled={line.qty <= 1}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>
                      <TypeBase variant="body" as="span">{line.qty}</TypeBase>
                    </span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => setQty(line.slug, line.qty + 1)}
                      aria-label={t("Добавить", "Increase")}
                      disabled={line.qty >= MAX_QTY}
                    >
                      +
                    </button>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 ? (
          <div className={styles.foot}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t("Итого", "Total")}</span>
              <span className={styles.summaryValue}>
                {total !== null
                  ? formatUsd(total, locale)
                  : priceOnRequestLabel(locale)}
              </span>
            </div>

            {hasUnpriced ? (
              <span className={styles.summaryNote}>
                <TypeBase variant="caption" as="span">
                  {t(
                    "Часть позиций — по запросу, итог неполный.",
                    "Some pieces are quoted on request; the total is partial."
                  )}
                </TypeBase>
              </span>
            ) : null}

            <a
              href={whatsappLink(requestMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.requestCta}
            >
              <TypeBase variant="ctaText" as="span">
                {t("Оставить запрос", "Send request")}
              </TypeBase>
            </a>

            <button type="button" className={styles.clear} onClick={clear}>
              <TypeBase variant="caption" as="span">
                {t("Очистить корзину", "Clear cart")}
              </TypeBase>
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
