import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/db/auth";
import { createPieceAction } from "@/lib/db/actions";
import { PieceForm } from "../PieceForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewPiecePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <h1 className={styles.title}>Новый товар</h1>
      </div>
      <PieceForm action={createPieceAction} submitLabel="Добавить" />
    </div>
  );
}
