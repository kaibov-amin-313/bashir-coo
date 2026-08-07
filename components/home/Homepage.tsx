"use client";

import type { ReactNode } from "react";
import { NavConciergeThread } from "@/components/nav";
import { SkipLink } from "@/components/a11y";
import { SiteHeader } from "@/components/header";
import { FooterRoot } from "@/components/footer";
import { Preloader } from "@/components/preloader/Preloader";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./Homepage.module.css";

/**
 * Bashir&Co — Homepage (Quiet Luxury direction).
 *
 * Opens directly on the warm hero — the dark Threshold film and the
 * six-Act composition are the paused earlier direction: their
 * components remain in the codebase (and on /dev/threshold) but are no
 * longer mounted here. A commercial, deadline-driven site earns trust
 * by being immediately clear, not by an eight-second dark overture.
 *
 * Nav is always visible (no Act-gated hiding), the concierge thread is
 * always present, Lenis provides quiet smooth scroll except under
 * reduced motion.
 */

interface HomepageProps {
  locale: Locale;
  dictionary: Dictionary;
  /**
   * The homepage's main content, rendered on the server and passed in as
   * children. Keeping it a child (rather than importing HomeSections
   * here) is what lets this Client Component provide smooth scroll and
   * reduced-motion handling without forcing the entire content tree
   * across the client boundary — a Client Component can render
   * Server-Component children, but only when it receives them as props.
   */
  children: ReactNode;
}

export function Homepage({ locale, dictionary, children }: HomepageProps) {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);

  return (
    <div className={styles.homeRoot}>
      <Preloader />
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} dictionary={dictionary} variant="overlay" />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      {/* The document element is `lang="ru"` (a single root layout can't
          vary it per route), so English routes mark their content here —
          the same thing CollectionViews and PageViews already do. Without
          it a screen reader reads the English homepage with Russian
          pronunciation rules. */}
      <main id="content" lang={locale === "en" ? "en" : undefined}>{children}</main>
      <FooterRoot locale={locale} dictionary={dictionary} />
    </div>
  );
}
