"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const DURATION = 1500;
// Fast start, soft stop.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

type Props = { seconds: number; label: string; caption: string; srText: string };

/**
 * The page's one self-starting animation: 00:00 → 04:00 in 1.5 s, once, with the bar
 * filling alongside. The server renders the final state and the inline script in Hero
 * rewinds it before first paint, so without JS or with reduced motion it is simply final.
 */
export function HeroCounter({ seconds, label, caption, srText }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = panel.current;
    const el = number.current;
    if (!root || !el) return;

    const set = (t: number) => {
      el.textContent = fmt(Math.round(t * seconds));
      root.style.setProperty("--t", String(t));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(1);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      set(easeOut(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seconds]);

  return (
    <div
      ref={panel}
      id="hero-counter"
      style={{ "--t": 1 } as CSSProperties}
      className="tone-paper border-l-4 border-signal"
    >
      <p className="label flex items-center justify-between gap-3 bg-signal px-3 py-2 text-paper lg:px-5 lg:py-2.5">
        {label}
        <span aria-hidden="true" className="size-2 shrink-0 bg-paper" />
      </p>

      <div className="flex items-start gap-4 px-3 py-3 lg:block lg:px-5 lg:py-5">
        <div className="shrink-0 lg:w-full">
          <p className="display text-[2.75rem] leading-none lg:text-7xl">
            <span ref={number} data-counter suppressHydrationWarning>
              {fmt(seconds)}
            </span>
            <span className="sr-only">{srText}</span>
          </p>
          <div aria-hidden="true" className="mt-2.5 h-1 w-full bg-muted/35 lg:mt-4">
            <div className="h-full bg-signal" style={{ width: "calc(var(--t) * 100%)" }} />
          </div>
        </div>
        <p className="text-[0.8125rem] leading-snug lg:mt-4 lg:text-[0.9375rem]">{caption}</p>
      </div>
    </div>
  );
}

/** Rewinds the counter before first paint so the count is visible from 00:00. */
export const counterResetScript =
  '(function(){var p=document.getElementById("hero-counter");' +
  'if(!p||matchMedia("(prefers-reduced-motion: reduce)").matches)return;' +
  'p.style.setProperty("--t","0");var n=p.querySelector("[data-counter]");if(n)n.textContent="00:00"})()';
