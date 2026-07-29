import type { Metadata } from "next";
import { ContactView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: `${d.contactPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function PageEn() {
  return <ContactView locale="en" dictionary={d} />;
}
