# /animations

Reusable GSAP timeline-generating functions — behavior primitives,
consumed by name from component files, never auto-run on their own.

## Present (Phase 5)

- `patientTitle.ts` — `addPatientTitle()`, the drift-into-position reveal
  behavior. A primitive: takes a `scale` argument (`intimate` |
  `monumental`) rather than being copy-pasted per caller. Used by
  Threshold's first line now; Home Act I's hero headline will consume it
  at a different scale once a later phase builds that.
- `thresholdTimeline.ts` — `buildThresholdTimeline()`, the complete
  Threshold sequence: darkness hold → light reveal → wordmark reveal →
  wordmark hold → patient-title line → held stillness. Includes the
  documented first-time/returning timing and the reduced-motion branch.
  Every duration traces to the Motion Bible or Homepage Film Script — see
  the file's own header comment before changing any value.

## Not yet built

`Motion.ObjectsOwnTime`, `Motion.UnlitFrame`, `Motion.NegativeSpaceObject`,
`Motion.SingularColorObject`, `Motion.FinalHeldBreath`,
`Motion.ThresholdDoor` — these belong to Home Acts II–VI (Production
Architecture Plan Phase 7–8), not this phase.

## Rules

Every duration/ease value comes from `/tokens/motion.ts` or a documented,
cited figure from the Motion Bible/Homepage Film Script — never a
hand-typed number invented for a specific component's convenience.
