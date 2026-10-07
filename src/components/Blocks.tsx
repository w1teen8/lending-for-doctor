import { useTranslations } from "next-intl";
import type { Review, SiteContent } from "@/content";
import { cn } from "@/lib/site";
import { LoopVideo } from "./LoopVideo";
import { Picture } from "./Picture";
import { Section, SectionTitle } from "./Section";

export function TrustStrip({ items }: { items: SiteContent["trust"] }) {
  return (
    <section id="fakty" aria-label="Факти про автора" className="tone-paper border-b border-rule">
      <ul className="shell grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <li
            key={item.label}
            className={cn(
              "border-rule py-6 pr-4 lg:py-10",
              i % 2 === 1 && "border-l pl-4",
              i >= 2 && "border-t lg:border-t-0",
              i > 0 && "lg:border-l lg:pl-6",
            )}
          >
            <span className="display block text-4xl lg:text-6xl">{item.value}</span>
            <span className="mt-2 block text-[0.9375rem] leading-snug text-subtle">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Situations({ data }: { data: SiteContent["situations"] }) {
  return (
    <Section id="navishcho" step="M" titleId="situations-title">
      <SectionTitle id="situations-title">{data.title}</SectionTitle>
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {data.items.map((item) => (
          <article key={item.title} className="border-t-2 border-ink pt-5">
            <h3 className="h3 text-2xl">{item.title}</h3>
            <p className="mt-3">{item.text}</p>
            <p className="mt-3 font-semibold">{item.verdict}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Author({ data, name }: { data: SiteContent["author"]; name: string }) {
  return (
    <Section id="avtor" step="A" tone="ink" titleId="author-title">
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div className="relative">
          <LoopVideo id={data.video.id} label={data.video.label} className="aspect-[4/5] w-full object-cover" />
        </div>
        <div>
          <p className="label text-subtle">{data.title}</p>
          <h2 id="author-title" className="h2 mt-4">
            {name}
          </h2>
          <div className="mt-8 space-y-5 text-lg measure md:text-[1.1875rem]">
            {data.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <dl className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.credentials.map((c) => (
          <div key={c.label} className="border-t border-rule py-4">
            <dt className="label text-subtle">{c.label}</dt>
            <dd className="mt-2 text-[0.9375rem] leading-snug">{c.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Gallery({ data }: { data: SiteContent["gallery"] }) {
  // Asymmetric grid on desktop: wide frame + tall frame on top, then a row of three, then two.
  const spans = [
    "md:col-span-8",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-6",
    "md:col-span-6",
  ];
  const ratios = ["aspect-[3/2]", "aspect-[3/2] md:aspect-auto md:h-full", "aspect-[4/3]", "aspect-[4/3]", "aspect-[4/3]", "aspect-[3/2]", "aspect-[3/2]"];

  return (
    <Section id="zanyattia" step="R" tone="ink" titleId="gallery-title">
      <SectionTitle id="gallery-title" lead={data.lead}>
        {data.title}
      </SectionTitle>
      <div className="grid gap-x-4 gap-y-8 md:grid-cols-12">
        {data.items.map((item, i) => (
          <figure key={item.id} className={`flex flex-col ${spans[i] ?? "md:col-span-4"}`}>
            <div className="relative min-h-0 flex-1">
              {item.video ? (
                <LoopVideo
                  id={item.video}
                  label={item.alt}
                  className={cn("w-full object-cover", ratios[i] ?? "aspect-[4/3]", i === 1 && "md:absolute md:inset-0")}
                />
              ) : (
                <Picture
                  id={item.id}
                  alt={item.alt}
                  sizes={i === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className={cn("w-full object-cover", ratios[i] ?? "aspect-[4/3]", i === 1 && "md:absolute md:inset-0")}
                />
              )}
            </div>
            <figcaption className="mt-3 text-[0.9375rem] leading-snug text-subtle">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function Reviews({ title, items }: { title: string; items: Review[] }) {
  const t = useTranslations("reviews");
  const initials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("");

  return (
    <Section id="vidhuky" step="C" titleId="reviews-title">
      <SectionTitle id="reviews-title">{title}</SectionTitle>
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {items.map((r) => (
          <li key={r.name}>
            <figure className="flex h-full flex-col border-t border-rule pt-6">
              <blockquote className="flex-1 text-lg md:text-[1.1875rem]">
                <p>«{r.text}»</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="display flex size-11 shrink-0 items-center justify-center bg-ink text-sm text-paper [font-stretch:100%]"
                >
                  {initials(r.name)}
                </span>
                <span className="leading-tight">
                  <span className="h3 block text-base">{r.name}</span>
                  <span className="text-[0.9375rem] text-subtle">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-subtle">{t("photoNote")}</p>
    </Section>
  );
}
