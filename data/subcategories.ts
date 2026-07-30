import type { Category } from "@/types";

/**
 * Bashir&Co — subcategories.
 *
 * Each category owns its own list: "верхняя одежда" means nothing under
 * Watches, so a single flat list shared across categories would be wrong
 * by construction. The filter panel shows a category's subcategories only
 * when that category is expanded.
 *
 * ─────────────────────────────────────────────────────────────────────
 * THESE ARE PLACEHOLDERS — replace them with the real lists.
 *
 * The `id` is what gets stored on a piece; keep it lowercase-latin, and
 * don't rename it once pieces are using it, or those pieces silently fall
 * out of their own filter. The ru/en labels are what a visitor reads and
 * can be reworded freely at any time.
 * ─────────────────────────────────────────────────────────────────────
 */

export interface Subcategory {
  /** Stable key stored on the piece. Do not rename after pieces use it. */
  id: string;
  ru: string;
  en: string;
}

export const SUBCATEGORIES: Record<Category, Subcategory[]> = {
  watches: [
    { id: "sports", ru: "Спортивные", en: "Sports" },
    { id: "dress", ru: "Классические", en: "Dress" },
    { id: "complications", ru: "С усложнениями", en: "Complications" },
  ],

  fashion: [
    { id: "outerwear", ru: "Верхняя одежда", en: "Outerwear" },
    { id: "knitwear", ru: "Трикотаж", en: "Knitwear" },
    { id: "jackets", ru: "Пиджаки", en: "Jackets" },
    { id: "shirts", ru: "Рубашки", en: "Shirts" },
    { id: "trousers", ru: "Брюки", en: "Trousers" },
  ],

  footwear: [
    { id: "sneakers", ru: "Кроссовки", en: "Sneakers" },
    { id: "loafers", ru: "Лоферы", en: "Loafers" },
    { id: "boots", ru: "Ботинки", en: "Boots" },
    { id: "mules", ru: "Мюли", en: "Mules" },
  ],

  bags: [
    { id: "handbags", ru: "Сумки", en: "Handbags" },
    { id: "totes", ru: "Тоуты", en: "Totes" },
    { id: "cases", ru: "Кейсы", en: "Cases" },
    { id: "travel", ru: "Дорожные", en: "Travel" },
  ],

  jewelry: [
    { id: "rings", ru: "Кольца", en: "Rings" },
    { id: "necklaces", ru: "Колье", en: "Necklaces" },
    { id: "bracelets", ru: "Браслеты", en: "Bracelets" },
    { id: "earrings", ru: "Серьги", en: "Earrings" },
  ],

  accessories: [
    { id: "eyewear", ru: "Очки", en: "Eyewear" },
    { id: "belts", ru: "Ремни", en: "Belts" },
    { id: "small-leather", ru: "Малая кожгалантерея", en: "Small Leather Goods" },
    { id: "scarves", ru: "Шарфы и платки", en: "Scarves" },
  ],

  perfume: [
    { id: "eau-de-parfum", ru: "Eau de Parfum", en: "Eau de Parfum" },
    { id: "extrait", ru: "Extrait de Parfum", en: "Extrait de Parfum" },
    { id: "niche", ru: "Нишевая парфюмерия", en: "Niche Fragrances" },
    { id: "discontinued", ru: "Снятые с производства", en: "Discontinued" },
  ],
};

/** The subcategories belonging to one category. */
export function subcategoriesFor(category: Category): Subcategory[] {
  return SUBCATEGORIES[category] ?? [];
}

/**
 * A subcategory's label in one locale. Falls back to the raw id, so a
 * piece still carrying a since-removed subcategory renders as something
 * rather than an empty gap.
 */
export function subcategoryLabel(id: string, locale: "ru" | "en"): string {
  for (const list of Object.values(SUBCATEGORIES)) {
    const found = list.find((s) => s.id === id);
    if (found) return found[locale];
  }
  return id;
}
