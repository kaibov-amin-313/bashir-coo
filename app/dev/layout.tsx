import { notFound } from "next/navigation";

/**
 * Bashir&Co — gate for the development preview routes.
 *
 * /dev/type, /dev/nav and /dev/threshold are internal verification
 * surfaces: they show raw type scales, navigation states and the
 * (currently disabled) threshold sequence. Useful while building, wrong
 * to leave standing in public — robots.txt asks crawlers not to index
 * them, but that is a request, not a lock, and anyone with the URL could
 * walk into the workshop.
 *
 * One layout guards all three: in production every /dev/* route answers
 * 404, while `npm run dev` keeps them available.
 */
export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  return <>{children}</>;
}
