import type { Metadata } from "next";
import { SpecialPiecesView } from "@/components/collection";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: `${d.specialPieces.title} — Bashir&Co`,
  description: d.specialPieces.text.slice(0, 150),
};

export default function SpecialPiecesPageEn() {
  return <SpecialPiecesView locale="en" dictionary={d} />;
}
