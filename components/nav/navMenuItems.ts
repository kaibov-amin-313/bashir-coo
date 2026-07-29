import { routes } from "@/config/routes";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { NavMenuItemData } from "./nav.types";

/**
 * Exactly four items, localized. Hrefs come from /config/routes via
 * localePath; labels from the dictionary.
 */
export function getNavMenuItems(
  locale: Locale,
  dictionary: Dictionary
): NavMenuItemData[] {
  return [
    { label: dictionary.nav.collection, href: localePath(locale, routes.collection) },
    { label: dictionary.nav.privateSourcing, href: localePath(locale, routes.privateSourcing) },
    { label: dictionary.nav.about, href: localePath(locale, routes.about) },
    { label: dictionary.nav.contact, href: localePath(locale, routes.contact) },
  ];
}
