# /components/collection

Collection System v1 — see Component Library Ch.7.

## Components

- `CollectionSequence` — the Collection previews as full-viewport
  sequential frames. **v1 note:** this is the brief-sanctioned
  conservative version of `Collection.PinnedSequence`; the pinned
  scale-and-crossfade upgrade happens inside this file at the
  motion-polish phase, contract unchanged. One dominant preview per
  viewport — a grid is structurally impossible, not just avoided.
  `Collection.EntryInteraction` is the Link wrapping each preview (the
  whole composition is the tap target), not a separate component.
- `CollectionOpeningFrame` — a route's first held statement (h1 +
  optional atmosphere line). Server Component.
- `CollectionRooms` — groups one Collection's pieces into scoped
  category rooms: only categories actually present, first-appearance
  order, Metadata-register labels, global alternating passage anchors.
  Server Component.
- `CollectionQuieterWayThrough` — the deliberately least-prominent
  secondary path. Its restraint is its spec; do not promote it.
- `CollectionSpecialPiecesBlock` — near-static, no object media ever.
- `CollectionLenis` — client shim starting the Lenis singleton for
  collection routes (off under reduced motion).

## Rules

No sort/filter/search — enforced at /lib/collections.ts, not just here.
No product count, price range, or "View All" anywhere.
