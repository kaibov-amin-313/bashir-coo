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

/**
 * Narrows an arbitrary string to a Category, or null if it isn't one.
 *
 * `as Category` on form input is a compile-time cast and nothing more —
 * at runtime any string reaches the database. That matters because the
 * category is used as a dictionary key and the result is dereferenced
 * (`categoryLabels[category].toUpperCase()`), so one bad value renders
 * the catalogue, the homepage showcase and the search overlay
 * uncrashable-in-theory but crashing-in-fact. This is the gate.
 */
export function parseCategory(value: string): Category | null {
  return (CATEGORIES as string[]).includes(value) ? (value as Category) : null;
}
