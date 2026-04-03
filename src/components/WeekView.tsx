"use client";

import { useState } from "react";
import type { Event } from "@/data/events";
import { formatShortDate } from "@/lib/dates";
import Link from "next/link";

function getDaysFromNow(count: number): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

function toIso(d: Date): string {
  return d.toISOString().split("T")[0];
}

const DAY_NAMES = ["zo", "ma", "di", "wo", "do", "vr", "za"];

export default function WeekView({ events }: { events: Event[] }) {
  const days = getDaysFromNow(7);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedDate = toIso(days[selectedIdx]);

  const dayEvents = events.filter(
    (e) => e.date === selectedDate || (e.endDate && e.date <= selectedDate && e.endDate >= selectedDate)
  );

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h2 className="mb-5 text-xl font-extrabold text-[#2B2B2B]">
        📅 Per dag
      </h2>

      {/* Day selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-none">
        {days.map((day, i) => {
          const iso = toIso(day);
          const eventCount = events.filter(
            (e) => e.date === iso || (e.endDate && e.date <= iso && e.endDate >= iso)
          ).length;
          const isToday = i === 0;

          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all ${
                selectedIdx === i
                  ? "border-[#E85A5A] bg-[#E85A5A] text-white shadow-sm"
                  : "border-[#E0D8D2] bg-white text-[#2B2B2B] hover:border-[#E85A5A]/40"
              }`}
            >
              <span className="text-xs font-bold uppercase">
                {isToday ? "Vandaag" : DAY_NAMES[day.getDay()]}
              </span>
              <span className="text-lg font-extrabold leading-tight">{day.getDate()}</span>
              {eventCount > 0 && (
                <span className={`mt-1 text-[10px] font-semibold ${
                  selectedIdx === i ? "text-white/80" : "text-[#E85A5A]"
                }`}>
                  {eventCount} {eventCount === 1 ? "event" : "events"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for selected day */}
      {dayEvents.length === 0 ? (
        <p className="text-sm text-[#6B6B6B]">
          Geen events op {formatShortDate(selectedDate)}. Bekijk onze{" "}
          <a href="/activiteiten" className="font-semibold text-[#E85A5A]">
            vaste activiteiten
          </a>.
        </p>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <Link
              key={event.slug}
              href={`/event/${event.slug}`}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex-1">
                <h3 className="font-bold text-[#2B2B2B]">{event.title}</h3>
                <p className="mt-0.5 text-sm text-[#6B6B6B]">
                  {event.time} · {event.location}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {event.free ? (
                  <span className="rounded-full bg-[#8BC34A]/15 px-2.5 py-1 text-xs font-semibold text-[#6FAF3A]">
                    Gratis
                  </span>
                ) : (
                  <span className="text-sm font-medium text-[#6B6B6B]">{event.price}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
