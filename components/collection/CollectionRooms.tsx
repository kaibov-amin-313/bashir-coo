import { TypeBase } from "@/components/type";
import { PassageWrapper } from "@/components/passage";
import type { Category, Collection, Piece } from "@/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import styles from "./Collection.module.css";

/**
 * Bashir&Co — Collection category rooms.
 *
 * Groups one Collection's pieces into scoped category sections —
 * showing ONLY the categories this Collection actually holds, in the
 * order they first appear in the Collection's own curated piece order
 * (Website Blueprint's lateral-room model; Production Architecture Plan
 * Ch.9's "filtering happens once, at data level, not a hidden-empties
 * patch"). A Collection with no jewelry simply has no jewelry room —
 * structurally, not conditionally.
 *
 * Room labels are Metadata-register plain text — the quietest possible
 * category mention, one per room, never navigation, never a filter,
 * never a count (Design System Ch.10).
 *
 * The passage anchor alternates by *global* piece index across the whole
 * page, not per-room, so the left/right rhythm never resets mid-scroll.
 *
 * A Server Component — grouping is pure data work; all motion lives
 * inside each PassageWrapper.
 */

interface CollectionRoomsProps {
  collection: Collection;
  dictionary: Dictionary;
  locale: Locale;
}

export function CollectionRooms({ collection, dictionary, locale }: CollectionRoomsProps) {
  // First-appearance-order grouping, preserving curated piece order
  // within each room.
  const rooms = new Map<Category, Piece[]>();
  for (const piece of collection.pieces) {
    const room = rooms.get(piece.category);
    if (room) {
      room.push(piece);
    } else {
      rooms.set(piece.category, [piece]);
    }
  }

  let globalIndex = 0;

  return (
    <>
      {Array.from(rooms.entries()).map(([category, pieces]) => (
        <section
          key={category}
          className={styles.room}
          aria-label={dictionary.categoryLabels[category]}
        >
          <div className={styles.roomLabel}>
            <TypeBase variant="metadata" as="span">
              {dictionary.categoryLabels[category]}
            </TypeBase>
          </div>
          {pieces.map((piece) => {
            const anchor = globalIndex % 2 === 0 ? "left" : "right";
            globalIndex += 1;
            return (
              <PassageWrapper key={piece.slug} piece={piece} anchor={anchor} dictionary={dictionary} locale={locale} />
            );
          })}
        </section>
      ))}
    </>
  );
}
