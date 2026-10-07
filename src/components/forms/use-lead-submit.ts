"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { normalizePhone, type Lead } from "@/lib/lead-schema";
import { site } from "@/lib/site";

type Slug = "kurs" | "konsultatsiia" | "nabir";

async function sendLead(payload: Lead & { website: string }) {
  // Concept mode: nothing is sent anywhere, the visitor still gets the confirmation screen.
  if (!site.leadEndpoint) return "ok" as const;
  try {
    const res = await fetch(site.leadEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 429) return "rate" as const;
    return res.ok ? ("ok" as const) : ("server" as const);
  } catch {
    return "server" as const;
  }
}

/** Shared submit flow: honeypot, POST, analytics event, then the confirmation page. */
export function useLeadSubmit(slug: Slug, event: AnalyticsEvent) {
  const t = useTranslations("form.errors");
  const router = useRouter();
  const locale = useLocale();
  const honeypot = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(values: Lead) {
    setError(null);
    const result = await sendLead({
      ...values,
      phone: normalizePhone(values.phone),
      website: honeypot.current?.value ?? "",
    });
    if (result !== "ok") {
      setError(t(result));
      return;
    }
    track(event);
    router.push(`/${locale}/dyakuyemo/${slug}/`);
  }

  return { submit, error, honeypot };
}
