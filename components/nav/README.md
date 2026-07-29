# /components/nav

`Nav.Mark`, `Nav.Overlay`, `Nav.MenuItem`, `Nav.ConciergeThread` — see
Component Library Ch.5. `Nav.MobileMenu` is not a separate component;
it's `Nav.Overlay` at the mobile breakpoint (no structural change needed
— see its own file).

`NavSystem` is a small composition component, not a Component Library
entry — it owns the open/closed state `Nav.Mark` and `Nav.Overlay` both
need. Use it directly wherever the nav needs to appear as a working unit.

## Usage

```tsx
import { NavSystem, NavConciergeThread } from "@/components/nav";

<NavSystem />
<NavConciergeThread />
```

`NavConciergeThread` is fully standalone — it does not need `NavSystem`
and has no dependency on overlay state, matching its own, separate
lifecycle (live from Home Act I; `Nav.Mark` only from Act V — Component
Library Ch.5, Homepage Film Script Ch.16).

## Why Nav.Mark renders twice

`Nav.Overlay` renders its own `Nav.Mark` instance as its first child,
functioning as the close control at the same visual position. This is
not a style choice — the system's z-index stack
(`--z-fullscreen-nav-overlay` above `--z-sticky-nav-mark`) means the
page-level instance would otherwise sit invisibly *and remain focusable*
underneath the open overlay, a real accessibility bug. `NavSystem`
unmounts the page-level instance while the overlay is open, so exactly
one `Nav.Mark` exists in the DOM at any time. Full reasoning in
`NavOverlay.tsx`'s header comment — read it before changing this.

## What's intentionally not built yet

Homepage Act-based visibility (no persistent nav until Act V; no
`Nav.Mark` until Act V on Home specifically), directed-arrival state,
warmed concierge session state (the `warmed` prop exists and works, but
nothing sets it from real session data yet), and full GSAP choreography
for the overlay's open/close (currently a plain CSS opacity transition).
See Production Architecture Plan Ch.7, Ch.8, Ch.12.

## Dev preview

`/app/dev/nav` — development-only, not a public route.
