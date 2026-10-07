"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps, ReactNode, RefObject } from "react";
import { formatPhone } from "@/lib/lead-schema";
import { cn } from "@/lib/site";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Label above, hint and error below, both wired to the control via aria-describedby (see `describe`). */
export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  const t = useTranslations("form");
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] font-semibold">
        {label}
        {optional && <span className="font-normal text-muted-on-paper"> ({t("optional")})</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm leading-snug text-muted-on-paper">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold leading-snug text-signal">
          {error}
        </p>
      )}
    </div>
  );
}

export function describe(id: string, { hint, error }: { hint?: string; error?: string }) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return { id, "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined } as const;
}

export function PhoneInput(props: ComponentProps<"input">) {
  const { onChange, ...rest } = props;
  return (
    <input
      {...rest}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+380 67 123 45 67"
      className="field tnum"
      onFocus={(e) => {
        if (!e.target.value) e.target.value = "+380 ";
      }}
      onChange={(e) => {
        e.target.value = formatPhone(e.target.value);
        onChange?.(e);
      }}
    />
  );
}

export function SelectBox(props: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn("field", props.className)} />
      <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
        ▼
      </span>
    </div>
  );
}

export function Consent({ id, error, ...input }: ComponentProps<"input"> & { id: string; error?: string }) {
  const t = useTranslations("form");
  const locale = useLocale();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-1.5 text-[0.9375rem] leading-snug">
        <input {...input} {...describe(id, { error })} type="checkbox" className="mt-0.5 size-6 shrink-0 accent-ink" />
        <span>
          {t.rich("consent", {
            link: (chunks) => (
              <Link href={`/${locale}/privacy/`} className="link" target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-signal">
          {error}
        </p>
      )}
    </div>
  );
}

/** Bots fill every field; people never see this one. The endpoint drops leads where it is not empty. */
export function Honeypot({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  const t = useTranslations("form");
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t("honeypot")}
        <input ref={inputRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  const t = useTranslations("form");
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full text-lg">
      {pending ? t("sending") : children}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  return (
    <p role="alert" className={message ? "text-[0.9375rem] font-semibold text-signal" : "sr-only"}>
      {message}
    </p>
  );
}
