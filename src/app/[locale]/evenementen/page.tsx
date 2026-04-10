import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSchoolVacation } from "@/data/dutch-calendar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EmptyState from "@/components/EmptyState";
import EventFilterBar from "./EventFilterBar";

export const metadata: Metadata = {
  title: "Evenementen | Berry Kids",
  description: "Alle komende evenementen voor gezinnen in Haarlem en omgeving.",
};

const MONTH_NAMES_NL = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type EventGroup = {
  id: string;
  label: string;
  sublabel?: string;
  events: ReturnType<typeof resolveEventImages<ReturnType<typeof getScrapedEvents>[number]>>;
};

function getWeekKey(date: string): string {
  const d = new Date(date + "T00:00:00");
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  return mon.toISOString().split("T")[0];
}

export default async function EvenementenPage() {
  const t = await getTranslations("evenementen");
  const isEn = t("title") === "Events";
  const monthNames = isEn ? MONTH_NAMES_EN : MONTH_NAMES_NL;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allEvents = resolveEventImages(
    getScrapedEvents().filter((e) => e.date >= today)
  );

  const seenTitles = new Set<string>();
  const unique = allEvents.filter((e) => {
    if (seenTitles.has(e.title)) return false;
    seenTitles.add(e.title);
    return true;
  });

  // Date boundaries
  const dayOfWeek = now.getDay();
  const satOffset = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? -1 : 6 - dayOfWeek;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + satOffset);
  const satStr = saturday.toISOString().split("T")[0];
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const sunStr = sunday.toISOString().split("T")[0];
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const endOfMonthStr = endOfMonth.toISOString().split("T")[0];

  const groups: EventGroup[] = [];
  const usedSlugs = new Set<string>();

  function addGroup(id: string, label: string, events: typeof unique, sublabel?: string) {
    const fresh = events.filter((e) => !usedSlugs.has(e.slug));
    if (fresh.length === 0) return;
    fresh.forEach((e) => usedSlugs.add(e.slug));
    groups.push({ id, label, sublabel, events: fresh });
  }

  // 1. This week (weekdays only)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const weekdayEvents = unique.filter((e) => e.date >= today && e.date < satStr);
    addGroup("deze-week", t("thisWeek"), weekdayEvents);
  }

  // 2. This weekend
  const weekendEvents = unique.filter((e) => e.date >= satStr && e.date <= sunStr);
  addGroup("dit-weekend", t("thisWeekend"), weekendEvents);

  // 3. Rest of this month
  const afterWeekend = new Date(sunday);
  afterWeekend.setDate(sunday.getDate() + 1);
  const afterWeekendStr = afterWeekend.toISOString().split("T")[0];
  if (afterWeekendStr <= endOfMonthStr) {
    const restOfMonth = unique.filter((e) => e.date >= afterWeekendStr && e.date <= endOfMonthStr);
    const vacation = getSchoolVacation(afterWeekendStr);
    addGroup(
      "deze-maand",
      t("restOfMonth", { month: monthNames[currentMonth] }),
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
    if (y === currentYear && m <= currentMonth) continue;
    if (y > currentYear + 1) continue;
    const monthKey = y * 12 + m;
    if (seenMonths.has(monthKey)) continue;
    seenMonths.add(monthKey);

    const monthStart = new Date(y, m, 1).toISOString().split("T")[0];
    const monthEnd = new Date(y, m + 1, 0).toISOString().split("T")[0];
    const monthEvents = unique.filter((ev) => ev.date >= monthStart && ev.date <= monthEnd);
    const vacation = getSchoolVacation(monthStart);
    addGroup(
      `maand-${monthNames[m].toLowerCase()}`,
      monthNames[m],
      monthEvents,
      vacation ? `🎒 ${vacation.name}` : undefined
    );
  }

  const filterPills = groups.map((g) => ({
    id: g.id,
    label: g.label,
    count: g.events.length,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero — peach gradient */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
                {t("count", { count: unique.length })}
              </span>
              <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
                📅 {t("title")}
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
                {t("heroSub")}
              </p>
            </div>
            <div className="hidden sm:block" style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
              <Image
                src="/berry-wink.png"
                alt=""
                width={80}
                height={80}
                className="h-20 w-auto drop-shadow-[0_6px_20px_rgba(224,104,95,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        <EventFilterBar pills={filterPills} />

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
                <span className="text-[13px] font-semibold text-[#888]">
                  {group.events.length} {t("events", { count: group.events.length })}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.events.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {groups.length === 0 && (
          <EmptyState
            title={t("empty")}
            subtitle={t("emptySub")}
            ctaLabel={t("emptyCta")}
            ctaHref="/activiteiten"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
