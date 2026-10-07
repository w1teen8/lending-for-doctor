import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DocSections, SubPage } from "@/components/SubPage";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getContent(locale).legal.offer.title };
}

export default async function Offer({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getContent(locale).legal.offer;
  return (
    <SubPage title={doc.title} lead={doc.lead}>
      <DocSections sections={doc.sections} />
    </SubPage>
  );
}
