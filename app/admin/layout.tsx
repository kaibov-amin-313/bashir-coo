import type { Metadata } from "next";
import styles from "./admin.module.css";

/**
 * Bashir&Co — admin layout.
 *
 * Kept out of the site's design system entirely: this is a working tool
 * for the client, not a page a visitor sees, so it's plain, dense, and
 * optimised for editing rather than for atmosphere. It also carries
 * `noindex` — an admin panel must never turn up in search results.
 */

export const metadata: Metadata = {
  title: "Bashir&Co — админка",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.shell}>{children}</div>;
}
