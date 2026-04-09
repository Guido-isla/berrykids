"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Activity } from "@/data/activities";
import ActivityCard from "./ActivityCard";

type ActivityWithImage = Activity & { resolvedImage?: string; photoAttribution?: string };

const CATEGORY_OPTIONS = [
  { label: "Cultuur", value: "cultuur" },
  { label: "Sport", value: "sport" },
  { label: "Natuur & Dieren", value: "natuur" },
  { label: "Indoor", value: "indoor" },
  { label: "Alles", value: "all" },
] as const;

type CategoryFilter = (typeof CATEGORY_OPTIONS)[number]["value"];

/** Map categories to Berry illustrations + gradient + glow */
const CATEGORY_ILLUSTRATIONS: Record<string, { src: string; gradient: string; glow: string; deep: string }> = {
  sport: {
    src: "/illustrations/berry-sport-v2.png",
    gradient: "linear-gradient(180deg, #FFF9F0 0%, #FFE4C4 60%, #FFD8B0 100%)",
    glow: "rgba(255,180,100,0.25)",
    deep: "#A67A40",
  },
  natuur: {
    src: "/illustrations/berry-natuur-v2.png",
    gradient: "linear-gradient(180deg, #FFF9F0 0%, #BCECC7 60%, #8BD8A8 100%)",
    glow: "rgba(84,183,110,0.2)",
    deep: "#2F7D46",
  },
  cultuur: {
    src: "/illustrations/berry-cultuur-v2.png",
    gradient: "linear-gradient(180deg, #FFF9F0 0%, #DCC7FF 60%, #B590FF 100%)",
    glow: "rgba(125,91,206,0.2)",
    deep: "#4D3B89",
  },
  indoor: {
    src: "/illustrations/berry-zwemmen-v2.png",
    gradient: "linear-gradient(180deg, #FFF9F0 0%, #BFE5F2 60%, #88D2DA 100%)",
    glow: "rgba(79,175,190,0.2)",
    deep: "#2C7886",
  },
};

/** Map mood query params to category filters */
const MOOD_TO_CATEGORY: Record<string, CategoryFilter> = {
  buiten: "natuur",
  binnen: "indoor",
};

/** Colored pills — each category has its own color */
const PILL_COLORS: Record<string, { bg: string; text: string }> = {
  cultuur: { bg: "#7D5BCE", text: "#FFFFFF" },
  sport: { bg: "#E0685F", text: "#FFFFFF" },
  natuur: { bg: "#54B76E", text: "#FFFFFF" },
  dieren: { bg: "#8BD8A8", text: "#2F7D46" },
  indoor: { bg: "#4FAFBE", text: "#FFFFFF" },
  all: { bg: "#6B6B6B", text: "#FFFFFF" },
};

function Pill({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  const color = PILL_COLORS[value] || PILL_COLORS.all;
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
        active
          ? "shadow-sm"
          : "bg-white text-[#2D2D2D] shadow-[0_0_0_1px_#E8E0D8] hover:shadow-[0_0_0_1px_#CCC]"
      }`}
      style={active ? { background: color.bg, color: color.text } : undefined}
    >
      {label}
    </button>
  );
}

export default function FilterableActivities({ activities }: { activities: ActivityWithImage[] }) {
  const [category, setCategory] = useState<CategoryFilter>("cultuur");

  // Read ?mood= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mood = params.get("mood");
    if (mood && mood in MOOD_TO_CATEGORY) {
      setCategory(MOOD_TO_CATEGORY[mood]);
    }
  }, []);

  const filtered = category === "all"
    ? activities
    : category === "natuur"
    ? activities.filter((a) => a.category === "natuur" || a.category === "dieren")
    : activities.filter((a) => a.category === category);

  const illustration = category !== "all" ? CATEGORY_ILLUSTRATIONS[category] : null;

  return (
    <>
      {/* Category banner — illustration is the hero */}
      <div className="relative -mx-5 -mt-4 overflow-hidden sm:-mx-8" style={{ background: illustration ? illustration.gradient : undefined }}>
        {illustration && (
          <>
            {/* Glow */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ background: illustration.glow }} />
            {/* Illustration — big, centered */}
            <div className="flex items-end justify-center -mb-2">
              <Image
                src={illustration.src}
                alt=""
                width={500}
                height={375}
                className="h-auto w-[100%] max-w-[420px] sm:w-[70%] sm:max-w-[500px]"
                priority
              />
            </div>
          </>
        )}
        {!illustration && <div className="pt-[72px] sm:pt-[80px]" />}

        {/* Pills — sit on the gradient */}
        <div className="mt-0 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-none sm:px-8">
          {CATEGORY_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              label={opt.label}
              value={opt.value}
              active={category === opt.value}
              onClick={() => setCategory(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </div>
    </>
  );
}
