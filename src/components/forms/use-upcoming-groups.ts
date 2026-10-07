"use client";

import { useEffect, useState } from "react";
import type { Group } from "@/content";

/**
 * The page is static, so groups that already ended are dropped in the browser.
 * Until mount it returns the build-time list, which keeps hydration consistent.
 */
export function useUpcomingGroups(groups: Group[]) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  return today ? groups.filter((g) => g.end >= today) : groups;
}
