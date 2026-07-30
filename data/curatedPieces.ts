import type { Category } from "@/types";
import type { PlaceholderKind } from "@/components/media";
import type { Locale } from "@/lib/i18n";

/**
 * Bashir&Co — Curated pieces (client's real inventory).
 *
 * Twelve verified pieces supplied by the client, two per category.
 * Titles carry the maker's name, as a resale house properly states what
 * a piece actually is.
 *
 * Descriptions are deliberately absent: inventing condition/provenance
 * claims for real luxury goods would be dishonest and commercially
 * risky. Add them here only when the client supplies real copy.
 *
 * Price is always a label ("Цена по запросу"), never a number. No SKU,
 * no stock, no cart.
 */

interface LocalizedText {
  ru: string;
  en: string;
}

/** Who a piece is for. Some things (a watch, a belt) genuinely suit
 *  either, so "unisex" is a real answer rather than a cop-out. */
export type Gender = "men" | "women" | "unisex";

export interface CuratedPiece {
  slug: string;
  category: Category;
  /** Id from data/subcategories.ts, or null if the piece isn't in one. */
  subcategory: string | null;
  brand: string;
  gender: Gender;
  title: LocalizedText;
  status: LocalizedText;
  /** Display wording used when there is no numeric price. */
  priceLabel: LocalizedText;
  /**
   * Numeric price in USD — the single source of truth for anything that
   * has to add up. `null` means the piece is quoted personally, which is
   * the honest default for this file: these are real references whose
   * prices belong to the house, not invented figures. Set the real ones
   * through the admin.
   */
  priceUsd: number | null;
  visualVariant: PlaceholderKind;
  image: string;
  inquirySubject: LocalizedText;
}

const STATUS: LocalizedText = { ru: "По запросу", en: "Available by request" };
const PRICE: LocalizedText = { ru: "Цена по запросу", en: "Price on request" };

function piece(
  slug: string,
  category: Category,
  subcategory: string | null,
  brand: string,
  gender: Gender,
  ru: string,
  en: string,
  visualVariant: PlaceholderKind,
  priceUsd: number | null = null
): CuratedPiece {
  return {
    slug,
    category,
    subcategory,
    brand,
    gender,
    title: { ru, en },
    status: STATUS,
    priceLabel: PRICE,
    priceUsd,
    visualVariant,
    image: `/images/products/${slug}.jpg`,
    inquirySubject: { ru: `Запрос: ${ru}`, en: `Inquiry: ${en}` },
  };
}

export const curatedPieces: CuratedPiece[] = [
  // ---------------------------------- часы --------------------------------- //
  piece(
    "richard-mille-rm030-rose-gold",
    "watches",
    "sports",
    "Richard Mille",
    "men",
    "Richard Mille RM 030 Rose Gold, 43 мм",
    "Richard Mille RM 030 Rose Gold, 43 mm",
    "watchSurface"
  ),
  piece(
    "patek-philippe-nautilus-3800",
    "watches",
    "sports",
    "Patek Philippe",
    "unisex",
    "Patek Philippe Nautilus 3800/1AJ, 37 мм",
    "Patek Philippe Nautilus 3800/1AJ, 37 mm",
    "watchSurface"
  ),

  // --------------------------------- одежда -------------------------------- //
  piece(
    "loro-piana-daito-shirt-jacket",
    "fashion",
    "outerwear",
    "Loro Piana",
    "men",
    "Loro Piana, куртка-рубашка Daito",
    "Loro Piana Daito Shirt Jacket",
    "macroFabric"
  ),
  piece(
    "stefano-ricci-windbreaker",
    "fashion",
    "outerwear",
    "Stefano Ricci",
    "men",
    "Stefano Ricci, ветровка на кнопках",
    "Stefano Ricci Press-Stud Windbreaker",
    "macroFabric"
  ),

  // ---------------------------------- обувь -------------------------------- //
  piece(
    "loro-piana-babouche-walk-mules",
    "footwear",
    "mules",
    "Loro Piana",
    "men",
    "Loro Piana, мюли Babouche Walk",
    "Loro Piana Babouche Walk Mules",
    "macroLeather"
  ),
  piece(
    "zegna-triple-stitch-sneakers",
    "footwear",
    "sneakers",
    "Zegna",
    "men",
    "Zegna, кеды Triple Stitch",
    "Zegna Triple Stitch Sneakers",
    "macroLeather"
  ),

  // ---------------------------------- сумки -------------------------------- //
  piece(
    "hermes-birkin-30-veau-evergrain",
    "bags",
    "handbags",
    "Hermès",
    "women",
    "Hermès, сумка Birkin 30 Veau Evergrain (2010)",
    "Hermès Birkin 30 Veau Evergrain (2010)",
    "macroLeather"
  ),
  piece(
    "louis-vuitton-nm-tuileries-monogram",
    "bags",
    "handbags",
    "Louis Vuitton",
    "women",
    "Louis Vuitton, сумка NM Tuileries Monogram (2021)",
    "Louis Vuitton NM Tuileries Monogram (2021)",
    "macroLeather"
  ),

  // ------------------------------- украшения ------------------------------- //
  piece(
    "cartier-panthere-diamond-emerald-ring",
    "jewelry",
    "rings",
    "Cartier",
    "women",
    "Cartier, кольцо Panthère с бриллиантами и изумрудами",
    "Cartier Panthère Diamond and Emerald Ring",
    "jewelryLight"
  ),
  piece(
    "van-cleef-magic-alhambra-malachite",
    "jewelry",
    "rings",
    "Van Cleef & Arpels",
    "women",
    "Van Cleef & Arpels, кольцо Magic Alhambra с малахитом",
    "Van Cleef & Arpels Magic Alhambra Malachite Ring",
    "jewelryLight"
  ),

  // ------------------------------ аксессуары ------------------------------- //
  piece(
    "tom-ford-bronson-sunglasses",
    "accessories",
    "eyewear",
    "Tom Ford",
    "unisex",
    "Tom Ford, очки Bronson в черепаховой оправе",
    "Tom Ford Bronson Sunglasses, Tortoiseshell",
    "macroTexture"
  ),
  piece(
    "brioni-leather-belt",
    "accessories",
    "belts",
    "Brioni",
    "men",
    "Brioni, кожаный ремень",
    "Brioni Leather Belt",
    "macroLeather"
  ),
];

/** A curated piece flattened to one locale — what components consume. */
export interface LocalizedCuratedPiece {
  slug: string;
  category: Category;
  subcategory: string | null;
  brand: string;
  gender: Gender;
  title: string;
  status: string;
  priceLabel: string;
  priceUsd: number | null;
  visualVariant: PlaceholderKind;
  image: string;
  inquirySubject: string;
}

export function getCuratedPieces(locale: Locale): LocalizedCuratedPiece[] {
  return curatedPieces.map((p) => ({
    slug: p.slug,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    gender: p.gender,
    title: p.title[locale],
    status: p.status[locale],
    priceLabel: p.priceLabel[locale],
    priceUsd: p.priceUsd,
    visualVariant: p.visualVariant,
    image: p.image,
    inquirySubject: p.inquirySubject[locale],
  }));
}

export function getCuratedPieceBySlug(
  slug: string,
  locale: Locale
): LocalizedCuratedPiece | null {
  return getCuratedPieces(locale).find((p) => p.slug === slug) ?? null;
}
