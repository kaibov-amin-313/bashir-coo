import { NextResponse } from "next/server";
import { getPublicPieces } from "@/lib/db/publicPieces";
import type { Locale } from "@/lib/i18n";

/**
 * Bashir&Co — pieces for the client-side search overlay.
 *
 * The search lives inside the header, which renders on every page and is
 * a client component — so it can't read Postgres directly. Rather than
 * thread pieces as props through every page into the header, the overlay
 * fetches them once from here.
 *
 * Read-only and public: this returns exactly what the catalogue already
 * shows, nothing more. Cached briefly so typing in the search box
 * doesn't hammer the database.
 */

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale: Locale = searchParams.get("locale") === "en" ? "en" : "ru";

  const pieces = await getPublicPieces(locale);
  return NextResponse.json(pieces);
}
