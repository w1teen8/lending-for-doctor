import { useTranslations } from "next-intl";
import type { SiteContent } from "@/content";
import { site } from "@/lib/site";
import { counterResetScript, HeroCounter } from "./HeroCounter";
import { LoopVideo } from "./LoopVideo";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const t = useTranslations();

  return (
    <section aria-labelledby="hero-title" className="tone-ink relative isolate overflow-hidden">
      <LoopVideo
        id={hero.video.id}
        label={hero.video.label}
        eager
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_50%]"
        controlsClassName="right-4 bottom-4 lg:right-8 lg:bottom-8"
      />
      <div className="absolute inset-0 -z-10 bg-ink/80 lg:bg-ink/70" />

      <div className="shell flex min-h-svh flex-col justify-between gap-4 py-3 lg:min-h-[calc(100svh-4rem)] lg:py-14">
        {site.isConcept ? (
          <p className="text-xs leading-snug text-muted-on-ink lg:hidden">{t("common.concept")}</p>
        ) : (
          <span />
        )}

        <div className="grid gap-5 pt-6 pb-4 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:gap-12 lg:pt-20 lg:pb-8">
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
            <p className="mt-3 text-base measure text-paper/90 sm:text-lg">{hero.subtitle}</p>
            <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
              <a href="#zapys" className="btn btn-primary text-lg">
                {t("cta.book")}
              </a>
              <a href="#konsultatsiia" className="btn link justify-start px-0 sm:justify-center">
                {t("cta.consult")} →
              </a>
            </div>
          </div>

          <div className="order-first lg:order-none">
            <HeroCounter
              seconds={hero.counter.seconds}
              label={hero.counter.label}
              caption={hero.counter.caption}
              srText={hero.counter.srText}
            />
            <script dangerouslySetInnerHTML={{ __html: counterResetScript }} />
          </div>
        </div>
      </div>
    </section>
  );
}
