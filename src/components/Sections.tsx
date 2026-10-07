import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Content } from "@/content";
import { cn, site } from "@/lib/site";
import { ChooseGroupButton } from "./forms/booking-context";
import { ConsultationForm, CourseForm } from "./forms/LeadForms";
import { GroupsTable } from "./GroupsTable";
import { ProgramDays } from "./Program";
import { Section, SectionTitle } from "./Section";
import { TrackedLink } from "./TrackedLink";

export function Program({ data, days }: { data: Content["site"]["program"]; days: Content["program"] }) {
  return (
    <Section id="prohrama" step="R" titleId="program-title">
      <SectionTitle id="program-title" lead={data.lead}>
        {data.title}
      </SectionTitle>
      <ProgramDays days={days} />
      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="tone-surgical p-6 md:p-8">
          <h3 className="h3 text-2xl">{data.notTaught.title}</h3>
          <p className="mt-2 text-paper/85">{data.notTaught.lead}</p>
          <ul className="mt-5 list-['—_'] space-y-2 pl-5">
            {data.notTaught.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="self-end border-t-2 border-ink pt-4 text-lg measure">{data.certificate}</p>
      </div>
    </Section>
  );
}

export function Groups({ data, groups }: { data: Content["site"]["groups"]; groups: Content["groups"] }) {
  return (
    <Section id="hrupy" step="C" titleId="groups-title">
      <SectionTitle id="groups-title" lead={data.lead}>
        {data.title}
      </SectionTitle>
      <GroupsTable groups={groups} />
    </Section>
  );
}

export function Pricing({ data }: { data: Content["site"]["pricing"] }) {
  return (
    <Section id="tsina" step="C" titleId="pricing-title" className="pt-0 md:pt-0">
      <SectionTitle id="pricing-title">{data.title}</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2">
        {data.items.map((item) => {
          const corporate = item.id === "corporate";
          return (
            <article
              key={item.id}
              className={corporate ? "tone-surgical flex flex-col p-6 md:p-8" : "flex flex-col border-2 border-ink p-6 md:p-8"}
            >
              <h3 className="h3 text-2xl">{item.name}</h3>
              <p className="display mt-6 text-5xl md:text-6xl">{item.price}</p>
              <p className="mt-2 text-subtle">{item.unit}</p>
              <p className="mt-6 flex-1 border-t border-rule pt-4">{item.includes}</p>
              <ChooseGroupButton
                groupId={corporate ? "corporate" : "undecided"}
                className={corporate ? "btn btn-outline mt-8 w-full" : "btn btn-primary mt-8 w-full"}
              >
                {item.cta}
              </ChooseGroupButton>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function Consultation({ data }: { data: Content["site"]["consultation"] }) {
  return (
    <Section id="konsultatsiia" step="H" titleId="consult-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <SectionTitle id="consult-title" lead={data.lead}>
            {data.title}
          </SectionTitle>

          <h3 className="h3">{data.forWhomTitle}</h3>
          <ul className="mt-3 list-['—_'] space-y-2 pl-5 text-lg">
            {data.forWhom.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="h3 mt-10">{data.howTitle}</h3>
          <ol className="mt-4 space-y-4">
            {data.how.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] text-lg">
                <span className="display text-xl" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <dl className="mt-10 grid border-y border-rule sm:grid-cols-3">
            {data.facts.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  "flex items-baseline justify-between gap-4 py-3 sm:block sm:py-4",
                  i > 0 && "border-t border-rule sm:border-t-0 sm:border-l sm:pl-4",
                  i < data.facts.length - 1 && "sm:pr-4",
                )}
              >
                <dt className="label text-subtle">{f.label}</dt>
                <dd className="display text-xl [font-stretch:110%] sm:mt-2 md:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-l-4 border-ink pl-5 measure">
            <p>{data.disclaimer}</p>
            <p className="mt-2 font-semibold">
              {data.emergency}{" "}
              <a href="tel:103" className="link text-signal">
                103
              </a>
              .
            </p>
          </div>
        </div>

        <div className="lg:pt-2">
          <div className="border-2 border-ink p-5 md:p-8 lg:sticky lg:top-24">
            <h3 className="h3 mb-6 text-2xl">{data.formTitle}</h3>
            <ConsultationForm />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Booking({ data, contacts, groups }: { data: Content["site"]["booking"]; contacts: Content["site"]["contacts"]; groups: Content["groups"] }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Section id="zapys" step="H" tone="ink" titleId="booking-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <SectionTitle id="booking-title" lead={data.lead}>
            {data.title}
          </SectionTitle>
          <div className="tone-paper p-5 md:p-8">
            <CourseForm groups={groups} />
          </div>
        </div>

        <div className="space-y-10 lg:pt-36">
          <div>
            <h3 className="h3 text-2xl">{contacts.title}</h3>
            <p className="mt-2 text-subtle">{contacts.hours}</p>
            <ul className="mt-5 divide-y divide-[var(--rule)] border-y border-rule">
              <li>
                <TrackedLink href={contacts.phone.href} event="messenger_click" label="phone" className="flex min-h-14 items-center justify-between py-3">
                  <span className="text-subtle">{t("contacts.phone")}</span>
                  <span className="display tnum text-lg [font-stretch:110%]">{contacts.phone.display}</span>
                </TrackedLink>
              </li>
              {[contacts.telegram, contacts.channel, contacts.instagram].map((c) => (
                <li key={c.href}>
                  <TrackedLink
                    href={c.href}
                    event="messenger_click"
                    label={c.label}
                    external
                    className="flex min-h-14 items-center justify-between gap-4 py-3"
                  >
                    <span>{c.label}</span>
                    <span aria-hidden="true">↗</span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-rule p-5">
            <h3 className="h3">{contacts.checklist.title}</h3>
            <p className="mt-2 text-subtle">{contacts.checklist.text}</p>
            <TrackedLink href={`/${locale}/aptechka/`} event="checklist_download" internal className="btn btn-outline mt-5">
              {t("contacts.download")}
            </TrackedLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Footer({ legal }: { legal: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const links = [
    ["privacy", t("legal.privacy")],
    ["oferta", t("legal.offer")],
    ["foto", t("legal.photos")],
  ] as const;

  return (
    <footer className="tone-ink border-t border-rule pb-28 lg:pb-10">
      <div className="shell grid gap-6 py-10 text-[0.9375rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-2 text-subtle">
          <p>{legal}</p>
          {site.isConcept && <p>{t("common.concept")}</p>}
        </div>
        <nav aria-label="Документи">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={`/${locale}/${href}/`} className="link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
