# Bashir&Co

A private luxury sourcing house for rare watches, luxury fashion, premium
footwear, bags, jewelry, accessories, rare collectible objects, and
special pieces by request. The website is a cinematic private exhibition,
not an ecommerce store. Organized around **Collections, not Categories**.
The Signature: **recognition before search.**

## Status

Phase 1–2 complete (Project Setup; Tokens and Base Styles), per the
Production Architecture Plan's build order. No UI components, no
navigation, no Threshold, no homepage film, no forms, and no Recognition
Gesture exist yet — see "What was intentionally not built yet" below.

## This project follows ten prior documents as law

1. Creative Manifesto
2. Psychology of Awe
3. Visual Direction Book
4. Website Blueprint
5. Motion Bible
6. Design System
7. Homepage Film Script
8. Component Library Specification
9. Production Architecture Plan *(the primary technical source of truth)*

Nothing in this codebase should contradict them. If a change seems to
require contradicting one, that is a documented-architecture conversation,
not a quiet local decision — see Production Architecture Plan Ch.19 and
Ch.2 of the Component Library.

## Ground rules for anyone — human or AI — working in this codebase

- **Components follow the Component Library's namespace rules exactly**
  (`Group.ComponentName`, e.g. `CTA.Base`, `Passage.Wrapper`). A variant
  is a prop, never a new component. A state is a condition, never a new
  component. Check Component Library Ch.1 before creating anything new.
- **Tokens are the only place for raw values.** Every color, font size,
  spacing figure, border, radius, shadow, z-index, and motion duration
  lives in `/tokens`. A hardcoded hex code, px number, or duration inside
  a component file is a defect, not a style choice.
- **No ecommerce components, ever** — no card, grid, filter, sort,
  search, cart, wishlist, badge, pricing table, testimonial, or star
  rating. See Component Library Ch.16 for the full list.
- **GSAP, ScrollTrigger, and Lenis are load-bearing**, not swappable for
  something "simpler." They are installed now; deep configuration begins
  at Phase 6 (Motion foundation). See Production Architecture Plan Ch.7
  before touching animation.
- **Mobile is restaged, not simplified.** Every mechanic present on
  desktop must exist on mobile in some form — only the technique differs
  (pinned vs. sequential, canvas vs. video fallback).
- **Future AI coding sessions must not invent new components, tokens, or
  design/motion values casually.** If something seems to be missing from
  this system, that is very likely a real gap worth flagging against the
  Design System or Motion Bible directly — not a local, one-off decision
  made inside a component file.

## Stack

Next.js (App Router) + TypeScript, CSS Modules + CSS Custom Properties
(no Tailwind, no SCSS), GSAP + ScrollTrigger + `@gsap/react` + Lenis +
SplitType for motion, Zod for validation. Full justification: Production
Architecture Plan Ch.2.

## Project structure

See Production Architecture Plan Ch.3 for the complete folder-by-folder
rationale. Every `/components/*` namespace folder and every foundation
folder (`/animations`, `/lib`, `/hooks`, `/store`, `/media`, `/utils`,
`/data`) currently contains only a `README.md` explaining what will live
there and in which build phase — no placeholder/fake components exist
anywhere in this codebase.

## Typography note

No typeface has been chosen yet, deliberately — every prior design
document avoided naming one. `styles/reset.css` currently uses a plain
system-font stack as an honest, temporary placeholder. Loading a real
typeface (via `next/font`) is a future decision, not an oversight.

## Getting started

```
npm install
npm run dev
```

Visit `http://localhost:3000` — you'll see the homepage placeholder
("Bashir&Co / Foundation ready."), not the homepage film.

```
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run build        # production build
```

## What's next

**Phase 3 — Type System**: build `Type.Base` and its fourteen-token
variant table in `/components/type`, consuming the values already
defined in `/tokens/typography.ts` and `/tokens/tokens.css`.
