const parse = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "24–25 жовтня" or "31 жовтня – 1 листопада". */
export function formatDateRange(start: string, end: string, locale: string) {
  const a = parse(start);
  const b = parse(end);
  const dayMonth = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" });
  if (a.getUTCMonth() === b.getUTCMonth()) {
    const month = dayMonth.formatToParts(b).find((p) => p.type === "month")?.value ?? "";
    return `${a.getUTCDate()}–${b.getUTCDate()} ${month}`;
  }
  return `${dayMonth.format(a)} – ${dayMonth.format(b)}`;
}

/** "субота–неділя". */
export function formatWeekdays(start: string, end: string, locale: string) {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
  return `${weekday.format(parse(start))}–${weekday.format(parse(end))}`;
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} хв`;
  return m ? `${h} год ${m} хв` : `${h} год`;
}
