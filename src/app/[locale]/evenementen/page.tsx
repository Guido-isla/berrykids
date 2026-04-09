import type { Metadata } from "next";
import Image from "next/image";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { formatShortDate } from "@/lib/dates";
import { getSchoolVacation } from "@/data/dutch-calendar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventFilterBar from "./EventFilterBar";

export const metadata: Metadata = {
  title: "Evenementen | Berry Kids",
  description: "Alle komende evenementen voor gezinnen in Haarlem en omgeving.",
};

type WeekGroup = {
  label: string;
  sublabel?: string;
  events: ReturnType<typeof resolveEventImages<ReturnType<typeof getScrapedEvents>[number]>>;
};

function getWeekLabel(date: string): string {
  const d = new Date(date + "T00:00:00");
  // Get Monday of this week
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${mon.getDate()} ${MONTHS[mon.getMonth()]} – ${sun.getDate()} ${MONTHS[sun.getMonth()]}`;
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

  // Group by week
  const weekMap = new Map<string, typeof unique>();
  for (const e of unique) {
    const key = getWeekKey(e.date);
    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key)!.push(e);
  }

  const weeks: WeekGroup[] = [];
  const now = new Date();
  const thisWeekKey = getWeekKey(today);

  for (const [key, events] of weekMap) {
    // Check for special context
    const vacation = getSchoolVacation(events[0].date);
    let sublabel: string | undefined;
    if (vacation) sublabel = `🎒 ${vacation.name}`;

    // Friendly label
    let label: string;
    if (key === thisWeekKey) {
      label = "Deze week";
    } else {
      label = getWeekLabel(events[0].date);
    }

    weeks.push({ label, sublabel, events });
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Image src="/berry-icon.png" alt="" width={36} height={36} className="h-9 w-auto" />
            <div>
              <h1 className="text-[24px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[28px]">
                Evenementen
              </h1>
              <p className="text-[14px] font-semibold text-[#6B6B6B]">
                {unique.length} evenementen in Haarlem en omgeving
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <EventFilterBar totalEvents={unique.length} />

        {/* Weekly groups */}
        <div className="mt-6 space-y-10">
          {weeks.map((week) => (
            <section key={week.label}>
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
