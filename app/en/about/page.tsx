import type { Metadata } from "next";
import { AboutView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: `${d.about.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function PageEn() {
  return <AboutView locale="en" dictionary={d} />;
}
