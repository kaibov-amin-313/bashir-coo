import type { Piece } from "@/types";

/**
 * Bashir&Co — Piece records (prototype-phase local data).
 *
 * Shaped exactly per Production Architecture Plan Ch.14 so the future
 * CMS migration is a data-source swap in /lib, never a component
 * rebuild. Media URLs are `placeholder:` pseudo-paths — v1 components
 * render PlaceholderMedia by category, not by URL, so these fields
 * exist to keep the record shape honest, not to be fetched.
 *
 * Provenance register: specificity over superlatives, technical facts
 * woven into prose, never a spec list. Word ranges per category follow
 * the Component Library Ch.8 table. All example content, not final copy.
 *
 * No price, SKU, inventory, stock, or sale fields — their absence is
 * the architecture, not an omission.
 */

function placeholderMedia(slot: string, alt: string) {
  return {
    id: slot,
    url: `placeholder:${slot}`,
    alt,
    reducedMotionStillUrl: `placeholder:${slot}`,
  };
}

export const pieces: Piece[] = [
  // ---------------------------------------------------------------- //
  // The Quiet Hour — watches, jewelry, one rare object                 //
  // ---------------------------------------------------------------- //
  {
    slug: "reference-1958",
    title: "Reference 1958",
    category: "watches",
    provenance:
      "Recognized during a private estate visit outside Geneva, wound daily by the same hand for four decades. The 35mm steel case has never been polished; the archive extract confirms a February 1958 delivery, and the caseback wear agrees with it.",
    macroMedia: placeholderMedia(
      "reference-1958-macro",
      "Macro detail of a 1958 mechanical movement, single-source light"
    ),
    objectMedia: placeholderMedia(
      "reference-1958-object",
      "A 1958 steel wristwatch, held in shadow"
    ),
    mediaTechnique: "canvas",
  },
  {
    slug: "the-meridian-stone",
    title: "The Meridian Stone",
    category: "jewelry",
    provenance:
      "A 4.2-carat unheated sapphire, cut in the 1930s and never recut since — the old proportions kept deliberately, against three separate suggestions to modernize them. Set in its original platinum mount, the milgrain worn soft at the gallery where a glove passed over it for years. Documented through two auctions and one long silence.",
    macroMedia: placeholderMedia(
      "meridian-stone-macro",
      "Extreme close view of light inside an unheated sapphire"
    ),
    objectMedia: placeholderMedia(
      "meridian-stone-object",
      "A platinum-set sapphire ring at true scale"
    ),
    mediaTechnique: "canvas",
    accentColorRole: "singular",
  },

  // ---------------------------------------------------------------- //
  // The Long Coat Season — fashion, footwear, accessories             //
  // ---------------------------------------------------------------- //
  {
    slug: "the-unlined-coat",
    title: "The Unlined Coat",
    category: "fashion",
    provenance:
      "Cut from a single bolt of undyed double-face cashmere, finished entirely by hand because an unlined coat hides nothing. The maker produces eleven a year. This is the fourth of this year's eleven, and the only one in this weight.",
    macroMedia: placeholderMedia(
      "unlined-coat-macro",
      "Weave-level detail of double-face cashmere"
    ),
    objectMedia: placeholderMedia(
      "unlined-coat-object",
      "An unlined cashmere coat, in motion"
    ),
    mediaTechnique: "scrollScrubbedVideo",
  },
  {
    slug: "the-brogue-in-shell",
    title: "The Brogue in Shell",
    category: "footwear",
    provenance:
      "Shell cordovan from the last American tannery still finishing it the slow way — six months in the pits before a knife touches it. The brogueing is punched by hand, which is why no two perforations are perfectly alike, and why they will still be holding their shape when the pattern books have moved on twice.",
    macroMedia: placeholderMedia(
      "brogue-shell-macro",
      "Hand-punched brogueing in shell cordovan, raking light"
    ),
    objectMedia: placeholderMedia(
      "brogue-shell-object",
      "A shell cordovan brogue, grounded on stone"
    ),
    mediaTechnique: "scrollScrubbedVideo",
  },
  {
    slug: "the-travel-fold",
    title: "The Travel Fold",
    category: "accessories",
    provenance:
      "A bridle-leather document fold sized to one passport, one ticket, and nothing else — a discipline of smallness. The edges are burnished, not painted, and will darken where a thumb returns to them.",
    macroMedia: placeholderMedia(
      "travel-fold-macro",
      "Burnished bridle-leather edge, close view"
    ),
    objectMedia: placeholderMedia(
      "travel-fold-object",
      "A small leather document fold, held close"
    ),
    mediaTechnique: "scrollScrubbedVideo",
  },

  // ---------------------------------------------------------------- //
  // The Diplomat's Room — bags, watches, jewelry                       //
  // ---------------------------------------------------------------- //
  {
    slug: "the-diplomats-case",
    title: "The Diplomat's Case",
    category: "bags",
    provenance:
      "Commissioned in 1971 for a diplomat who specified two things: that it should open silently, and that it should never look new. The brass was chemically aged before assembly, and the lock still closes with the original quiet click it was ordered for.",
    macroMedia: placeholderMedia(
      "diplomats-case-macro",
      "Aged brass closure mechanism at the moment of engagement"
    ),
    objectMedia: placeholderMedia(
      "diplomats-case-object",
      "A 1971 leather case with aged brass hardware"
    ),
    mediaTechnique: "scrollScrubbedVideo",
  },
  {
    slug: "the-observatory-chronometer",
    title: "The Observatory Chronometer",
    category: "watches",
    provenance:
      "Regulated for an observatory trial it never entered — the paperwork was filed, the movement was finished, and the entry was withdrawn for reasons the archive does not record. What remains is a movement finished beyond any commercial requirement, for an audience of no one.",
    macroMedia: placeholderMedia(
      "observatory-chronometer-macro",
      "Observatory-grade movement finishing under magnification"
    ),
    objectMedia: placeholderMedia(
      "observatory-chronometer-object",
      "A chronometer prepared for a trial it never entered"
    ),
    mediaTechnique: "canvas",
  },
  {
    slug: "the-cartography-brooch",
    title: "The Cartography Brooch",
    category: "jewelry",
    provenance:
      "A mid-century gold brooch engraved with a coastline that does not quite match any modern map — the maker worked from a chart that was already fifty years out of date, and the house has left the discrepancy exactly as found.",
    macroMedia: placeholderMedia(
      "cartography-brooch-macro",
      "Engraved coastline detail on a mid-century brooch"
    ),
    objectMedia: placeholderMedia(
      "cartography-brooch-object",
      "A gold brooch engraved with an outdated coastline"
    ),
    mediaTechnique: "canvas",
  },
];
