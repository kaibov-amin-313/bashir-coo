"use client";

import Link from "next/link";
import styles from "./NavConciergeThread.module.css";
import { TypeBase } from "@/components/type";
import { routes } from "@/config/routes";
import { localePath } from "@/lib/i18n";
import type { NavConciergeThreadProps } from "./nav.types";

/**
 * Bashir&Co — Nav.ConciergeThread, localized.
 *
 * Carried a `warmed` prop "for future session state" that nothing ever
 * set and no caller passed; it and its stylesheet rule are gone rather
 * than left as a decoy for whoever reads this next.
 */
export function NavConciergeThread({
  locale,
  dictionary,
  className,
}: NavConciergeThreadProps) {
  return (
    <Link
      href={localePath(locale, routes.contact)}
      aria-label={dictionary.nav.conciergeAria}
      className={[styles.thread, className]
        .filter(Boolean)
        .join(" ")}
    >
      <TypeBase variant="navItem" as="span">
        {dictionary.nav.concierge}
      </TypeBase>
    </Link>
  );
}
