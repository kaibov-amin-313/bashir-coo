import type { Metadata } from "next";
import { PrivateSourcingView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("ru");

export const metadata: Metadata = {
  title: `${d.privateSourcingPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function Page() {
  return <PrivateSourcingView locale="ru" dictionary={d} />;
}
