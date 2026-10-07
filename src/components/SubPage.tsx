import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

/** Plain document layout for the confirmation, legal and checklist pages. */
export function SubPage({ title, lead, children, aside }: { title: string; lead?: string; children: ReactNode; aside?: ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      {site.isConcept && (
        <p className="tone-ink no-print border-b border-rule px-4 py-2 text-center text-sm text-muted-on-ink">{t("common.concept")}</p>
      )}
      <header className="tone-paper no-print border-b border-rule">
        <div className="shell flex min-h-16 items-center">
          <Link href={`/${locale}/`} className="link py-3">
            ← {t("common.home")}
          </Link>
        </div>
      </header>
      <main id="main" className="tone-paper">
        <div className="shell py-14 md:py-20">
          <h1 className="h2 measure">{title}</h1>
          {lead && <p className="mt-5 text-lg measure text-subtle">{lead}</p>}
          <div className="mt-10 measure">{children}</div>
          {aside && <div className="mt-10">{aside}</div>}
        </div>
      </main>
    </>
  );
}

export function DocSections({ sections }: { sections: { heading: string; paragraphs: string[] }[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.heading} className="border-t border-rule pt-5">
          <h2 className="h3 text-2xl">{s.heading}</h2>
          <div className="mt-3 space-y-3">
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
