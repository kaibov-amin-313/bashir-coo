import { TypeBase } from "@/components/type";
import type { TypeVariant } from "@/components/type";
import styles from "./page.module.css";

/**
 * Bashir&Co — Type.Base development preview.
 *
 * Development-only verification route, not a public page. Shows every
 * variant with sample copy so a real render can be checked against the
 * Design System's typography table. Not a design surface — no cards, no
 * ecommerce layout, no attempt to look finished.
 *
 * Exactly one `<h1>` on this page, per the brief — `heroHeadline` below
 * is the only variant rendered `as="h1"`; every other example uses a
 * non-competing element.
 */

interface Example {
  variant: TypeVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  text: string;
}

const examples: Example[] = [
  { variant: "wordmark", text: "Bashir&Co" },
  {
    variant: "heroHeadline",
    as: "h1",
    text: "Not everything is meant to be found.",
  },
  { variant: "actTitle", text: "Time" },
  { variant: "sectionStatement", text: "Nothing here is in a hurry." },
  { variant: "collectionTitle", text: "The Atelier Collection" },
  { variant: "objectTitle", text: "Reference 1958" },
  {
    variant: "provenance",
    text: "Recognized during a private estate visit, this piece carries the particular wear of a hand that wound it daily for four decades. The case has never been polished.",
  },
  {
    variant: "body",
    text: "Bashir&Co exists for a small number of people who already know what they are looking for, and a smaller number who do not yet know it exists.",
  },
  { variant: "caption", text: "Detail, mechanism, 40x magnification." },
  { variant: "metadata", text: "Rare Watches — Estate Provenance" },
  { variant: "navItem", text: "Collection" },
  { variant: "formLabel", text: "Your name" },
  { variant: "ctaText", text: "Ask About This Piece" },
  { variant: "legal", text: "© Bashir&Co. All rights reserved." },
];

export default function TypePreviewPage() {
  return (
    <div className={styles.page}>
      <p className={styles.harnessNote}>
        Type.Base — development preview. Not a public page.
      </p>
      {examples.map((example) => (
        <section key={example.variant} className={styles.row}>
          <span className={styles.label}>{example.variant}</span>
          <TypeBase variant={example.variant} as={example.as}>
            {example.text}
          </TypeBase>
        </section>
      ))}
    </div>
  );
}
