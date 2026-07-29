/**
 * Bashir&Co — Collection records (prototype-phase local data).
 *
 * Collections reference pieces by slug; `/lib/collections.ts` resolves
 * them into the full `Collection` type before any component sees the
 * data (Production Architecture Plan Ch.14). Deliberately uneven in
 * size and cross-category in contents — a Collection is a narratively
 * coherent gathering, never a category bucket (Website Blueprint Ch.13).
 *
 * No category field exists on a Collection, structurally — only pieces
 * carry category.
 */

export interface CollectionRecord {
  slug: string;
  name: string;
  lightingTemperature: "warm" | "cool";
  atmosphere: string;
  pieceSlugs: string[];
}

export const collectionRecords: CollectionRecord[] = [
  {
    slug: "the-quiet-hour",
    name: "The Quiet Hour",
    lightingTemperature: "cool",
    atmosphere:
      "Objects made for precision no one asked them to prove — kept, wound, and worn past the point where proving mattered.",
    pieceSlugs: ["reference-1958", "the-meridian-stone", "one-of-one"],
  },
  {
    slug: "the-long-coat-season",
    name: "The Long Coat Season",
    lightingTemperature: "warm",
    atmosphere:
      "Material that improves under weather and years — cut, stitched, and burnished by hands that expected it to outlast them.",
    pieceSlugs: [
      "the-unlined-coat",
      "the-brogue-in-shell",
      "the-travel-fold",
    ],
  },
  {
    slug: "the-diplomats-room",
    name: "The Diplomat's Room",
    lightingTemperature: "warm",
    atmosphere:
      "Pieces commissioned to be discreet — made to close quietly, carry more than they show, and never look new.",
    pieceSlugs: [
      "the-diplomats-case",
      "the-observatory-chronometer",
      "the-cartography-brooch",
    ],
  },
];
