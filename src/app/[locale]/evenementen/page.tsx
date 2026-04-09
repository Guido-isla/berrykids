import type { Metadata } from "next";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSchoolVacation } from "@/data/dutch-calendar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventFilterBar from "./EventFilterBar";

export const metadata: Metadata = {
  title: "Evenementen | Berry Kids",
  description: "Alle komende evenementen voor gezinnen in Haarlem en omgeving.",
};

const MONTH_NAMES = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

type EventGroup = {
  id: string;
  label: string;
  sublabel?: string;
  events: ReturnType<typeof resolveEventImages<ReturnType<typeof getScrapedEvents>[number]>>;
};

export default function EvenementenPage() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allEvents = resolveEventImages(
    getScrapedEvents().filter((e) => e.date >= today)
  );

  // Deduplicate by title — keep earliest date
  const seenTitles = new Set<string>();
  const unique = allEvents.filter((e) => {
    if (seenTitles.has(e.title)) return false;
    seenTitles.add(e.title);
    return true;
  });

  // --- Compute date boundaries ---
  // End of this week (Sunday)
  const dayOfWeek = now.getDay();
  const sundayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + sundayOffset);
  const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

  // Weekend: Saturday + Sunday
  const satOffset = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? -1 : 6 - dayOfWeek;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + satOffset);
  const satStr = saturday.toISOString().split("T")[0];
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const sunStr = sunday.toISOString().split("T")[0];

  // End of current month
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const endOfMonthStr = endOfMonth.toISOString().split("T")[0];

  // --- Build groups ---
  const groups: EventGroup[] = [];
  const usedSlugs = new Set<string>();

  function addGroup(id: string, label: string, events: typeof unique, sublabel?: string) {
    const fresh = events.filter((e) => !usedSlugs.has(e.slug));
    if (fresh.length === 0) return;
    fresh.forEach((e) => usedSlugs.add(e.slug));
    groups.push({ id, label, sublabel, events: fresh });
  }

  // 1. Deze week (excluding weekend if today is Mon-Fri)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const weekdayEvents = unique.filter((e) => e.date >= today && e.date < satStr);
    addGroup("deze-week", "Deze week", weekdayEvents);
  }

  // 2. Dit weekend
  const weekendEvents = unique.filter((e) => e.date >= satStr && e.date <= sunStr);
  addGroup("dit-weekend", "Dit weekend", weekendEvents);

  // 3. Rest of this month (after weekend, before month end)
  const afterWeekend = new Date(sunday);
  afterWeekend.setDate(sunday.getDate() + 1);
  const afterWeekendStr = afterWeekend.toISOString().split("T")[0];
  if (afterWeekendStr <= endOfMonthStr) {
    const restOfMonth = unique.filter((e) => e.date >= afterWeekendStr && e.date <= endOfMonthStr);
    const vacation = getSchoolVacation(afterWeekendStr);
    addGroup(
      "deze-maand",
      `Rest van ${MONTH_NAMES[currentMonth].toLowerCase()}`,
      restOfMonth,
      vacation ? `🎒 ${vacation.name}` : undefined
    );
  }

  // 4. Future months
  const seenMonths = new Set<number>();
  for (const e of unique) {
    const d = new Date(e.date + "T00:00:00");
    const m = d.getMonth();
    const y = d.getFullYear();
    if (y === currentYear && m <= currentMonth) continue; // skip current month
    if (y > currentYear + 1) continue;
    const monthKey = y * 12 + m;
    if (seenMonths.has(monthKey)) continue;
    seenMonths.add(monthKey);

    const monthStart = new Date(y, m, 1).toISOString().split("T")[0];
    const monthEnd = new Date(y, m + 1, 0).toISOString().split("T")[0];
    const monthEvents = unique.filter((ev) => ev.date >= monthStart && ev.date <= monthEnd);
    const vacation = getSchoolVacation(monthStart);
    addGroup(
      `maand-${MONTH_NAMES[m].toLowerCase()}`,
      MONTH_NAMES[m],
      monthEvents,
      vacation ? `🎒 ${vacation.name}` : undefined
    );
  }

  // Build pill data
  const filterPills = groups.map((g) => ({
    id: g.id,
    label: g.label,
    count: g.events.length,
  }));

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[28px]">
            Evenementen
          </h1>
          <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">
            {unique.length} evenementen in Haarlem en omgeving
          </p>
        </div>

        {/* Filter bar */}
        <EventFilterBar pills={filterPills} />

        {/* Groups */}
        <div className="mt-6 space-y-10">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-20">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-[18px] font-extrabold text-[#2D2D2D] sm:text-[20px]">
                  {group.label}
                </h2>
                {group.sublabel && (
                  <span className="text-[13px] font-bold text-[#E0685F]">{group.sublabel}</span>
                )}
                <span className="text-[13px] font-semibold text-[#999]">
                  {group.events.length} {group.events.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.events.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Empty state */}
        {groups.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[18px] font-bold text-[#2D2D2D]">Geen evenementen gevonden</p>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">Check later terug</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
