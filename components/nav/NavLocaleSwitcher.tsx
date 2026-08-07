"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./NavLocaleSwitcher.module.css";
import { TypeBase } from "@/components/type";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Bashir&Co — language switcher. A quiet fixed text control, top-right:
 * shows the OTHER locale's short label and links to the same page in
 * that locale (path-mapped — `/en` prefix added or stripped), so a
 * visitor never loses their place when switching.
 */

interface NavLocaleSwitcherProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function NavLocaleSwitcher({
  locale,
  dictionary,
}: NavLocaleSwitcherProps) {
  const pathname = usePathname() ?? "/";
  // The query string carries the catalogue's active category, so dropping
  // it meant switching language silently cleared the visitor's filter and
  // dumped them back into the full catalogue.
  const searchParams = useSearchParams();

  const basePath =
    locale === "ru"
      ? pathname === "/"
        ? "/en"
        : `/en${pathname}`
      : pathname === "/en"
        ? "/"
        : pathname.replace(/^\/en/, "") || "/";

  const query = searchParams?.toString() ?? "";
  const target = query ? `${basePath}?${query}` : basePath;

  return (
    <Link
      href={target}
      className={styles.switcher}
      aria-label={dictionary.nav.switchLocaleAria}
    >
      <TypeBase variant="navItem" as="span">
        {dictionary.nav.switchLocale}
      </TypeBase>
    </Link>
  );
}
