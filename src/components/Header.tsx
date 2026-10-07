import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

const NAV = ["navishcho", "avtor", "prohrama", "hrupy", "konsultatsiia"] as const;

/** Desktop only: a concept notice that scrolls away, then a sticky bar with anchors and the main button. */
export function Header({ name }: { name: string }) {
  const t = useTranslations();

  return (
    <>
      {site.isConcept && (
        <p className="tone-ink hidden border-b border-rule py-2 text-center text-sm text-muted-on-ink lg:block">
          {t("common.concept")}
        </p>
      )}
      <header className="tone-paper sticky top-0 z-40 hidden border-b border-rule lg:block">
        <div className="shell flex h-16 items-center justify-between gap-8">
          <a href="#main" className="display text-lg [font-stretch:115%]">
            {name}
          </a>
          <nav aria-label={t("nav.label")}>
            <ul className="flex gap-6 text-[0.9375rem]">
              {NAV.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="link decoration-transparent hover:decoration-current">
                    {t(`nav.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#zapys" className="btn btn-primary min-h-11 py-2">
            {t("cta.bookShort")}
          </a>
        </div>
      </header>
    </>
  );
}
