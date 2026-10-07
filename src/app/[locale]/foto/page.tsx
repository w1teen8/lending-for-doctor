import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Picture } from "@/components/Picture";
import { SubPage } from "@/components/SubPage";
import { photos } from "@/content";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("photos");
  return { title: t("title") };
}

export default async function PhotoCredits({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("photos");

  return (
    <SubPage title={t("title")} lead={t("lead")}>
      <ul className="space-y-6">
        {Object.entries(photos).map(([id, p]) => (
          <li key={id} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-t border-rule pt-4">
            <Picture id={id} alt="" sizes="6rem" className="aspect-square w-full object-cover" />
            <div className="text-[0.9375rem]">
              <p>
                {t("author")}: {p.credit.author}
              </p>
              <p className="text-subtle">{t("license")}</p>
              <a href={p.credit.source} className="link" target="_blank" rel="noopener noreferrer">
                {t("source")} — Wikimedia Commons
              </a>
            </div>
          </li>
        ))}
      </ul>
    </SubPage>
  );
}
