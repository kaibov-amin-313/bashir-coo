# /components/media

## Present (homepage v1)

- `PlaceholderMedia` — CSS-generated stand-ins for future photographed/
  filmed assets. Five kinds (lightSurface, macroTexture,
  objectSilhouette, interiorAtmosphere, finalHeldBreath), each named for
  the future slot it fills via `data-media-slot`, so the content/media
  replacement phase swaps assets by slot without touching layout or
  motion. Never grey boxes, never shimmer. `singularColor` exists for
  Act IV's one color arrival — its color deliberately lives in the CSS
  Module, not /tokens (product-originated color is definitionally not a
  token; see the component header).

## Not yet built

`Media.FullBleed`, `Media.Contained`, `Media.Macro`,
`Media.CanvasSequence`, `Media.ScrollScrubbedVideo`,
`Media.ReducedMotionStill`, `Media.LoadingPlaceholder` — Component
Library Ch.9; these arrive with the Collection/Passage phases and final
media work.
