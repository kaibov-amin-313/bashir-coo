import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/db/auth";
import { getAllPieces, type PieceRecord } from "@/lib/db/pieces";
import { logoutAction, seedAction } from "@/lib/db/actions";
import { DeletePieceButton } from "./DeletePieceButton";
import styles from "./admin.module.css";

/**
 * Bashir&Co — admin: the piece list.
 *
 * Reads every piece (published or not) straight from Postgres. If the
 * table is empty, offers to import the twelve pieces that already ship
 * in the codebase — so the client's first visit isn't a blank page they
 * have to retype by hand.
 */

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  watches: "Часы",
  fashion: "Одежда",
  footwear: "Обувь",
  bags: "Сумки",
  jewelry: "Украшения",
  accessories: "Аксессуары",
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  let pieces: PieceRecord[] = [];
  let dbError: string | null = null;
  try {
    pieces = await getAllPieces();
  } catch (e) {
    pieces = [];
    dbError =
      e instanceof Error ? e.message : "Не удалось подключиться к базе данных";
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div>
          <h1 className={styles.title}>Товары</h1>
          <p className={styles.muted}>
            {pieces.length} {pieces.length === 1 ? "позиция" : "позиций"}
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + Добавить товар
          </Link>
          <form action={logoutAction}>
            <button type="submit" className={styles.btn}>Выйти</button>
          </form>
        </div>
      </div>

      {dbError ? (
        <p className={styles.error}>
          База данных недоступна: {dbError}
          <br />
          Проверьте переменные окружения POSTGRES_URL на Vercel. Сайт
          продолжает показывать 12 товаров из кода — посетители ничего не
          заметят.
        </p>
      ) : null}

      {!dbError && pieces.length === 0 ? (
        <div className={styles.notice}>
          <p style={{ margin: "0 0 10px" }}>
            База пустая. Можно импортировать 12 товаров, которые уже есть на
            сайте, — потом их можно править и удалять здесь.
          </p>
          <form action={seedAction}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Импортировать 12 товаров
            </button>
          </form>
        </div>
      ) : null}

      {pieces.map((p) => (
        <div key={p.id} className={styles.row}>
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt="" className={styles.thumb} />
          ) : (
            <span className={styles.noThumb}>нет фото</span>
          )}

          <div>
            <div style={{ fontWeight: 500 }}>{p.titleRu}</div>
            <div className={styles.muted}>{p.titleEn}</div>
          </div>

          <div className={styles.muted}>
            {CATEGORY_LABEL[p.category] ?? p.category}
          </div>

          <div>
            <span
              className={`${styles.pill} ${p.published ? "" : styles.pillOff}`}
            >
              {p.published ? "опубликован" : "скрыт"}
            </span>
          </div>

          <div className={styles.actions}>
            <Link href={`/admin/${p.id}`} className={styles.btn}>
              Изменить
            </Link>
            <DeletePieceButton
              id={p.id}
              title={p.titleRu || p.titleEn || p.slug}
              className={`${styles.btn} ${styles.btnDanger}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
