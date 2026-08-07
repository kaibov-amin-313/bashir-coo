import type { MetadataRoute } from "next";
import { collectionRecords } from "@/data/collections";
import { routes } from "@/config/routes";
import { absoluteUrl } from "@/lib/site";

/**
 * Bashir&Co — sitemap.
 *
 * Every public page exists twice: Russian at `/…` and English at `/en/…`.
 * Listing them as a flat list would leave a search engine to guess that
 * the two are translations of each other, and the likeliest guess is the
 * wrong one — that they're competing near-duplicates. So each entry
 * carries `alternates.languages`, which is how the two are declared as
 * one page in two languages.
 *
 * The admin, the API and the /dev previews are deliberately absent: they
 * aren't content, and /dev 404s in production anyway.
 */

/** Public routes, as RU paths. The EN mirror is derived by prefixing /en. */
const PUBLIC_PATHS: string[] = [
  routes.home,
  routes.collection,
  routes.privateSourcing,
  routes.specialPiecesByRequest,
  routes.about,
  routes.contact,
  ...collectionRecords.map((r) => routes.collectionDetail(r.slug)),
];

/** `/` → `/en`, `/collection` → `/en/collection`. */
function enPath(ruPath: string): string {
  return ruPath === "/" ? "/en" : `/en${ruPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.flatMap((path) => {
    const languages = {
      ru: absoluteUrl(path),
      en: absoluteUrl(enPath(path)),
    };

    // The homepage is the entry point; collection detail pages sit
    // deepest. Priorities reflect that rather than being uniform.
    const priority = path === routes.home ? 1 : path.startsWith("/collection/") ? 0.6 : 0.8;

    return [
      {
        url: absoluteUrl(path),
        lastModified,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages },
      },
      {
        url: absoluteUrl(enPath(path)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages },
      },
    ];
  });
}
