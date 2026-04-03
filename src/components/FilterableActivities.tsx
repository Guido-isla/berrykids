"use client";

import { useState } from "react";
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
      className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-[#E85A5A] bg-[#E85A5A] text-white shadow-sm"
          : "border-[#E0D8D2] bg-white text-[#2B2B2B] hover:border-[#E85A5A]/40 hover:bg-[#FFF0EE]"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterableActivities({ activities }: { activities: ActivityWithImage[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = category === "all"
    ? activities
    : activities.filter((a) => a.category === category);

  return (
    <>
      <div className="sticky top-0 z-40 -mx-5 border-b border-[#F0E6E0] bg-white/95 px-5 py-4 shadow-sm backdrop-blur-sm sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#999]">
            Categorie
          </span>
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
      </div>

      <div className="mt-6">
        <p className="mb-4 text-sm text-[#6B6B6B]">
          <span className="font-bold text-[#2B2B2B]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "activiteit" : "activiteiten"}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </div>
    </>
  );
}
