"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Booking = { groupId: string; choose: (groupId: string) => void };

const BookingContext = createContext<Booking | null>(null);

/** Lets "Записатися" buttons in the groups table and price cards preselect a group in the course form. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [groupId, setGroupId] = useState("");

  const choose = useCallback((id: string) => {
    setGroupId(id);
    const form = document.getElementById("zapys");
    if (!form) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    window.setTimeout(() => document.getElementById("course-name")?.focus({ preventScroll: true }), smooth ? 500 : 0);
  }, []);

  return <BookingContext.Provider value={{ groupId, choose }}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function ChooseGroupButton({ groupId, className, children }: { groupId: string; className?: string; children: ReactNode }) {
  const { choose } = useBooking();
  return (
    <button type="button" className={className} onClick={() => choose(groupId)}>
      {children}
    </button>
  );
}
