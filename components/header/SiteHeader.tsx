"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TypeBase } from "@/components/type";
import { NavOverlay, getNavMenuItems } from "@/components/nav";
import { routes } from "@/config/routes";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { Wordmark } from "@/components/brand";
import { CartButton } from "@/components/cart";
import { useCart } from "@/store/CartContext";
import { CONTACT_WHATSAPP_URL } from "@/lib/contacts";
import { SearchOverlay } from "./SearchOverlay";
import { CategoryMenu } from "./CategoryMenu";
import styles from "./SiteHeader.module.css";

/**
 * Bashir&Co — transparent overlay header (Brunello Cucinelli structure).
 *
 * Sits OVER the hero photo, background showing through. Three tiers,
 * centered:
 *   1. Calligraphic wordmark logo (image), centered.
 *   2. Navigation row, centered, uppercase, wide tracking.
 *   3. Thin announcement runner with ‹ › arrows — NO bordeaux double
 *      rule (that was the Loro Piana tell; removed).
 *
 * `overlay` variant is used on pages with a hero; `solid` on inner pages
 * where there's no hero image to sit on. Focus-restoration preserved.
 */

interface SiteHeaderProps {
  locale: Locale;
  dictionary: Dictionary;
  variant?: "overlay" | "solid";
}

