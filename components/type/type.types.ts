/**
 * Bashir&Co — Type.Base type definitions.
 *
 * Component Library Ch.4: one component, fourteen variants via a prop —
 * never fourteen separate components. This file holds the variant union,
 * the semantic-element union, the props contract, and the two lookup
 * tables Type.Base uses internally (variant → CSS Module class, variant →
 * sensible default semantic element).
 *
 * Naming note: the variant names below (`navItem`, `ctaText`) match the
 * Component Library's public naming. The underlying tokens from Phase 1–2
 * use shorter internal names (`nav`, `cta` — see `/tokens/typography.ts`
 * and the `--type-nav-*`/`--type-cta-*` custom properties in
 * `/tokens/tokens.css`). That mismatch is resolved entirely inside
 * `TypeBase.module.css`'s class definitions — the token files from Phase
 * 1–2 are not renamed or touched.
 */

export type TypeVariant =
  | "wordmark"
  | "heroHeadline"
  | "actTitle"
  | "sectionStatement"
  | "collectionTitle"
  | "objectTitle"
  | "provenance"
  | "body"
  | "caption"
  | "metadata"
  | "navItem"
  | "formLabel"
  | "ctaText"
  | "legal";

/**
 * Deliberately a fixed, small union rather than a fully generic
 * polymorphic-component type (`ElementType` + `ComponentPropsWithoutRef`
 * gymnastics) — this system only ever needs these six tags, and the
 * fixed union keeps the component simple to read and safe to extend
 * later if that ever changes.
 */
export type TypeSemanticElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export interface TypeBaseProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "id"> {
  /** Which of the fourteen typography tokens this text renders as. */
  variant: TypeVariant;
  /** Semantic element to render. Falls back to a sensible per-variant
   * default (see `defaultSemanticElement` below) if omitted. */
  as?: TypeSemanticElement;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Optional text-align override. Unset by default — Type.Base is a
   * typography primitive, not a layout component; alignment is normally
   * the parent composition's decision, not this component's. */
  align?: "left" | "center" | "right";
  /**
   * Marks this instance as a safe target for a future SplitType/GSAP line
   * reveal (Production Architecture Plan Ch.7, Phase 6). Purely a
   * structural marker in this phase — no splitting or animation happens
   * yet. Defaults to `true`; set `false` only for text that should never
   * be split (e.g. a single inline word inside a sentence).
   */
  splitReady?: boolean;
}

/**
 * Variant → CSS Module class name. A 1:1 map by design — if this ever
 * needs to be more than a lookup, that's a sign the component is
 * outgrowing "one implementation, a variant prop" and should be
 * reconsidered against Component Library Ch.1, not patched around here.
 */
export const variantClassMap: Record<TypeVariant, string> = {
  wordmark: "wordmark",
  heroHeadline: "heroHeadline",
  actTitle: "actTitle",
  sectionStatement: "sectionStatement",
  collectionTitle: "collectionTitle",
  objectTitle: "objectTitle",
  provenance: "provenance",
  body: "body",
  caption: "caption",
  metadata: "metadata",
  navItem: "navItem",
  formLabel: "formLabel",
  ctaText: "ctaText",
  legal: "legal",
};

/**
 * Sensible default semantic element per variant. Always overridable via
 * `as` — these are defaults, not constraints. `wordmark` deliberately
 * never defaults to `h1`: `heroHeadline` owns the page's one h1 wherever
 * both appear together (Threshold, Home Act I).
 *
 * `navItem`, `formLabel`, and `ctaText` default to `span` because the
 * interactive/semantic wrapper (`Nav.MenuItem`, a real `<label>` inside
 * `Form.Field`, `CTA.Base`'s `<button>`/`<a>`) is built in a later phase
 * and owns that responsibility — Type.Base only ever renders the text
 * styling inside it, never a competing interactive or label element.
 */
export const defaultSemanticElement: Record<TypeVariant, TypeSemanticElement> = {
  wordmark: "span",
  heroHeadline: "h1",
  actTitle: "h2",
  sectionStatement: "p",
  collectionTitle: "h2",
  objectTitle: "h3",
  provenance: "p",
  body: "p",
  caption: "p",
  metadata: "span",
  navItem: "span",
  formLabel: "span",
  ctaText: "span",
  legal: "p",
};
