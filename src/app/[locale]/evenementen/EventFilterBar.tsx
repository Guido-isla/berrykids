"use client";

import { useState } from "react";

const FILTERS = [
  { key: "all", label: "Alles" },
  { key: "gratis", label: "Gratis" },
  { key: "indoor", label: "Binnen" },
  { key: "outdoor", label: "Buiten" },
] as const;

export default function EventFilterBar({ totalEvents }: { totalEvents: number }) {
  const [active, setActive] = useState<string>("all");

  // For now, filters are visual — server-side filtering will come when
  // this page gets converted to use searchParams
  return (
    <div className="sticky top-0 z-20 -mx-4 bg-[#FFF9F0]/95 px-4 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
              active === f.key
                ? "bg-[#E0685F] text-white shadow-sm"
                : "bg-white text-[#6B6B6B] hover:bg-[#F0ECE8]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
