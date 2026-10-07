import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Meta";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import "../globals.css";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#111a1c" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { meta, hero } = getContent(locale).site;
  return {
    title: { default: meta.title, template: `%s — ${getContent(locale).site.person.name}` },
    description: meta.description,
    alternates: { canonical: `${site.url}/${locale}/` },
    robots: site.isConcept ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "uk_UA",
      url: `${site.url}/${locale}/`,
      title: `${hero.titleLead} ${hero.titleRest}`,
      description: meta.description,
      images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          {t("skip")}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
