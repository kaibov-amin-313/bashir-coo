import { TypeBase } from "@/components/type";
import { MediaSlot, type PlaceholderKind } from "@/components/media";
import styles from "./Collection.module.css";

/**
 * Bashir&Co — Collection opening frame.
 *
 * The first held statement of the `/collection` page or of one
 * Collection's own space: title (the route's single h1) and, for a
 * specific Collection, its one atmospheric line in the Provenance
 * register. A Server Component — no hooks, no handlers; any reveal
 * motion belongs to a later polish phase, and the text must be correct
 * without JavaScript.
 */

interface CollectionOpeningFrameProps {
  title: string;
  atmosphere?: string;
  /** When provided, renders a large hero image behind the title. */
  heroImage?: string;
  heroFallback?: PlaceholderKind;
}

export function CollectionOpeningFrame({
  title,
  atmosphere,
  heroImage,
  heroFallback = "editorialLifestyle",
}: CollectionOpeningFrameProps) {
  if (heroImage !== undefined) {
    return (
      <header className={styles.openingHero}>
        <MediaSlot
          src={heroImage}
          fallbackKind={heroFallback}
          priority
          className={styles.openingHeroImage}
        />
        <div className={styles.openingHeroOverlay} aria-hidden="true" />
        <div className={styles.openingHeroText}>
          <TypeBase variant="heroHeadline" as="h1">
            {title}
          </TypeBase>
          {atmosphere ? (
            <div className={styles.openingHeroAtmosphere}>
              <TypeBase variant="sectionStatement" as="p">
                {atmosphere}
              </TypeBase>
            </div>
          ) : null}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.openingFrame}>
      <TypeBase variant="actTitle" as="h1">
        {title}
      </TypeBase>
      {atmosphere ? (
        <div className={styles.openingAtmosphere}>
          <TypeBase variant="provenance" as="p">
            {atmosphere}
          </TypeBase>
        </div>
      ) : null}
    </header>
  );
}
