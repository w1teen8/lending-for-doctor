import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrintButton } from "@/components/Client";
import { SubPage } from "@/components/SubPage";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getContent(locale).legal.checklist.title };
}

/** The "аптечка для цивільного" checklist: a printable page instead of a PDF. */
export default async function Checklist({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const doc = getContent(locale).legal.checklist;

  return (
    <SubPage title={doc.title} lead={doc.lead} aside={<PrintButton label={t("print")} />}>
      <div className="space-y-8">
        {doc.groups.map((g) => (
          <section key={g.heading} className="border-t-2 border-ink pt-4">
            <h2 className="h3 text-2xl">{g.heading}</h2>
            <ul className="mt-3 space-y-2">
              {g.items.map((item) => (
                <li key={item} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
                  <span aria-hidden="true" className="mt-1.5 size-4 border-2 border-ink" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="border-t-2 border-signal pt-4">
          <h2 className="h3 text-2xl">{doc.dont.heading}</h2>
          <ul className="mt-3 list-['—_'] space-y-2 pl-5">
            {doc.dont.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <p className="text-subtle">{doc.note}</p>
      </div>
    </SubPage>
  );
}
