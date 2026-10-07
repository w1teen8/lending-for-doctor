import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { SubPage } from "@/components/SubPage";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

const TYPES = ["kurs", "konsultatsiia", "nabir"] as const;
type Type = (typeof TYPES)[number];
type Props = { params: Promise<{ locale: Locale; type: Type }> };

export const dynamicParams = false;
export const generateStaticParams = () => TYPES.map((type) => ({ type }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const t = await getTranslations("thanks");
  return { title: t(`${type}.title`), robots: { index: false, follow: false } };
}

/** Confirmation screen with a real expectation: when we call back, and what to do if it is urgent. */
export default async function Thanks({ params }: Props) {
  const { locale, type } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thanks");
  const { contacts } = getContent(locale).site;
  const steps = t.raw(`${type}.steps`) as string[];

  return (
    <SubPage title={t(`${type}.title`)} lead={t(`${type}.next`)}>
      {site.isConcept && <p className="mb-8 border-l-4 border-signal pl-4 font-semibold">{t("demo")}</p>}
      {steps.length > 0 && (
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="grid grid-cols-[2.25rem_minmax(0,1fr)] text-lg">
              <span className="display text-xl">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-10 space-y-2 border-t border-rule pt-6">
        <p>
          {t("urgent")}{" "}
          <a href={contacts.telegram.href} className="link" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </p>
        <p className="font-semibold">
          {t("emergency")}{" "}
          <a href="tel:103" className="link text-signal">
            103
          </a>
          .
        </p>
      </div>
      <Link href={`/${locale}/`} className="btn btn-outline mt-10">
        {t("back")}
      </Link>
    </SubPage>
  );
}
