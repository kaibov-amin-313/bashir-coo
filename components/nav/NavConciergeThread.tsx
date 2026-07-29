"use client";

import Link from "next/link";
import styles from "./NavConciergeThread.module.css";
import { TypeBase } from "@/components/type";
import { routes } from "@/config/routes";
import { localePath } from "@/lib/i18n";
import type { NavConciergeThreadProps } from "./nav.types";

/**
 * Bashir&Co — Nav.ConciergeThread, localized. Standalone as before;
 * `warmed` remains for future session state.
 */
export function NavConciergeThread({
  locale,
  dictionary,
  warmed = false,
  className,
}: NavConciergeThreadProps) {
  return (
    <Link
      href={localePath(locale, routes.contact)}
      aria-label={dictionary.nav.conciergeAria}
      className={[styles.thread, warmed ? styles.warmed : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <TypeBase variant="navItem" as="span">
        {dictionary.nav.concierge}
      </TypeBase>
    </Link>
  );
}
