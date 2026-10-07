import { useTranslations } from "next-intl";
import type { SiteContent } from "@/content";
import { site } from "@/lib/site";
import { Counter } from "./Counter";
import { Picture } from "./Picture";

const counterResetScript = (id: string) =>
  `(function(){var e=document.getElementById(${JSON.stringify(id)});if(e&&!matchMedia("(prefers-reduced-motion: reduce)").matches)e.textContent="00:00"})()`;

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const t = useTranslations();

  return (
    <section aria-labelledby="hero-title" className="tone-ink relative isolate overflow-hidden">
      <Picture
        id="hero"
        alt={hero.photo.alt}
        sizes="100vw"
        priority
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-ink/80 lg:bg-ink/70" />

      <div className="shell flex min-h-svh flex-col justify-between gap-6 py-4 lg:min-h-[calc(100svh-4rem)] lg:py-14">
        {site.isConcept ? (
          <p className="text-[0.8125rem] leading-snug text-muted-on-ink lg:hidden">{t("common.concept")}</p>
        ) : (
          <span />
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:gap-12">
          <div>
            <p className="label hidden text-muted-on-ink lg:block">{hero.eyebrow}</p>
            <h1 id="hero-title" className="display lg:mt-6">
              <span className="block text-[3.5rem] [font-stretch:108%] sm:text-7xl sm:[font-stretch:125%] xl:text-8xl">
                {hero.titleLead}
              </span>
              <span className="mt-3 block text-2xl leading-tight [font-stretch:110%] sm:text-3xl xl:text-4xl">
                {hero.titleRest}
              </span>
            </h1>
            <p className="mt-4 text-base measure text-paper/90 sm:text-lg">{hero.subtitle}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <a href="#zapys" className="btn btn-primary text-lg">
                {t("cta.book")}
              </a>
              <a href="#konsultatsiia" className="btn link justify-start px-0 sm:justify-center">
                {t("cta.consult")} →
              </a>
            </div>
          </div>

          <div className="tone-paper order-first flex items-start gap-4 p-4 lg:order-none lg:block lg:p-6">
            <p className="display shrink-0 text-5xl text-signal lg:text-8xl">
              <Counter seconds={hero.counter.seconds} id="hero-counter" />
              <span className="sr-only">{hero.counter.srText}</span>
            </p>
            <script dangerouslySetInnerHTML={{ __html: counterResetScript("hero-counter") }} />
            <p className="text-sm leading-snug lg:mt-4 lg:text-base">{hero.counter.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
