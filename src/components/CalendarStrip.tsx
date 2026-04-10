"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";

export type CalendarDay = {
  date: string; // ISO
  dayName: string; // "ma", "di", etc.
  dayNum: number;
  monthName: string;
  weatherIcon?: string;
  tempMax?: number;
  isRainy?: boolean;
  eventCount: number;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
};

export default function CalendarStrip({ days }: { days: CalendarDay[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {days.map((day) => {
          const isSpecial = day.isToday || day.isHoliday;

          return (
            <Link
              key={day.date}
              href={`/activiteiten?date=${day.date}`}
              className={`group flex w-[72px] shrink-0 flex-col items-center rounded-[16px] px-2 py-3 transition-all hover:-translate-y-0.5 ${
                day.isToday
                  ? "bg-[#E0685F] shadow-[0_4px_16px_rgba(224,104,95,0.25)]"
                  : day.isHoliday
                  ? "bg-[#FFE8D6] shadow-sm"
                  : day.isWeekend
                  ? "bg-white shadow-sm"
                  : "bg-[#FAF7F4]"
              }`}
            >
              {/* Day name */}
              <span
                className={`text-[11px] font-bold uppercase ${
                  day.isToday
                    ? "text-white/80"
                    : day.isHoliday
                    ? "text-[#E0685F]"
                    : "text-[#888]"
                }`}
              >
                {day.isToday ? "nu" : day.dayName}
              </span>

              {/* Date number */}
              <span
                className={`text-[20px] font-black leading-none ${
                  day.isToday ? "text-white" : "text-[#2D2D2D]"
                }`}
              >
                {day.dayNum}
              </span>

              {/* Weather icon */}
              {day.weatherIcon && (
                <span className="mt-1.5 text-[16px] leading-none">
                  {day.weatherIcon}
                </span>
              )}

              {/* Temp */}
              {day.tempMax !== undefined && (
                <span
                  className={`mt-0.5 text-[11px] font-bold ${
                    day.isToday
                      ? "text-white/70"
                      : day.isRainy
                      ? "text-[#7BA0C4]"
                      : day.tempMax >= 18
                      ? "text-[#E0685F]"
                      : "text-[#888]"
                  }`}
                >
                  {day.tempMax}°
                </span>
              )}

              {/* Event count dot */}
              {day.eventCount > 0 && (
                <div className="mt-1.5 flex items-center gap-0.5">
                  <span
                    className={`text-[10px] font-bold ${
                      day.isToday ? "text-white/80" : "text-[#E0685F]"
                    }`}
                  >
                    {day.eventCount} {day.eventCount === 1 ? "tip" : "tips"}
                  </span>
                </div>
              )}

              {/* Holiday label */}
              {day.isHoliday && day.holidayName && !day.isToday && (
                <span className="mt-1 max-w-full truncate text-[9px] font-bold text-[#E0685F]">
                  {day.holidayName}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
