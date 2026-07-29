# /components/type

`Type.Base` — one component, fourteen variants via a `variant` prop.
See Component Library Ch.4. Do not create a second typography component
and do not add `TypeHeroHeadline.tsx`, `TypeBody.tsx`, etc.

## Usage

```tsx
import { TypeBase } from "@/components/type";

<TypeBase variant="heroHeadline" as="h1">
  Not everything is meant to be found.
</TypeBase>
```

`as` overrides the sensible per-variant default semantic element — see
`defaultSemanticElement` in `type.types.ts`. Only one `heroHeadline` (or
any other `as="h1"` instance) should exist per page.

## Files

- `TypeBase.tsx` — the component. Not a Client Component; see its own
  header comment for why.
- `TypeBase.module.css` — all fourteen variant classes, each referencing
  existing custom properties in `/tokens/tokens.css`. No hardcoded values.
- `type.types.ts` — the `TypeVariant` union, the props contract, and the
  variant → class / variant → default-element lookup tables.
- `index.ts` — barrel export.

## What's intentionally not here yet

No SplitType integration, no GSAP, no reveal animation. `data-split-ready`
and the forwarded ref exist so Phase 6 (Motion Foundation) can add both
without needing to refactor this component. See `TypeBase.tsx`'s own
header comment for the specifics future work should rely on.

## Dev preview

`/app/dev/type` renders every variant with sample copy — development-only,
not a public route.
