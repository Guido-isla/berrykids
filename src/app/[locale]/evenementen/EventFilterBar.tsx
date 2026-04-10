"use client";

import { useState } from "react";

type Pill = {
  id: string;
  label: string;
  count: number;
};

export default function EventFilterBar({ pills }: { pills: Pill[] }) {
  const [active, setActive] = useState<string>(pills[0]?.id ?? "");

  function scrollTo(id: string) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-[#F0ECE8] bg-[#FFF9F0]/95 px-4 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {pills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => scrollTo(pill.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
              active === pill.id
                ? "bg-[#E0685F] text-white shadow-sm"
                : "bg-white text-[#6B6B6B] hover:bg-[#F0ECE8]"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
