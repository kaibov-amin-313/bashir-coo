import type { Metadata } from "next";
import { ContactView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export const metadata: Metadata = {
  title: `${d.contactPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function Page() {
  return <ContactView locale="ru" dictionary={d} />;
}
