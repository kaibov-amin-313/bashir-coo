"use client";

import { deletePieceAction } from "@/lib/db/actions";

/**
 * Bashir&Co — delete control for the admin list.
 *
 * A client island purely so the destructive action can be confirmed. It
 * sat next to "Изменить" as a bare submit button: one stray click and the
 * piece was gone from the database, with no undo and no soft-delete to
 * recover from. Naming the piece in the prompt matters — "Удалить
 * позицию?" invites a reflexive OK, whereas seeing the title is the
 * moment a misclick gets caught.
 */
export function DeletePieceButton({
  id,
  title,
  className,
}: {
  id: string | number;
  title: string;
  className?: string;
}) {
  return (
    <form
      action={deletePieceAction}
      onSubmit={(e) => {
        if (!window.confirm(`Удалить «${title}»? Это действие необратимо.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        Удалить
      </button>
    </form>
  );
}
