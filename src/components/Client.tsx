"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/** Mobile only: one button pinned to the bottom, shown after the second screen, hidden over the form. */
export function MobileBar() {
  const t = useTranslations("cta");
  const [pastFacts, setPastFacts] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const facts = document.getElementById("fakty");
    const form = document.getElementById("zapys");
    if (!facts || !form) return;
    const factsObserver = new IntersectionObserver(([e]) => {
      if (e) setPastFacts(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    const formObserver = new IntersectionObserver(([e]) => {
      if (e) setFormVisible(e.isIntersecting);
    });
    factsObserver.observe(facts);
    formObserver.observe(form);
    return () => {
      factsObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  return (
    <div
      hidden={!pastFacts || formVisible}
      className="tone-paper fixed inset-x-0 bottom-0 z-40 border-t border-rule px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <a href="#zapys" className="btn btn-primary w-full text-lg">
        {t("bookShort")}
      </a>
    </div>
  );
}

/** GA4 scroll-depth events at 50% and 90% of the page, once each. */
export function ScrollDepth() {
  useEffect(() => {
    const sent = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = window.scrollY / max;
      for (const mark of [50, 90] as const) {
        if (depth * 100 >= mark && !sent.has(mark)) {
          sent.add(mark);
          track(mark === 50 ? "scroll_50" : "scroll_90");
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn-outline no-print" onClick={() => window.print()}>
      {label}
    </button>
  );
}
