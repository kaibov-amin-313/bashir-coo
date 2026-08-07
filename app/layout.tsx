import type { Metadata } from "next";
import "./globals.css";
import { getDictionary } from "@/lib/i18n";
import { CartProvider } from "@/store/CartContext";
import { SITE_URL } from "@/lib/site";

/**
 * Bashir&Co — Root layout. Default locale is Russian (`/` = RU,
 * `/en/*` = EN mirrors).
 *
 * Typeface: Cormorant, self-hosted from /public/fonts via @font-face in
 * globals.css. Body/nav stay on the system sans stack.
 *
 * Metadata includes Open Graph + Twitter cards, so a link pasted into
 * WhatsApp or Telegram renders with the hero image and a real
 * description rather than a bare URL.
 */

const d = getDictionary("ru");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: d.meta.siteTitle,
  description: d.meta.siteDescription,
  openGraph: {
    title: d.meta.siteTitle,
    description: d.meta.siteDescription,
    type: "website",
    locale: "ru_RU",
    siteName: "Bashir&Co",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bashir&Co",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: d.meta.siteTitle,
    description: d.meta.siteDescription,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        {/* Preload the display face so the hero headline paints Cormorant
            as early as possible. Without this the font only starts
            downloading after the CSS that references it is parsed, which
            widens the swap window on the most-visible element on the site. */}
        <link
          rel="preload"
          href="/fonts/Cormorant-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
