"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import type { Group } from "@/content";
import { formatDateRange, formatWeekdays } from "@/lib/format";
import { cn } from "@/lib/site";
import { useBooking } from "./forms/booking-context";
import { WaitlistForm } from "./forms/LeadForms";
import { useUpcomingGroups } from "./forms/use-upcoming-groups";

export function GroupsTable({ groups }: { groups: Group[] }) {
  const t = useTranslations("groups");
  const locale = useLocale();
  const { choose } = useBooking();
  const upcoming = useUpcomingGroups(groups);
  const [waitlistFor, setWaitlistFor] = useState<string | null>(null);

  if (!upcoming.length) {
    return (
      <div className="tone-paper border border-ink p-5 md:p-8">
        <p className="mb-6 text-lg measure">{t("empty")}</p>
        <WaitlistForm groupId="next" idPrefix="waitlist-next" />
      </div>
    );
  }

  const cell = "block py-1 md:table-cell md:py-5 md:pr-6 md:align-middle";
  const tag = "label mb-0.5 block text-subtle md:hidden";

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{t("dates")}</caption>
      <thead className="sr-only md:not-sr-only">
        <tr className="border-b-2 border-ink">
          {(["dates", "city", "format", "seats", "action"] as const).map((k) => (
            <th key={k} scope="col" className="label pb-3 pr-6 font-semibold">
              {t(k)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {upcoming.map((g) => {
          const full = g.seatsLeft === 0;
          const few = !full && g.seatsLeft <= 3;
          const open = waitlistFor === g.id;
          return (
            <Fragment key={g.id}>
              <tr className="block border-b border-rule py-4 md:table-row md:py-0">
                <th scope="row" className={cn(cell, "font-normal")}>
                  <span className="display block text-2xl [font-stretch:115%]">{formatDateRange(g.start, g.end, locale)}</span>
                  <span className="text-[0.9375rem] text-subtle">{formatWeekdays(g.start, g.end, locale)}</span>
                </th>
                <td className={cell}>
                  <span className={tag}>{t("city")}</span>
                  {g.city}
                </td>
                <td className={cell}>
                  <span className={tag}>{t("format")}</span>
                  {g.format}
                </td>
                <td className={cell}>
                  <span className={tag}>{t("seats")}</span>
                  {full ? (
                    <span className="text-subtle">{t("seatsNone")}</span>
                  ) : few ? (
                    <strong className="text-signal">{t("seatsFew", { left: g.seatsLeft })}</strong>
                  ) : (
                    <span className="tnum">{t("seatsFree", { left: g.seatsLeft, total: g.seatsTotal })}</span>
                  )}
                </td>
                <td className={cn(cell, "pt-3 md:text-right")}>
                  {full ? (
                    <button
                      type="button"
                      className="btn btn-outline w-full md:w-auto"
                      aria-expanded={open}
                      aria-controls={`waitlist-${g.id}`}
                      onClick={() => setWaitlistFor(open ? null : g.id)}
                    >
                      {t("notify")}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-outline w-full md:w-auto" onClick={() => choose(g.id)}>
                      {t("book")}
                    </button>
                  )}
                </td>
              </tr>
              {full && open && (
                <tr id={`waitlist-${g.id}`} className="block md:table-row">
                  <td colSpan={5} className="block border-b border-rule py-6 md:table-cell">
                    <WaitlistForm groupId={g.id} idPrefix={`waitlist-${g.id}`} />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
