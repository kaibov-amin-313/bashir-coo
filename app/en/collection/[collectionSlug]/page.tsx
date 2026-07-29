import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CollectionDetailView } from "@/components/collection";
import { getCollectionBySlug } from "@/lib/collections";
import { collectionRecords } from "@/data/collections";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

interface Params {
  params: Promise<{ collectionSlug: string }>;
}

export function generateStaticParams() {
  return collectionRecords.map((r) => ({ collectionSlug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { collectionSlug } = await params;
  const collection = getCollectionBySlug(collectionSlug, "en");
  if (!collection) return { title: "Bashir&Co" };
  return {
    title: `${collection.name} — Bashir&Co`,
    description: collection.atmosphere,
  };
}

export default async function CollectionDetailPageEn({ params }: Params) {
  const { collectionSlug } = await params;
  const collection = getCollectionBySlug(collectionSlug, "en");
  if (!collection) notFound();
  return (
    <CollectionDetailView locale="en" dictionary={d} collection={collection} />
  );
}
