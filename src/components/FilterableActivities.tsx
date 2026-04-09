"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Activity } from "@/data/activities";
import ActivityCard from "./ActivityCard";

type ActivityWithImage = Activity & { resolvedImage?: string; photoAttribution?: string };

const CATEGORY_OPTIONS = [
  { label: "Cultuur", value: "cultuur" },
  { label: "Sport", value: "sport" },
  { label: "Natuur", value: "natuur" },
  { label: "Dieren", value: "dieren" },
  { label: "Indoor", value: "indoor" },
  { label: "Alles", value: "all" },
] as const;

type CategoryFilter = (typeof CATEGORY_OPTIONS)[number]["value"];

/** Map categories to Berry illustrations + gradient + glow */
const CATEGORY_ILLUSTRATIONS: Record<string, { src: string; gradient: string; glow: string; deep: string }> = {
  sport: {
    src: "/illustrations/berry-sport.png",
    gradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE4C4 50%, #FFD8B0 100%)",
    glow: "rgba(255,180,100,0.25)",
    deep: "#A67A40",
  },
  natuur: {
    src: "/illustrations/berry-natuur-v2.png",
    gradient: "linear-gradient(135deg, #BCECC7 0%, #8BD8A8 48%, #54B76E 100%)",
    glow: "rgba(84,183,110,0.2)",
    deep: "#2F7D46",
  },
  dieren: {
    src: "/illustrations/berry-natuur-v2.png",
    gradient: "linear-gradient(135deg, #BCECC7 0%, #8BD8A8 48%, #54B76E 100%)",
    glow: "rgba(84,183,110,0.2)",
    deep: "#2F7D46",
  },
  cultuur: {
    src: "/illustrations/berry-cultuur.png",
    gradient: "linear-gradient(135deg, #DCC7FF 0%, #B590FF 46%, #7D5BCE 100%)",
    glow: "rgba(125,91,206,0.2)",
    deep: "#4D3B89",
  },
  indoor: {
    src: "/illustrations/berry-zwemmen.png",
    gradient: "linear-gradient(135deg, #BFE5F2 0%, #88D2DA 45%, #4FAFBE 100%)",
    glow: "rgba(79,175,190,0.2)",
    deep: "#2C7886",
  },
};

/** Map mood query params to category filters */
const MOOD_TO_CATEGORY: Record<string, CategoryFilter> = {
  buiten: "natuur",
  binnen: "indoor",
};

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
  const [category, setCategory] = useState<CategoryFilter>("cultuur");
  const [searchQuery, setSearchQuery] = useState("");

  // Read ?q= and ?mood= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
    const mood = params.get("mood");
    if (mood && mood in MOOD_TO_CATEGORY) {
      setCategory(MOOD_TO_CATEGORY[mood]);
    }
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

  const illustration = category !== "all" ? CATEGORY_ILLUSTRATIONS[category] : null;

  return (
    <>
      {/* Category banner — rich gradient + illustration + overlays */}
      {illustration && (
        <div className="relative -mx-5 -mt-8 mb-4 overflow-hidden sm:-mx-8" style={{ background: illustration.gradient }}>
          {/* Glow overlay */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ background: illustration.glow }} />
          {/* Bottom fade into page */}
          <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${illustration.deep}12, transparent)` }} />
          {/* Sparkle dots */}
          <div className="absolute left-[20%] top-6 h-3 w-3 rounded-full bg-white/30" />
          <div className="absolute left-[35%] top-10 h-2 w-2 rounded-full bg-white/25" />
          <div className="absolute left-[50%] top-7 h-2.5 w-2.5 rounded-full bg-white/20" />
          {/* Illustration */}
          <div className="relative mx-auto max-w-[380px] px-4 pb-2 pt-8">
            <Image
              src={illustration.src}
              alt=""
              width={500}
              height={375}
              className="h-auto w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              priority
            />
          </div>
        </div>
      )}

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
