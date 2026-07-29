# /components/home

## Current direction (Quiet Luxury — July 2026 pivot)

- `Homepage.tsx` — warm editorial homepage: hero → what we source → how
  it works → selected pieces → private sourcing → contact close. Takes
  `locale` + `dictionary`; all copy from /lib/i18n. Nav always visible,
  Lenis on (off under reduced motion).
- `HomeSections.tsx` / `HomeSections.module.css` — the six sections.

## Paused direction (dark cinematic film)

`HomeActIFrame`–`HomeActVIFrame`, `HomeActs.module.css`, and the
Threshold mount were the earlier dark-exhibition homepage. They remain
in the codebase (and Threshold on /dev/threshold) but are NOT mounted —
a deliberate pause per the July 12 quiet-luxury client brief, not a
deletion. Their CSS still references the token names and will render
oddly against the light palette if remounted without a retheme — do not
remount them without one.
