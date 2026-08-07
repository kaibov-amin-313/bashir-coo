/**
 * Bashir&Co — Route definitions.
 *
 * Matches Production Architecture Plan Ch.4 exactly. Deliberately absent:
 * /products, /category, /shop, /cart, /wishlist, /checkout — there is no
 * standalone product page or category-index route anywhere in this
 * system. A specific piece is addressed via a query parameter on its
 * parent Collection route (see `collectionDetail` + the `piece` param
 * convention below), never its own routed page.
 */

export const routes = {
  home: "/",
  collection: "/collection",
  collectionDetail: (collectionSlug: string) => `/collection/${collectionSlug}`,
  /**
   * A single piece's own page. Kept off /collection/… deliberately: that
   * segment already resolves curated collection slugs, and one dynamic
   * segment serving two kinds of thing would make every lookup guess
   * which it was holding.
   */
  piece: (slug: string) => `/piece/${slug}`,
  privateSourcing: "/private-sourcing",
  specialPiecesByRequest: "/special-pieces-by-request",
  about: "/about",
  contact: "/contact",
} as const;

/**
 * Query parameter name used for direct object linking within a Collection
 * route — e.g. `/collection/the-atelier-collection?piece=reference-1958`.
 * See Production Architecture Plan Ch.4 for the full reasoning.
 */
export const PIECE_QUERY_PARAM = "piece" as const;
