import { forwardRef } from "react";
import styles from "./TypeBase.module.css";
import {
  defaultSemanticElement,
  variantClassMap,
  type TypeBaseProps,
} from "./type.types";

/**
 * Bashir&Co — Type.Base.
 *
 * One component, fourteen variants (Component Library Ch.4). Do not
 * create a second typography component, and do not add a fifteenth
 * variant here without first adding it to the Design System's typography
 * table and to `/tokens/typography.ts` / `tokens.css` — this component
 * only ever maps to values that already exist there.
 *
 * Deliberately NOT a Client Component. Nothing here reads state, runs an
 * effect, or attaches an event listener — keeping it a Server Component
 * means it costs zero client JS and can be used from inside either a
 * Server or a Client Component without forcing a boundary. That will
 * remain true even once Phase 6 adds SplitType/GSAP: the *animation* that
 * targets this markup lives in a wrapping Client Component, not inside
 * Type.Base itself.
 *
 * SplitType readiness (Phase 6, not implemented here):
 * - The forwarded ref gives future code a direct DOM node to hand to
 *   `useGSAP`'s `scope` or to `new SplitType(node)`, without needing to
 *   refactor this component later to add ref support.
 * - `data-type-variant` lets future code reliably query
 *   `[data-type-variant="heroHeadline"]` if it ever needs to target a
 *   variant generically rather than via the ref.
 * - `data-split-ready` marks whether this instance is a safe splitting
 *   target. It is a marker only — no splitting happens yet.
 * - Markup is a single element with only text children by convention
 *   (see the dev preview route) — no nested inline elements are
 *   introduced here that would break a future line-level split. Callers
 *   are responsible for keeping children as plain text or simple inline
 *   text for variants that will later be split.
 * - No character-level splitting is supported or anticipated anywhere in
 *   this system (Visual Direction Book Ch.5; Motion Bible Ch.6) — do not
 *   add per-character markup or props here.
 */
export const TypeBase = forwardRef<HTMLElement, TypeBaseProps>(
  (
    {
      variant,
      as,
      children,
      className,
      id,
      align,
      splitReady = true,
      ...rest
    },
    ref
  ) => {
    const Component = as ?? defaultSemanticElement[variant];
    const variantClass = styles[variantClassMap[variant]];
    const alignClass =
      align === "left"
        ? styles.alignLeft
        : align === "center"
          ? styles.alignCenter
          : align === "right"
            ? styles.alignRight
            : undefined;

    const classNames = [styles.base, variantClass, alignClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        // TypeScript cannot statically verify a ref against a dynamically
        // union-typed tag (`Component` is one of six possible intrinsic
        // elements at runtime) — every one of them genuinely extends
        // HTMLElement, which is exactly what this component's own ref type
        // promises callers. This narrow cast is the documented, standard
        // escape for that specific, well-known limitation; it is not a
        // blanket suppression. Do not "fix" this by disabling strict mode
        // or by building a full generic polymorphic-component type here —
        // both are more complexity than this component needs.
        ref={ref as React.Ref<HTMLHeadingElement>}
        id={id}
        className={classNames}
        data-type-variant={variant}
        data-split-ready={splitReady}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

TypeBase.displayName = "Type.Base";
