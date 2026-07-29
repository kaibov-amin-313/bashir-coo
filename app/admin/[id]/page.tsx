import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/db/auth";
import { getPieceById } from "@/lib/db/pieces";
import { updatePieceAction } from "@/lib/db/actions";
import { PieceForm } from "../PieceForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const piece = await getPieceById(Number(id));
  if (!piece) notFound();

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <h1 className={styles.title}>Изменить товар</h1>
      </div>
      <PieceForm
        piece={piece}
        action={updatePieceAction}
        submitLabel="Сохранить"
      />
    </div>
  );
}
