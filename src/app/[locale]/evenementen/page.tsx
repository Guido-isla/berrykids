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

type WeekGroup = {
  id: string;
  label: string;
  sublabel?: string;
  events: ReturnType<typeof resolveEventImages<ReturnType<typeof getScrapedEvents>[number]>>;
};

function getWeekLabel(date: string, thisWeekKey: string, nextWeekKey: string): string {
  const key = getWeekKey(date);
  if (key === thisWeekKey) return "Deze week";
  if (key === nextWeekKey) return "Volgende week";

  const d = new Date(date + "T00:00:00");
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${mon.getDate()} – ${sun.getDate()} ${MONTHS[sun.getMonth()]}`;
}

function getWeekKey(date: string): string {
  const d = new Date(date + "T00:00:00");
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  return mon.toISOString().split("T")[0];
}

export default function EvenementenPage() {
  const today = new Date().toISOString().split("T")[0];
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

  // Week keys for "Deze week" / "Volgende week"
  const thisWeekKey = getWeekKey(today);
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  const nextWeekKey = getWeekKey(nextWeekDate.toISOString().split("T")[0]);

  // Group by week
  const weekMap = new Map<string, typeof unique>();
  for (const e of unique) {
    const key = getWeekKey(e.date);
    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key)!.push(e);
  }

  const weeks: WeekGroup[] = [];
  for (const [key, events] of weekMap) {
    const vacation = getSchoolVacation(events[0].date);
    const label = getWeekLabel(events[0].date, thisWeekKey, nextWeekKey);

    // Create stable ID for anchor links
    const id = key === thisWeekKey ? "deze-week"
      : key === nextWeekKey ? "volgende-week"
      : `week-${key}`;

    weeks.push({
      id,
      label,
      sublabel: vacation ? `🎒 ${vacation.name}` : undefined,
      events,
    });
  }

  // Build filter pill data from actual weeks
  const filterPills = weeks.map((w) => ({
    id: w.id,
    label: w.label,
    count: w.events.length,
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

        {/* Weekly groups */}
        <div className="mt-6 space-y-10">
          {weeks.map((week) => (
            <section key={week.id} id={week.id} className="scroll-mt-20">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-[18px] font-extrabold text-[#2D2D2D] sm:text-[20px]">
                  {week.label}
                </h2>
                {week.sublabel && (
                  <span className="text-[13px] font-bold text-[#E0685F]">{week.sublabel}</span>
                )}
                <span className="text-[13px] font-semibold text-[#999]">
                  {week.events.length} {week.events.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {week.events.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Empty state */}
        {weeks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[18px] font-bold text-[#2D2D2D]">Geen evenementen gevonden</p>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">Probeer een ander filter</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
