import type { Metadata } from "next";
import { CuratedPiecesView } from "@/components/collection";
import { getPublicPieces } from "@/lib/db/publicPieces";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: `${d.collectionPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default async function CollectionPageEn() {
  const pieces = await getPublicPieces("en");
  return <CuratedPiecesView locale="en" dictionary={d} pieces={pieces} />;
}
