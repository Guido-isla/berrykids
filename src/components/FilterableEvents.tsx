"use client";

import { useState } from "react";
import type { Event } from "@/data/events";
import { filterEvents, type Filters, DEFAULT_FILTERS } from "@/data/filters";
import type { WhenFilter } from "@/lib/dates";
import EventCard from "./EventCard";

type EventWithImage = Event & { resolvedImage?: string; photoAttribution?: string; isNew?: boolean };

const WHEN_OPTIONS: { label: string; value: WhenFilter }[] = [
  { label: "Dit weekend", value: "weekend" },
  { label: "Deze week", value: "week" },
  { label: "Deze maand", value: "month" },
  { label: "Alles", value: "all" },
];

const AGE_OPTIONS: { label: string; value: Filters["age"] }[] = [
  { label: "Alle leeftijden", value: "all" },
  { label: "0 – 3", value: "0-3" },
  { label: "4 – 8", value: "4-8" },
  { label: "8 +", value: "8+" },
];

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "bg-[#E85A5A] text-white"
          : "bg-white text-[#6B6B6B] hover:bg-[#FFF0EE] hover:text-[#E85A5A]"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterableEvents({ events }: { events: EventWithImage[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const filtered = filterEvents(events, filters);

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      {/* Compact filter row */}
      <div className="sticky top-0 z-40 -mx-5 bg-[#FFF8F4] px-5 py-3 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {WHEN_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={filters.when === opt.value}
              onClick={() => update("when", opt.value)}
            />
          ))}

          <span className="mx-1 text-[#E0D8D2]">|</span>

          {AGE_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={filters.age === opt.value}
              onClick={() => update("age", opt.value)}
            />
          ))}

          {hasActiveFilters && (
            <>
              <span className="mx-1 text-[#E0D8D2]">|</span>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="shrink-0 text-xs font-semibold text-[#E85A5A] hover:text-[#D04A4A]"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-4">
        <p className="mb-4 text-sm text-[#6B6B6B]">
          <span className="font-bold text-[#2B2B2B]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "activiteit" : "activiteiten"} gevonden
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-bold text-[#2B2B2B]">
              Geen activiteiten gevonden
            </p>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Probeer andere filters of kijk later nog eens.
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 rounded-full bg-[#E85A5A] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D04A4A]"
            >
              Toon alle activiteiten
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
