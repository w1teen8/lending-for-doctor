"use client";

import { animate } from "motion";
import { useEffect, useRef } from "react";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * The page's one self-starting animation: 00:00 → 04:00 in 1.5 s, once.
 * The server renders the final value; an inline script in Hero sets 00:00 before first paint,
 * so without JS or with reduced motion the number is simply final.
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
    const controls = animate(0, seconds, {
      duration: 1.5,
      ease: [0.2, 0, 0, 1],
      onUpdate: (v) => {
        el.textContent = fmt(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [seconds]);

  return (
    <span ref={ref} id={id} aria-hidden="true" suppressHydrationWarning>
      {fmt(seconds)}
    </span>
  );
}
