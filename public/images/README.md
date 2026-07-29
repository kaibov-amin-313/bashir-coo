# Bashir&Co image slots

Drop real photography here; the MediaSlot component picks it up
automatically with no code change. Until a file exists, MediaSlot
renders a warm material placeholder at the identical aspect ratio, so
layout never shifts when photos arrive.

## Folders & expected crops
- hero/          — large lifestyle images (landscape, ~3:2 or wider)
- categories/    — one per category (portrait-ish, 4:5)
- products/      — one per curated piece, named <slug>.jpg (portrait 4:5)
- editorial/     — full-width interior / lifestyle bands (wide, ~16:9)

## Naming
Products MUST match the piece slug: e.g. steel-chronograph-1968.jpg.
Categories: watches.jpg, clothing.jpg, footwear.jpg, bags.jpg,
jewelry.jpg, accessories.jpg.
Hero: home-hero.jpg, home-hero-still.jpg. Editorial: house.jpg,
about-hero.jpg, sourcing-hero.jpg.

Formats: .jpg or .webp. Keep longest edge ~2000px, optimized.
