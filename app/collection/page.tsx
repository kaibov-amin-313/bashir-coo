import type { Metadata } from "next";
import { CuratedPiecesView } from "@/components/collection";
import { getPublicPieces } from "@/lib/db/publicPieces";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export const metadata: Metadata = {
  title: `${d.collectionPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default async function CollectionPage() {
  const pieces = await getPublicPieces("ru");
  return <CuratedPiecesView locale="ru" dictionary={d} pieces={pieces} />;
}
