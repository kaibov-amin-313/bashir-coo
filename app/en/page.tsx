import type { Metadata } from "next";
import { Homepage, HomeSections } from "@/components/home";
import { getPublicPieces } from "@/lib/db/publicPieces";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: d.meta.siteTitle,
  description: d.meta.siteDescription,
};

export default async function HomeEn() {
  const pieces = await getPublicPieces("en");
  return (
    <Homepage locale="en" dictionary={d}>
      <HomeSections locale="en" dictionary={d} pieces={pieces} />
    </Homepage>
  );
}
