# /store

The small, deliberately minimal global state layer — see Production
Architecture Plan Ch.12.

No Redux. The genuinely global flags (first-time/returning visitor,
Recognition Gesture completion, directed arrival) fit in a small React
Context plus a couple of hooks in `/hooks`. Everything else in Ch.12's
state table is framework-provided, URL-derived, or correctly local to a
single component — it does not belong here.

Nothing here yet.
