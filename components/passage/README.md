# /components/passage

Product Passage System v1 — see Component Library Ch.8.

## Components

- `PassageWrapper` — one object's full passage: title + quiet category
  mention → macro media → object media → Provenance → inquiry line. One
  component, a `category` prop, and the `passageVariants` lookup — never
  seven near-duplicate passage sets. Carries the stable DOM id
  (`piece-<slug>`) that `?piece=` direct linking targets; its h3 has
  tabIndex={-1} so the link handler can focus it non-disruptively.
  MacroMedia / ObjectMedia / ProvenanceBlock / InquiryEmergence are
  file-local blocks inside this component in v1 — none is used anywhere
  else yet; extracting one later is a rename, not a redesign.
- `passageVariants.ts` — the single category → media-treatment lookup.
  Adding a category = adding one row here.

## v1 boundaries

The inquiry line is non-interactive (no Contact page exists yet).
No Recognition Gesture (later phase). No canvas sequences or scrubbed
video yet — `mediaTechnique` on each Piece records what each will use.
No price, spec table, related items, or ratings — ever, at any phase.
