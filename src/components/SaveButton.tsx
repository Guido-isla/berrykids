"use client";

import { useState, useEffect } from "react";

export default function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saves = JSON.parse(localStorage.getItem("berry-saves") || "[]");
    setSaved(saves.includes(slug));
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const saves: string[] = JSON.parse(localStorage.getItem("berry-saves") || "[]");
    const next = saved ? saves.filter((s) => s !== slug) : [...saves, slug];
    localStorage.setItem("berry-saves", JSON.stringify(next));
    setSaved(!saved);
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Verwijder uit opgeslagen" : "Bewaar voor later"}
      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4.5 w-4.5 transition-colors ${saved ? "fill-[#E0685F] stroke-[#E0685F]" : "fill-none stroke-[#2D2D2D]/60"}`}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
