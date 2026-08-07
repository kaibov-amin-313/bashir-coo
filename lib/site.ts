/**
 * Bashir&Co — the canonical origin.
 *
 * One definition, used by the metadata (to make Open Graph URLs
 * absolute), the sitemap and robots. Without an absolute origin Next
 * falls back to the per-deployment Vercel hostname, so a link pasted into
 * WhatsApp can advertise a preview build — which matters here, because
 * the messenger conversation is the funnel.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel once the custom domain is live; the
 * fallback is the current production hostname.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bashir-coo.vercel.app";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
