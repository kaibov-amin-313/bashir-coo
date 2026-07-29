import type { Metadata } from "next";
import { PrivateSourcingView } from "@/components/pages";
import { getDictionary } from "@/lib/i18n";

const d = getDictionary("en");

export const metadata: Metadata = {
  title: `${d.privateSourcingPage.title} — Bashir&Co`,
  description: d.meta.siteDescription,
};

export default function PageEn() {
  return <PrivateSourcingView locale="en" dictionary={d} />;
}
