# /components/threshold

The Threshold — the first *scene*, not a loader. Component Library Ch.3;
Motion Bible Ch.4; Homepage Film Script Ch.3.

## Components

- `ThresholdSequence` — the one Client Component; orchestrates the GSAP
  timeline via `useGSAP` (scoped ref, client-only, no SSR execution).
  Props: `onComplete` (fired after the final held stillness — the caller
  decides what the hard cut goes to).
- `ThresholdDarknessFrame` — the full-viewport true-black stage.
- `ThresholdLightReveal` — the restrained, off-center, CSS-generated light
  source (no final asset yet; replaceable without contract change).
- `ThresholdWordmarkReveal` — `Type.Wordmark`, targeted for reveal.
- `ThresholdLine` — the intimate first statement, revealed via the
  Patient Title behavior. Example copy only.

All but `ThresholdSequence` are plain Server Components — GSAP targets
them by `data-threshold-target` selectors from the client parent.

## Timing and behavior

Beat order (fixed): darkness hold → light reveal → wordmark reveal →
wordmark hold → patient-title line → held stillness → caller's hard cut.
First-time and returning timing, plus the reduced-motion branch, all live
in `/animations/thresholdTimeline.ts`. Returning-visitor state is a single
invisible localStorage flag (`/lib/visitorState.ts`) — no banner, no
"welcome back," no skip control, no progress indicator, ever.

## Usage

```tsx
"use client";
import { ThresholdSequence } from "@/components/threshold";

<ThresholdSequence onComplete={() => goToActOne()} />
```

## What's intentionally not built

No Act I animation (the hard cut lands on a minimal placeholder). No
Lenis, no ScrollTrigger — the Threshold is an internal timeline, not
scroll-driven. Dev-only replay/reset controls live on `/app/dev/threshold`
and must never appear in the production component.
