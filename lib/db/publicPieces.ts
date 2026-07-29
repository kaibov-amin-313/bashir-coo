import { getPieces } from "./pieces";
import type { LocalizedCuratedPiece } from "@/data/curatedPieces";
import type { Locale } from "@/lib/i18n";

/**
 * Bashir&Co — the public site's read path for pieces.
 *
 * Maps database records into the exact shape the site's components
 * already consume (LocalizedCuratedPiece), so switching the source from
 * a file to Postgres required no changes to the catalogue, the search,
 * or the homepage — they keep asking for the same object.
 *
 * `getPieces()` already falls back to the file-based set if the database
 * is unreachable, so this never throws and never returns empty because
 * of infrastructure.
 */
export async function getPublicPieces(
  locale: Locale
): Promise<LocalizedCuratedPiece[]> {
  const records = await getPieces();

  return records.map((r) => {
    const title = locale === "ru" ? r.titleRu : r.titleEn;
    const price = locale === "ru" ? r.priceRu : r.priceEn;

    return {
      slug: r.slug,
      category: r.category,
      subcategory: r.subcategory,
      brand: r.brand,
      gender: r.gender,
      title,
      status: locale === "ru" ? "По запросу" : "Available by request",
      priceLabel: price,
      visualVariant: r.visualVariant,
      image: r.image,
      inquirySubject:
        locale === "ru" ? `Запрос: ${title}` : `Inquiry: ${title}`,
    };
  });
}

export async function getPublicPieceBySlug(
  slug: string,
  locale: Locale
): Promise<LocalizedCuratedPiece | null> {
  const all = await getPublicPieces(locale);
  return all.find((p) => p.slug === slug) ?? null;
}
