import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/site";

export const MARCH = ["M", "A", "R", "C", "H"] as const;
export type MarchStep = (typeof MARCH)[number];

type Tone = "paper" | "ink" | "surgical";

type Props = {
  id?: string;
  step: MarchStep;
  tone?: Tone;
  titleId: string;
  children: ReactNode;
  className?: string;
};

/**
 * Every section sits next to the rail: the MARCH step it belongs to.
 * Desktop: a sticky left column. Mobile: one thin line above the heading.
 */
export function Section({ id, step, tone = "paper", titleId, children, className }: Props) {
  return (
    <section id={id} aria-labelledby={titleId} className={cn(`tone-${tone}`, "py-16 md:py-24", className)}>
      <div className="shell lg:grid lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:gap-x-12">
        <Rail step={step} />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Rail({ step }: { step: MarchStep }) {
  const t = useTranslations();
  const label = t(`march.${step}`);

  return (
    <>
      <p className="mb-5 flex items-baseline gap-2 border-t border-rule pt-3 text-sm text-subtle lg:hidden">
        <span className="display text-base text-current">{step}</span>
        <span>{label}</span>
        <span className="sr-only">— {t("common.marchStep")}</span>
      </p>

      <div className="hidden lg:block">
        <div className="sticky top-24 border-t border-rule pt-4">
          <p className="display text-6xl" aria-hidden="true">
            {step}
          </p>
          <p className="mt-3 text-sm leading-snug text-subtle">
            <span className="sr-only">
              {t("common.marchStep")}: {step} —{" "}
            </span>
            {label}
          </p>
          <ol className="mt-6 flex gap-2 font-[family-name:var(--font-display)] text-sm" aria-hidden="true">
            {MARCH.map((s) => (
              <li key={s} className={s === step ? "font-bold underline underline-offset-4" : "text-subtle"}>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

export function SectionTitle({ id, children, lead }: { id: string; children: ReactNode; lead?: ReactNode }) {
  return (
    <header className="mb-10 md:mb-14">
      <h2 id={id} className="h2 measure">
        {children}
      </h2>
      {lead && <p className="mt-5 text-lg measure text-subtle">{lead}</p>}
    </header>
  );
}
