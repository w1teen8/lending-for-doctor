"use client";

import { AnimatePresence, LazyMotion, MotionConfig, m } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ProgramDay } from "@/content";
import { formatMinutes } from "@/lib/format";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/** Timeline of both days. Each block opens on click — movement only in response to an action. */
export function ProgramDays({ days }: { days: ProgramDay[] }) {
  const t = useTranslations("program");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="space-y-14">
          {days.map((day) => {
            const minutes = day.blocks.reduce((s, b) => s + b.minutes, 0);
            const practice = day.blocks.reduce((s, b) => s + b.practice, 0);
            return (
              <div key={day.day}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-3">
                  <h3 className="display text-3xl [font-stretch:115%]">
                    {day.day} <span className="text-subtle">·</span>{" "}
                    <span className="text-xl [font-stretch:110%] md:text-2xl">{day.focus}</span>
                  </h3>
                  <p className="tnum text-[0.9375rem] text-subtle">
                    {day.hours} · {t("dayTotal", { share: Math.round((practice / minutes) * 100) })}
                  </p>
                </div>

                <ol>
                  {day.blocks.map((b) => {
                    const key = `${day.day}-${b.time}`;
                    const isOpen = open === key;
                    const panelId = `panel-${key.replace(/[^a-z0-9]/gi, "")}`;
                    return (
                      <li key={key} className="border-b border-rule">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : key)}
                          className="grid w-full cursor-pointer grid-cols-[4.75rem_minmax(0,1fr)_1.5rem] items-start gap-x-3 gap-y-2 py-4 text-left md:grid-cols-[7rem_2rem_minmax(0,1fr)_11rem_1.5rem] md:items-center md:gap-x-4"
                        >
                          <span className="tnum pt-0.5 text-[0.9375rem] text-subtle md:pt-0">{b.time}</span>
                          <span className="display hidden text-xl md:block" aria-hidden={!b.step}>
                            {b.step ?? ""}
                          </span>
                          <span className="h3 text-lg">
                            {b.step && <span className="display mr-2 md:hidden">{b.step}</span>}
                            {b.title}
                            <span className="mt-1 block text-[0.9375rem] font-normal text-subtle [font-family:var(--font-serif)] [font-stretch:100%]">
                              {formatMinutes(b.minutes)}
                            </span>
                          </span>
                          <span className="col-start-2 md:col-start-auto">
                            <span className="block h-1.5 bg-muted/30" aria-hidden="true">
                              <span className="block h-full bg-surgical" style={{ width: `${(b.practice / b.minutes) * 100}%` }} />
                            </span>
                            <span className="tnum mt-1.5 block text-xs text-subtle">
                              {t("practiceShare", { practice: b.practice, minutes: b.minutes })}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="col-start-3 row-start-1 text-xl leading-none md:col-start-auto md:row-start-auto"
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <m.div
                              id={panelId}
                              key="panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="list-['—_'] space-y-1 pb-5 pl-6 md:ml-[10rem]">
                                {b.details.map((d) => (
                                  <li key={d}>{d}</li>
                                ))}
                              </ul>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
