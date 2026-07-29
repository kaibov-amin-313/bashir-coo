import { Suspense } from "react";
import { NavConciergeThread } from "@/components/nav";
import { SiteHeader } from "@/components/header";
import { FooterRoot } from "@/components/footer";
import {
  CollectionSequence,
  CollectionQuieterWayThrough,
  CollectionSpecialPiecesBlock,
  CollectionOpeningFrame,
  CollectionRooms,
  CollectionLenis,
} from "@/components/collection";
import { PieceScrollHandler } from "./PieceScrollHandler";
import type { Collection } from "@/types";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Bashir&Co — Collection route views, shared by RU and EN route files.
 * Server-renderable composition; all interactivity lives in children.
 */

interface CollectionIndexViewProps {
  locale: Locale;
  dictionary: Dictionary;
  collections: Collection[];
}

export function CollectionIndexView({
  locale,
  dictionary,
  collections,
}: CollectionIndexViewProps) {
  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      <CollectionLenis />
      <main lang={locale === "en" ? "en" : undefined}>
        <CollectionOpeningFrame title={dictionary.collectionPage.title} />
        <CollectionSequence collections={collections} locale={locale} />
        <CollectionQuieterWayThrough locale={locale} dictionary={dictionary} />
      </main>
    </>
  );
}

interface CollectionDetailViewProps {
  locale: Locale;
  dictionary: Dictionary;
  collection: Collection;
}

export function CollectionDetailView({
  locale,
  dictionary,
  collection,
}: CollectionDetailViewProps) {
  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      <CollectionLenis />
      <Suspense fallback={null}>
        <PieceScrollHandler />
      </Suspense>
      <main lang={locale === "en" ? "en" : undefined}>
        <CollectionOpeningFrame
          title={collection.name}
          atmosphere={collection.atmosphere}
        />
        <CollectionRooms collection={collection} dictionary={dictionary} locale={locale} />
        <CollectionQuieterWayThrough locale={locale} dictionary={dictionary} />
      </main>
      <FooterRoot locale={locale} dictionary={dictionary} />
    </>
  );
}

interface SpecialPiecesViewProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SpecialPiecesView({
  locale,
  dictionary,
}: SpecialPiecesViewProps) {
  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <NavConciergeThread locale={locale} dictionary={dictionary} />
      <CollectionLenis />
      <main lang={locale === "en" ? "en" : undefined}>
        <CollectionSpecialPiecesBlock locale={locale} dictionary={dictionary} />
      </main>
      <FooterRoot locale={locale} dictionary={dictionary} />
    </>
  );
}
