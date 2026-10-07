"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";
import type * as z from "zod/mini";
import type { Group } from "@/content";
import { formatDateRange } from "@/lib/format";
import {
  consultationLeadSchema,
  consultationTopics,
  courseLeadSchema,
  waitlistLeadSchema,
} from "@/lib/lead-schema";
import { useBooking } from "./booking-context";
import { Consent, describe, Field, FormError, Honeypot, PhoneInput, SelectBox, SubmitButton } from "./fields";
import { useUpcomingGroups } from "./use-upcoming-groups";
import { useLeadSubmit } from "./use-lead-submit";

/** Turns a zod error code from lead-schema.ts into the translated sentence. */
function useErrorText() {
  const t = useTranslations("form.errors");
  return (e?: FieldError) => (e?.message ? t(e.message as "name") : undefined);
}

export function CourseForm({ groups }: { groups: Group[] }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const err = useErrorText();
  const { groupId } = useBooking();
  const upcoming = useUpcomingGroups(groups).filter((g) => g.seatsLeft > 0);
  const { submit, error, honeypot } = useLeadSubmit("kurs", "lead_course");

  const form = useForm<z.input<typeof courseLeadSchema>, unknown, z.output<typeof courseLeadSchema>>({
    resolver: zodResolver(courseLeadSchema),
    mode: "onTouched",
    defaultValues: { type: "course", name: "", phone: "", group: "", comment: "", consent: false },
  });
  const { register, handleSubmit, setValue, formState } = form;
  const e = formState.errors;

  useEffect(() => {
    if (groupId) setValue("group", groupId, { shouldValidate: formState.isSubmitted });
  }, [groupId, setValue, formState.isSubmitted]);

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="relative space-y-5" aria-label={t("submitCourse")}>
      <Honeypot inputRef={honeypot} />
      <Field id="course-name" label={t("name")} error={err(e.name)}>
        <input {...register("name")} {...describe("course-name", { error: err(e.name) })} autoComplete="name" className="field" />
      </Field>
      <Field id="course-phone" label={t("phone")} hint={t("phoneHint")} error={err(e.phone)}>
        <PhoneInput {...register("phone")} {...describe("course-phone", { hint: t("phoneHint"), error: err(e.phone) })} />
      </Field>
      <Field id="course-group" label={t("group")} error={err(e.group)}>
        <SelectBox {...register("group")} {...describe("course-group", { error: err(e.group) })}>
          <option value="" disabled>
            {t("groupPlaceholder")}
          </option>
          {upcoming.map((g) => (
            <option key={g.id} value={g.id}>
              {formatDateRange(g.start, g.end, locale)} · {g.city}
            </option>
          ))}
          <option value="corporate">{t("groupCorporate")}</option>
          <option value="undecided">{t("groupUndecided")}</option>
        </SelectBox>
      </Field>
      <Field id="course-comment" label={t("comment")} optional hint={t("commentHintCourse")} error={err(e.comment)}>
        <textarea
          {...register("comment")}
          {...describe("course-comment", { hint: t("commentHintCourse"), error: err(e.comment) })}
          rows={3}
          className="field"
        />
      </Field>
      <Consent id="course-consent" {...register("consent")} error={err(e.consent)} />
      <FormError message={error} />
      <SubmitButton pending={formState.isSubmitting}>{t("submitCourse")}</SubmitButton>
    </form>
  );
}

export function ConsultationForm() {
  const t = useTranslations("form");
  const err = useErrorText();
  const { submit, error, honeypot } = useLeadSubmit("konsultatsiia", "lead_consultation");

  const { register, handleSubmit, formState } = useForm<
    z.input<typeof consultationLeadSchema>,
    unknown,
    z.output<typeof consultationLeadSchema>
  >({
    resolver: zodResolver(consultationLeadSchema),
    mode: "onTouched",
    defaultValues: { type: "consultation", name: "", phone: "", comment: "", consent: false },
  });
  const e = formState.errors;

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="relative space-y-5" aria-label={t("submitConsult")}>
      <Honeypot inputRef={honeypot} />
      <Field id="consult-name" label={t("name")} error={err(e.name)}>
        <input {...register("name")} {...describe("consult-name", { error: err(e.name) })} autoComplete="name" className="field" />
      </Field>
      <Field id="consult-phone" label={t("phone")} hint={t("phoneHint")} error={err(e.phone)}>
        <PhoneInput {...register("phone")} {...describe("consult-phone", { hint: t("phoneHint"), error: err(e.phone) })} />
      </Field>
      <Field id="consult-topic" label={t("topic")} error={err(e.topic)}>
        <SelectBox defaultValue="" {...register("topic")} {...describe("consult-topic", { error: err(e.topic) })}>
          <option value="" disabled>
            {t("topicPlaceholder")}
          </option>
          {consultationTopics.map((topic) => (
            <option key={topic} value={topic}>
              {t(`topics.${topic}`)}
            </option>
          ))}
        </SelectBox>
      </Field>
      <Field id="consult-comment" label={t("comment")} optional hint={t("commentHintConsult")} error={err(e.comment)}>
        <textarea
          {...register("comment")}
          {...describe("consult-comment", { hint: t("commentHintConsult"), error: err(e.comment) })}
          rows={3}
          className="field"
        />
      </Field>
      <Consent id="consult-consent" {...register("consent")} error={err(e.consent)} />
      <FormError message={error} />
      <SubmitButton pending={formState.isSubmitting}>{t("submitConsult")}</SubmitButton>
    </form>
  );
}

/** "Повідомити про наступний набір": shown instead of the booking button when a group is full. */
export function WaitlistForm({ groupId, idPrefix }: { groupId: string; idPrefix: string }) {
  const t = useTranslations("form");
  const err = useErrorText();
  const { submit, error, honeypot } = useLeadSubmit("nabir", "waitlist_subscribe");

  const { register, handleSubmit, formState } = useForm<
    z.input<typeof waitlistLeadSchema>,
    unknown,
    z.output<typeof waitlistLeadSchema>
  >({
    resolver: zodResolver(waitlistLeadSchema),
    mode: "onTouched",
    defaultValues: { type: "waitlist", name: "", phone: "", group: groupId, consent: false },
  });
  const e = formState.errors;

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="relative grid gap-4 md:grid-cols-2" aria-label={t("submitWaitlist")}>
      <Honeypot inputRef={honeypot} />
      <Field id={`${idPrefix}-name`} label={t("name")} error={err(e.name)}>
        <input {...register("name")} {...describe(`${idPrefix}-name`, { error: err(e.name) })} autoComplete="name" className="field" />
      </Field>
      <Field id={`${idPrefix}-phone`} label={t("phone")} error={err(e.phone)}>
        <PhoneInput {...register("phone")} {...describe(`${idPrefix}-phone`, { error: err(e.phone) })} />
      </Field>
      <div className="md:col-span-2">
        <Consent id={`${idPrefix}-consent`} {...register("consent")} error={err(e.consent)} />
      </div>
      <div className="md:col-span-2">
        <FormError message={error} />
      </div>
      <div className="md:col-span-2 md:max-w-xs">
        <SubmitButton pending={formState.isSubmitting}>{t("submitWaitlist")}</SubmitButton>
      </div>
    </form>
  );
}
