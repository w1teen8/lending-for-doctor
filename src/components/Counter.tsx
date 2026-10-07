"use client";

import { useEffect, useRef } from "react";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const DURATION = 1500;
// Fast start, soft stop — same curve as cubic-bezier(0.2, 0, 0, 1) closely enough for a number.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * The page's one self-starting animation: 00:00 → 04:00 in 1.5 s, once.
 * The server renders the final value; an inline script in Hero sets 00:00 before first paint,
 * so without JS or with reduced motion the number is simply final.
 * Plain requestAnimationFrame: a full animation library for one number would cost ~20 KB.
 */
export function Counter({ seconds, id }: { seconds: number; id: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(seconds);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = fmt(Math.round(easeOut(t) * seconds));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seconds]);

  return (
    <span ref={ref} id={id} aria-hidden="true" suppressHydrationWarning>
      {fmt(seconds)}
    </span>
  );
}
