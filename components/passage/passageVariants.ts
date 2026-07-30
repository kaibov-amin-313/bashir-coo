import type { Category } from "@/types";
import type { PlaceholderKind } from "@/components/media";

/**
 * Bashir&Co — Passage category variant table.
 *
 * The single lookup implementing Component Library Ch.8's per-category
 * variants at placeholder fidelity: one set of Passage components, a
 * `category` prop, and this table — never seven near-duplicate component
 * sets (Production Architecture Plan Ch.5). Adding a category later
 * means adding one row here, not touching Passage.Wrapper.
 *
 * `macroKind`/`objectKind` select PlaceholderMedia treatments standing
 * in for the future real techniques (canvas for watches/jewelry,
 * scroll-scrubbed video for the rest — recorded on each Piece's
 * `mediaTechnique`, consumed for real in the motion-polish phase).
 */

interface PassageCategoryVariant {
  macroKind: PlaceholderKind;
  objectKind: PlaceholderKind;
}

export const passageVariants: Record<Category, PassageCategoryVariant> = {
  watches: { macroKind: "watchSurface", objectKind: "objectSilhouette" },
  fashion: { macroKind: "macroFabric", objectKind: "objectSilhouette" },
  footwear: { macroKind: "macroLeather", objectKind: "objectSilhouette" },
  bags: { macroKind: "macroMetal", objectKind: "objectSilhouette" },
  jewelry: { macroKind: "jewelryLight", objectKind: "objectSilhouette" },
  accessories: { macroKind: "macroTexture", objectKind: "objectSilhouette" },
  perfume: { macroKind: "lightSurface", objectKind: "objectSilhouette" },
};
