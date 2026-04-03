const DAYS = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const DAYS_FULL = [
  "zondag", "maandag", "dinsdag", "woensdag",
  "donderdag", "vrijdag", "zaterdag",
];
const MONTHS = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${DAYS_FULL[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getNextSunday(from: Date): Date {
  const d = startOfDay(from);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59);
  return d;
}

function getEndOfWeek(from: Date): Date {
  return getNextSunday(from);
}

function getEndOfMonth(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59);
  return d;
}

export type WhenFilter = "weekend" | "week" | "month" | "all";

export function getDateRange(when: WhenFilter): { start: Date; end: Date } {
  const now = startOfDay(new Date());

  switch (when) {
    case "weekend": {
      const day = now.getDay();
      // If it's Sat or Sun, start is today. Otherwise start is next Saturday.
      const satOffset = day === 6 ? 0 : day === 0 ? -1 : 6 - day;
      const start = new Date(now);
      start.setDate(now.getDate() + satOffset);
      const end = getNextSunday(start);
      return { start, end };
    }
    case "week":
      return { start: now, end: getEndOfWeek(now) };
    case "month":
      return { start: now, end: getEndOfMonth(now) };
    case "all":
      return {
        start: now,
        end: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
      };
  }
}

export function isInDateRange(
  eventDate: string,
  range: { start: Date; end: Date }
): boolean {
  const d = new Date(eventDate + "T00:00:00");
  return d >= range.start && d <= range.end;
}
