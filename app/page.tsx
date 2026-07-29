import type { Metadata } from "next";
import { Homepage, HomeSections } from "@/components/home";
import { getPublicPieces } from "@/lib/db/publicPieces";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export const metadata: Metadata = {
  title: d.meta.siteTitle,
  description: d.meta.siteDescription,
};

export default async function Home() {
  const pieces = await getPublicPieces("ru");
  // HomeSections renders on the server (this is a Server Component) and is
  // handed to Homepage as children — Homepage stays a thin client shell
  // for smooth scroll, preloader, header, nav and footer, while all the
  // page copy and markup ship as server-rendered HTML with no client JS.
  return (
    <Homepage locale="ru" dictionary={d}>
      <HomeSections locale="ru" dictionary={d} pieces={pieces} />
    </Homepage>
  );
}
