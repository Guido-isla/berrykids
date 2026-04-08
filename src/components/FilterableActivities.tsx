"use client";

import { useState, useEffect } from "react";
import type { Activity } from "@/data/activities";
import ActivityCard from "./ActivityCard";

type ActivityWithImage = Activity & { resolvedImage?: string; photoAttribution?: string };

const CATEGORY_OPTIONS = [
  { label: "Alles", value: "all" },
  { label: "Sport", value: "sport" },
  { label: "Natuur", value: "natuur" },
  { label: "Cultuur", value: "cultuur" },
  { label: "Dieren", value: "dieren" },
  { label: "Indoor", value: "indoor" },
] as const;

type CategoryFilter = (typeof CATEGORY_OPTIONS)[number]["value"];

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "border-[#E0685F] bg-[#E0685F] text-white shadow-sm"
          : "border-[#E0D8D2] bg-white text-[#2D2D2D] hover:border-[#E0685F]/40 hover:bg-[#FFF0EE]"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterableActivities({ activities }: { activities: ActivityWithImage[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Read ?q= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, []);

  let filtered = category === "all"
    ? activities
    : activities.filter((a) => a.category === category);

  // Apply search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.subcategory.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 -mx-5 border-b border-[#F0E6E0] bg-white/95 px-5 py-3 shadow-sm backdrop-blur-sm sm:-mx-8 sm:px-8 sm:py-4">
        {/* Search bar */}
        <div className="mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek op naam, locatie, categorie..."
            className="w-full rounded-full border border-[#E8E0D8] bg-white px-4 py-2.5 text-[13px] outline-none transition-colors placeholder:text-[#A09488] focus:border-[#E0685F]"
          />
        </div>
        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {CATEGORY_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={category === opt.value}
              onClick={() => setCategory(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 text-sm text-[#6B6B6B]">
          <span className="font-bold text-[#2D2D2D]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "activiteit" : "activiteiten"}
          {searchQuery && <span> voor &ldquo;{searchQuery}&rdquo;</span>}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-[20px] bg-white p-8 text-center shadow-sm">
            <p className="text-[16px] font-bold text-[#2D2D2D]">Niets gevonden</p>
            <p className="mt-1 text-[13px] text-[#6B6B6B]">Probeer een andere zoekterm of categorie.</p>
            <button
              onClick={() => { setSearchQuery(""); setCategory("all"); }}
              className="mt-3 rounded-full bg-[#E0685F] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#D05A52]"
            >
              Toon alles
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((activity) => (
              <ActivityCard key={activity.slug} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
