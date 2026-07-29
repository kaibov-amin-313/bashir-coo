"use client";

import { useEffect } from "react";
import { TypeBase } from "@/components/type";
import { MediaSlot } from "@/components/media";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useCart } from "@/store/CartContext";
import { whatsappLink } from "@/lib/contacts";
import type { Locale } from "@/lib/i18n";
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
 * Prices are shown as their held label ("Цена по запросу") — no totals
 * are computed, because there are no numeric prices yet.
 */

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function CartPanel({ isOpen, onClose, locale }: CartPanelProps) {
  const { lines, count, remove, setQty, clear } = useCart();
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const t = (ru: string, en: string) => (locale === "ru" ? ru : en);

  // Build the concierge message: a titled list of everything gathered.
  const requestMessage = (() => {
    const intro = t(
      "Здравствуйте! Меня интересуют следующие позиции:",
      "Hello! I'm interested in the following pieces:"
    );
    const items = lines
      .map((l) => `• ${l.title}${l.qty > 1 ? ` ×${l.qty}` : ""}`)
      .join("\n");
    return `${intro}\n${items}`;
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
                    alt={line.title}
                    label={line.category.toUpperCase()}
                  />
                </span>

                <div className={styles.lineInfo}>
                  <span className={styles.lineTop}>
                    <span className={styles.lineCategory}>{line.category}</span>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => remove(line.slug)}
                      aria-label={`${t("Убрать", "Remove")}: ${line.title}`}
                    >
                      ✕
                    </button>
                  </span>
                  <TypeBase variant="objectTitle" as="h3">{line.title}</TypeBase>
                  <span className={styles.linePrice}>
                    <TypeBase variant="caption" as="span">{line.priceLabel}</TypeBase>
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
                {t("По запросу", "On request")}
              </span>
            </div>

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
