import Link from "next/link";
import styles from "./not-found.module.css";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export default function NotFound() {
  return (
    <main className={styles.main}>
      <p className={styles.statement}>{d.notFound.statement}</p>
      <Link href="/" className={styles.link}>
        {d.notFound.home}
      </Link>
    </main>
  );
}
