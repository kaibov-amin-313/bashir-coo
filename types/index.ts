/**
 * Bashir&Co — Core data types.
 *
 * Matches the Production Architecture Plan Ch.14 data model exactly.
 * Deliberately excluded from every interface below, per that same
 * chapter: price, SKU, inventory count, cart quantity. Their absence is
 * the point, not an oversight — do not add them "for completeness."
 */

/**
 * The ONLY place "category" exists as data anywhere in this system.
 * Never becomes its own top-level entity/table — see Collection below,
 * which deliberately has no category field of its own (Production
 * Architecture Plan Ch.9, Ch.14).
 */
export type Category =
  | "watches"
  | "fashion"
  | "footwear"
  | "bags"
  | "jewelry"
  | "accessories";

export interface MediaAsset {
  id: string;
  url: string;
  /** Mandatory, never optional — Production Architecture Plan Ch.16. */
  alt: string;
  /** Mandatory — every scrubbed/canvas sequence needs a reduced-motion
   * and loading-placeholder still (Motion Bible Ch.12). */
  reducedMotionStillUrl: string;
}

export interface Piece {
  slug: string;
  title: string;
  category: Category;
  /**
   * Technical facts (materials, dimensions) are woven directly into this
   * prose field — there is no separate spec-table structure anywhere in
   * this system (Production Architecture Plan Ch.10).
   */
  provenance: string;
  macroMedia: MediaAsset;
  objectMedia: MediaAsset;
  /**
   * Relevant chiefly for `rareCollectible`, which decides per piece
   * (Motion Bible Ch.7; Component Library Ch.8's category variant table).
   * Optional for every other category, whose technique is fixed by
   * category alone.
   */
  mediaTechnique?: "canvas" | "scrollScrubbedVideo";
  /**
   * Placeholder-era only: marks the one piece per context permitted the
   * singular color arrival (Homepage Film Script — The Singular Color
   * Object). Stands in for product-originated color, which will come
   * from real photography once it exists — this field is expected to be
   * retired at the content-replacement phase, not carried into the CMS.
   */
  accentColorRole?: "singular";
}

export interface Collection {
  slug: string;
  name: string;
  /** Informs Collection.Preview's per-instance color grading — Design
   * System Ch.9's warm/cool distinction, not a fixed token. */
  lightingTemperature: "warm" | "cool";
  /** One short atmospheric line for the Collection's opening frame —
   * a Provenance-register sentence, never a marketing tagline. */
  atmosphere?: string;
  /**
   * Resolved piece objects. The underlying data source (local files now,
   * a CMS later) may store these as references/IDs — the data-fetching
   * layer resolves them before this type is used by any component.
   */
  pieces: Piece[];
}

export interface InquiryPayload {
  name: string;
  contactMethod: string;
  message: string;
  /** Free text only — never a category/piece selector dropdown, per
   * Form.ObjectReference's spec (Design System Ch.8). */
  objectReference?: string;
}

export interface VisitorState {
  visitorState: "first-time" | "returning";
  recognitionGestureCompleted: boolean;
  directedArrival: boolean;
}
