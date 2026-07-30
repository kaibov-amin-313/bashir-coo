import type { Locale } from "@/lib/i18n";

/**
 * Bashir&Co — price formatting.
 *
 * Prices are held in USD as a single numeric source of truth. The house
 * quotes in dollars; conversion to the payment currency (KZT, for
 * FreedomPay) happens at checkout against the rate of the day, so no
 * converted figure is ever stored — a stored KZT price would silently go
 * stale and quote the client a number the payment step then contradicts.
 *
 * A piece may legitimately have no price: one-off commissions and pieces
 * still being sourced are quoted personally. `null` is that state, and it
 * renders as the house's "on request" wording rather than "$0" or a gap.
 */

/** The canonical trading currency for every piece. */
export const PRICE_CURRENCY = "USD";

/**
 * Formats a USD amount for display, e.g. 1250 → "$1,250".
 *
 * Whole dollars only: luxury pieces are not priced to the cent, and
 * trailing ".00" reads like a supermarket shelf. Falls back to the
 * localized "on request" wording when there is no price.
 */
export function formatUsd(
  amount: number | null | undefined,
  locale: Locale
): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return priceOnRequestLabel(locale);
  }

  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: PRICE_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** The house's wording for a piece quoted personally rather than listed. */
export function priceOnRequestLabel(locale: Locale): string {
  return locale === "ru" ? "Цена по запросу" : "Price on request";
}

/**
 * Sums a set of priced lines. Returns `null` when nothing in the set
 * carries a price, so a cart of on-request pieces shows "on request"
 * rather than a misleading "$0" total.
 */
export function sumUsd(
  lines: { priceUsd: number | null; qty: number }[]
): number | null {
  const priced = lines.filter(
    (l) => typeof l.priceUsd === "number" && Number.isFinite(l.priceUsd)
  );
  if (priced.length === 0) return null;
  return priced.reduce((total, l) => total + (l.priceUsd as number) * l.qty, 0);
}

/**
 * Parses a price typed into the admin form. Accepts "1250", "1 250",
 * "1,250", "$1250" and returns whole dollars; anything unparseable (or
 * an empty field) becomes `null` — meaning "quoted on request", not zero.
 */
export function parseUsdInput(raw: string): number | null {
  const trimmed = raw.trim();
  // Reject negatives outright. Stripping punctuation first would turn
  // "-50" into "50" and silently save a price the admin never typed.
  if (trimmed.startsWith("-")) return null;

  const cleaned = trimmed.replace(/[^\d.]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}
