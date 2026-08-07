import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Bashir&Co — robots.
 *
 * Replaces the static public/robots.txt so the sitemap can be advertised
 * at an absolute URL derived from the same origin as everything else,
 * rather than hard-coded in a text file that would quietly go stale the
 * day the custom domain lands.
 *
 * /admin and /api are disallowed because they're plumbing, not content.
 * /dev is listed for tidiness, though it now answers 404 in production —
 * a crawler shouldn't be the thing keeping it private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/dev/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
