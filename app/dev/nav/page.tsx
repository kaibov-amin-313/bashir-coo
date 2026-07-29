import { NavSystem, NavConciergeThread } from "@/components/nav";
import { getDictionary } from "@/lib/i18n";
import { TypeBase } from "@/components/type";
import styles from "./page.module.css";

/**
 * Bashir&Co — Navigation development preview.
 *
 * Development-only, not a public page. `NavSystem` and
 * `NavConciergeThread` are both fixed-position, so they render correctly
 * over this plain page regardless of its own content.
 *
 * Manual checks this route is for: click Nav.Mark to open the overlay;
 * confirm Escape closes it; confirm Tab cycles only within the overlay
 * while open and never reaches anything behind it; confirm focus returns
 * to Nav.Mark on close; confirm clicking a menu item closes the overlay;
 * confirm the concierge thread is reachable independently of the overlay
 * state; confirm all tap targets feel reasonable on an actual phone, not
 * only a resized desktop browser.
 */
const d = getDictionary("ru");

export default function NavPreviewPage() {
  return (
    <div className={styles.page}>
      <NavSystem locale="ru" dictionary={d} />
      <NavConciergeThread locale="ru" dictionary={d} />

      <main className={styles.content}>
        <TypeBase variant="sectionStatement" as="h1">
          Nav.Mark / Nav.Overlay / Nav.ConciergeThread — development
          preview. Not a public page.
        </TypeBase>
        <TypeBase variant="body" as="p">
          Open the overlay from the top-left mark. It should feel like a
          deliberate change of mode, not a dropdown. Escape and the mark
          itself (now acting as a close control, in the same position)
          are the only ways to close it — there is no backdrop to click,
          since this overlay has no visible &quot;outside.&quot;
        </TypeBase>
        <TypeBase variant="body" as="p">
          The concierge link, bottom-right, works independently of the
          overlay — try it with the overlay both open and closed.
        </TypeBase>
      </main>
    </div>
  );
}