export function SiteHeader({ locale, dictionary, variant = "solid" }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "/";
  const items = getNavMenuItems(locale, dictionary);
  const { isOpen: cartOpen } = useCart();

  // Hide the whole header on scroll down, reveal on scroll up. A small
  // threshold near the top keeps it always visible at the very top, and
  // a delta guard avoids flicker on tiny scroll jitters. Respects the
  // nav overlay (never hide while the mobile menu is open).
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const DELTA = 6; // min movement before reacting

    const update = () => {
      const y = window.scrollY;

      // How far the header may travel before it's allowed to hide. On a
      // page with a full-screen hero, that's the hero itself: the header
      // is *designed* to sit over the photograph, so hiding it after a
      // few pixels of scroll — while the hero is still filling the
      // screen — just makes it vanish for no reason. It stays put until
      // the hero is behind us. On inner pages (no hero) a small offset
      // is enough.
      const heroHeight = variant === "overlay" ? window.innerHeight : 120;

      // Past ~70% of the hero we're off the photograph: switch the
      // overlay header to its solid look so it stays legible over the
      // page content beneath.
      setScrolled(y > window.innerHeight * 0.7);

      if (!isOpen) {
        if (y < heroHeight) {
          setHidden(false); // over the hero — always visible
        } else if (Math.abs(y - lastY) > DELTA) {
          setHidden(y > lastY); // past it — hide on down, reveal on up
        }
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen, variant]);

  const ruTarget =
    locale === "ru" ? pathname
      : pathname === "/en" ? "/" : pathname.replace(/^\/en/, "") || "/";
  const enTarget =
    locale === "en" ? pathname : pathname === "/" ? "/en" : `/en${pathname}`;

  /**
   * Publish the header's height as --header-offset so sticky elements
   * below it can clear it.
   *
   * The catalogue's filter bar sticks to `top: 0` and sat *under* this
   * header (z-index 5 against 10), so scrolling back up buried the
   * Filters control. The height can't be hard-coded: three tiers of
   * padding differ between breakpoints. Measured instead, and set to 0
   * while the header is slid out of view, so the bar rises to the top
   * edge rather than leaving a gap where the header used to be.
   */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const publish = () => {
      const h = hidden ? 0 : el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-offset", `${h}px`);
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener("resize", publish);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, [hidden]);

  return (
    <>
      <header
        ref={headerRef}
        className={[
          styles.header,
          variant === "overlay" ? styles.overlay : styles.solid,
          // The overlay header goes solid in two cases: once scrolled past
          // the hero, and while the dropdown is open. The second matters
          // because the panel below it is cream — leaving the header
          // transparent would strand light text over a light sheet, and
          // the two would read as separate, mismatched pieces.
          variant === "overlay" && (scrolled || menuOpen || cartOpen)
            ? styles.scrolledSolid
            : "",
          hidden ? styles.hidden : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseLeave={() => setMenuOpen(false)}
      >
        {/* Tier 1 — centered calligraphic wordmark */}
        <div className={styles.brandRow}>
          <Link href={localePath(locale, routes.home)} className={styles.wordmark}>
            <Wordmark className={styles.wordmarkImg} />
          </Link>
        </div>

        {/* Tier 2 — centered navigation */}
        <div className={styles.navRow}>
          <button
            ref={searchButtonRef}
            type="button"
            className={styles.search}
            onClick={() => setSearchOpen(true)}
            aria-expanded={searchOpen}
            aria-controls="search-overlay"
          >
            <span className={styles.searchIcon} aria-hidden="true" />
            <TypeBase variant="navItem" as="span">{dictionary.search}</TypeBase>
          </button>

          <nav className={styles.nav} aria-label={dictionary.nav.open}>
            {items
              .filter((item) => item.href !== localePath(locale, routes.contact))
              .map((item, i) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && item.href !== "/en" && pathname.startsWith(item.href));

              // The first item ("Подборка") owns the dropdown. The others
              // are plain links — a menu where every item expands would
              // be noisier than it is useful.
              const hasMenu = i === 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[styles.navLink, active ? styles.active : ""].filter(Boolean).join(" ")}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={hasMenu ? menuOpen : undefined}
                  onMouseEnter={hasMenu ? () => setMenuOpen(true) : undefined}
                  onFocus={hasMenu ? () => setMenuOpen(true) : undefined}
                >
                  <TypeBase variant="navItem" as="span">{item.label}</TypeBase>
                </Link>
              );
            })}
          </nav>

          <span className={styles.rightZone}>
          <span className={styles.actions}>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label={dictionary.nav.contact}
            >
              {/* Concierge/contact glyph — a chat bubble. */}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.actionIcon}>
                <path
                  d="M4 5.5h16v11H9l-4 3.5v-3.5H4v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <CartButton locale={locale} dictionary={dictionary} />
          </span>

          <span className={styles.locales}>
            <Link href={ruTarget} className={[styles.localeLink, locale === "ru" ? styles.localeActive : ""].filter(Boolean).join(" ")} aria-current={locale === "ru" ? "true" : undefined}>РУ</Link>
            <span className={styles.localeDivider} aria-hidden="true">/</span>
            <Link href={enTarget} className={[styles.localeLink, locale === "en" ? styles.localeActive : ""].filter(Boolean).join(" ")} aria-current={locale === "en" ? "true" : undefined}>EN</Link>
          </span>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            onClick={() => setIsOpen(true)}
            aria-label={dictionary.nav.open}
            aria-expanded={isOpen}
            aria-controls="nav-overlay"
            inert={isOpen || undefined}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
          </button>
          </span>
        </div>

        <CategoryMenu
          isOpen={menuOpen}
          locale={locale}
          dictionary={dictionary}
          onClose={() => setMenuOpen(false)}
        />

        {/* Tier 3 — thin announcement runner (no bordeaux double rule) */}
        <div className={styles.announce}>
          <button type="button" className={styles.announceArrow} aria-label="Previous">‹</button>
          <span className={styles.announceText}>
            <TypeBase variant="caption" as="span">{dictionary.announcement}</TypeBase>
          </span>
          <button type="button" className={styles.announceArrow} aria-label="Next">›</button>
        </div>
      </header>
      {variant === "solid" ? <div className={styles.spacer} aria-hidden="true" /> : null}

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        locale={locale}
        dictionary={dictionary}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        restoreFocusRef={searchButtonRef}
      />

      <NavOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        locale={locale}
        dictionary={dictionary}
        restoreFocusRef={menuButtonRef}
      />
    </>
  );
}
