import type { Category } from "@/types";

/**
 * Bashir&Co — Category values, as a runtime array.
 *
 * The `Category` type (in `/types`) is a compile-time-only union — this
 * array exists so anything needing to iterate over all seven categories
 * at runtime (e.g. a future `Passage.MacroMedia` lookup table) has a
 * single, correct source rather than each consumer re-typing the list.
 *
 * This is data, not navigation — it never becomes a category menu, filter,
 * or index page (Production Architecture Plan Ch.9's data-fetching rule).
 */
export const CATEGORIES: Category[] = [
  "watches",
  "fashion",
  "footwear",
  "bags",
  "jewelry",
  "accessories",
  "perfume",
];
