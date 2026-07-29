# /data

Structured local content for the prototype phase — Collection and Piece
records shaped to match the eventual CMS schema in Production
Architecture Plan Ch.14 exactly, so that migrating to a real CMS later
is a data-source swap in `/lib`, never a rebuild of component code.

Empty for this phase (Production Architecture Plan, Phase 10 onward).
When populated, every record must satisfy the `Collection`/`Piece` types
in `/types` — category exists only as a field on a Piece, never its own
top-level file or entity.
