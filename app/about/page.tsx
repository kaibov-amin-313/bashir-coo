import type { Metadata } from "next";
import { AboutView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export const metadata: Metadata = {
  title: `${d.about.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function Page() {
  return <AboutView locale="ru" dictionary={d} />;
}
