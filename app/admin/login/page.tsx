import { redirect } from "next/navigation";
import { loginAction } from "@/lib/db/actions";
import { isAuthenticated } from "@/lib/db/auth";
import styles from "../admin.module.css";

/**
 * Bashir&Co — admin login.
 * Email + password, checked against a bcrypt hash. Errors are
 * deliberately vague ("неверный email или пароль") so the form can't be
 * used to discover which emails exist.
 */

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className={styles.loginWrap}>
      <form action={loginAction} className={styles.loginCard}>
        <h1 className={styles.title}>Bashir&amp;Co — вход</h1>

        {error ? (
          <p className={styles.error}>Неверный email или пароль</p>
        ) : null}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={styles.input}
          />
        </div>

        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Войти
        </button>
      </form>
    </div>
  );
}
