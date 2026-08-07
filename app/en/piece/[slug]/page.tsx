import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PieceView } from "@/components/collection";
import { getPublicPieces, getPublicPieceBySlug } from "@/lib/db/publicPieces";
import { getDictionary, categoryLabel } from "@/lib/i18n";

/**
 * Bashir&Co — a piece's own page (EN). Mirrors the Russian route.
 *
 * The point of this route is as much metadata as layout: until it
 * existed, twelve pieces by Richard Mille, Patek Philippe, Hermès and the
 * rest lived only inside a catalogue grid with no address of their own,
 * so nobody could link to one and no search engine could index one.
 */

const d = getDictionary("en");

interface Params {
  params: Promise<{ slug: string }>;
}

const RELATED_COUNT = 4;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getPublicPieceBySlug(slug, "en");
  if (!piece) return { title: "Bashir&Co" };

  const category = categoryLabel(d, piece.category);
  // Prefer the piece's own description; fall back to something factual
  // rather than leaving the snippet to be assembled from page furniture.
  const description =
    piece.description ??
    `${piece.brand} — ${piece.title}. ${category} sourced to order, delivered to Almaty. We verify authenticity, condition and completeness.`;

  return {
    title: `${piece.title} — Bashir&Co`,
    description,
    openGraph: {
      title: `${piece.title} — Bashir&Co`,
      description,
      images: piece.image ? [{ url: piece.image }] : undefined,
      type: "website",
    },
  };
}

export default async function PiecePage({ params }: Params) {
  const { slug } = await params;
  const all = await getPublicPieces("en");
  const piece = all.find((p) => p.slug === slug);
  if (!piece) notFound();

  const related = all
    .filter((p) => p.category === piece.category && p.slug !== piece.slug)
    .slice(0, RELATED_COUNT);

  return (
    <PieceView locale="en" dictionary={d} piece={piece} related={related} />
  );
}
