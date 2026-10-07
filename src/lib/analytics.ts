type Gtag = (command: "event", name: string, params?: Record<string, string | number>) => void;

export type AnalyticsEvent =
  | "lead_course"
  | "lead_consultation"
  | "waitlist_subscribe"
  | "messenger_click"
  | "checklist_download"
  | "scroll_50"
  | "scroll_90";

/** Sends a GA4 event when GA is configured; silently does nothing otherwise. */
export function track(name: AnalyticsEvent, params?: Record<string, string | number>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
