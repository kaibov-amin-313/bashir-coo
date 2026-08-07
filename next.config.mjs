/**
 * Bashir&Co — Next.js configuration.
 *
 * Deliberately minimal for this phase (Production Architecture Plan, Phase 1–2).
 * No Tailwind, no PostCSS config, no CSS-in-JS plugin — per the Stack Decision
 * (Production Architecture Plan, Chapter 2), styling is CSS Modules + native
 * CSS Custom Properties only.
 *
 * `images.remotePatterns` is left empty until a media host (CDN or future CMS)
 * is chosen — add the real host here when Chapter 14's admin/CMS phase begins.
 * Do not add a wildcard remote pattern "for convenience."
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * Photos uploaded through the admin live in Vercel Blob, which serves
     * them from a per-store subdomain of blob.vercel-storage.com. Without
     * this entry next/image refuses the hostname and every
     * admin-uploaded photo 400s — the pieces shipped in the repo would
     * still render, so the breakage would only show up on the pieces the
     * house actually adds.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
    /* AVIF first, WebP second, original as the floor. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
