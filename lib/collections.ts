import type { Collection, Piece } from "@/types";
import { collectionRecords } from "@/data/collections";
import { pieces } from "@/data/pieces";
import { pieceText, collectionText, type Locale } from "@/lib/i18n";

/**
 * Bashir&Co — Collections data access, locale-aware.
 *
 * The only place raw data records are resolved into the typed shapes
 * components consume. Structure comes from /data (the CMS-shaped source
 * of truth); localized text (titles, provenance, names, atmosphere)
 * comes from /lib/i18n and is merged here, so components receive
 * fully-localized objects and never touch translation tables directly.
 * When a CMS arrives, these functions change internally; nothing above
 * them does.
 *
 * Still deliberately absent, enforced at this layer: sort, filter, and
 * search parameters of any kind.
 */

function localizePiece(piece: Piece, locale: Locale): Piece {
  const text = pieceText[piece.slug]?.[locale];
  if (!text) return piece;
  return { ...piece, title: text.title, provenance: text.provenance };
}

export function getAllCollections(locale: Locale = "ru"): Collection[] {
  return collectionRecords.map((record) => {
    const text = collectionText[record.slug]?.[locale];
    return {
      slug: record.slug,
      name: text?.name ?? record.name,
      lightingTemperature: record.lightingTemperature,
      atmosphere: text?.atmosphere ?? record.atmosphere,
      pieces: record.pieceSlugs
        .map((slug) => pieces.find((p) => p.slug === slug))
        .filter((piece): piece is Piece => piece !== undefined)
        .map((piece) => localizePiece(piece, locale)),
    };
  });
}

export function getCollectionBySlug(
  slug: string,
  locale: Locale = "ru"
): Collection | null {
  return getAllCollections(locale).find((c) => c.slug === slug) ?? null;
}

/** A small localized selection for the homepage's Selected Pieces. */
export function getSelectedPieces(locale: Locale = "ru"): Piece[] {
  return ["reference-1958", "the-unlined-coat", "the-meridian-stone"]
    .map((slug) => pieces.find((p) => p.slug === slug))
    .filter((piece): piece is Piece => piece !== undefined)
    .map((piece) => localizePiece(piece, locale));
}

/** Which collection a piece belongs to — for homepage deep links. */
export function getCollectionSlugForPiece(pieceSlug: string): string | null {
  return (
    collectionRecords.find((r) => r.pieceSlugs.includes(pieceSlug))?.slug ??
    null
  );
}
