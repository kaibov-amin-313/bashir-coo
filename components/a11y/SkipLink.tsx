import type { Locale } from "@/lib/i18n";

/**
 * Bashir&Co — skip link.
 *
 * First element in the tab order, hidden until focused. The header runs
 * three tiers deep — wordmark, navigation, concierge thread — plus
 * search, cart and locale controls, so without this a keyboard user
 * traverses the entire apparatus again on every page before reaching the
 * content.
 *
 * It lives beside each `<main>` rather than in the root layout because
 * the label has to be localized, and the root layout has no locale: it
 * renders both the Russian tree and the English one.
 */
export function SkipLink({ locale }: { locale: Locale }) {
  return (
    <a href="#content" className="skipLink">
      {locale === "en" ? "Skip to content" : "Перейти к содержимому"}
    </a>
  );
}
