"use client";

import { useState } from "react";

export type Situation = "berry" | "buiten" | "binnen" | "rustig" | "energie" | "gratis";

const PILLS: { id: Situation; label: string; emoji: string }[] = [
  { id: "berry", label: "Berry kiest", emoji: "🍓" },
  { id: "buiten", label: "Naar buiten", emoji: "☀️" },
  { id: "binnen", label: "Binnen", emoji: "🏠" },
  { id: "energie", label: "Energie kwijt", emoji: "⚡" },
  { id: "rustig", label: "Rustig", emoji: "🎨" },
  { id: "gratis", label: "Gratis", emoji: "💚" },
];

export default function SituationPills({
  onChange,
  defaultSituation = "berry",
}: {
  onChange: (situation: Situation) => void;
  defaultSituation?: Situation;
}) {
  const [active, setActive] = useState<Situation>(defaultSituation);

  function handleClick(id: Situation) {
    setActive(id);
    onChange(id);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {PILLS.map((pill) => (
        <button
          key={pill.id}
          onClick={() => handleClick(pill.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
            active === pill.id
              ? "bg-[#1A1A1A] text-white shadow-sm"
              : "bg-[#F0ECE8] text-[#666] hover:bg-[#E8E0D8]"
          }`}
        >
          <span className="text-[14px]">{pill.emoji}</span>
          {pill.label}
        </button>
      ))}
    </div>
  );
}
