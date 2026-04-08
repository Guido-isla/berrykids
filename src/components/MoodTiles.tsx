"use client";

import { Link } from "@/i18n/navigation";

const MOODS = [
  { emoji: "☀️", label: "Naar buiten", sub: "Park, strand, duinen", bg: "#FFF3E0", color: "#A67A40", href: "/activiteiten?mood=buiten" },
  { emoji: "🏠", label: "Lekker binnen", sub: "Museum, bioscoop", bg: "#EDE7F6", color: "#7B6BA0", href: "/activiteiten?mood=binnen" },
  { emoji: "⚡", label: "Energie kwijt", sub: "Trampoline, klimhal", bg: "#FFE8E8", color: "#C06060", href: "/activiteiten?mood=energie" },
  { emoji: "🎨", label: "Rustig", sub: "Workshop, bibliotheek", bg: "#E8F0FF", color: "#5B7090", href: "/activiteiten?mood=rustig" },
  { emoji: "💚", label: "Gratis", sub: "Speeltuin, boerderij", bg: "#E8F8ED", color: "#4A8060", href: "/activiteiten?mood=gratis" },
  { emoji: "✨", label: "Iets bijzonders", sub: "Linnaeushof, rondvaart", bg: "#FFF0E5", color: "#B07040", href: "/activiteiten?mood=special" },
];

export default function MoodTiles() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {MOODS.map((m) => (
        <Link
          key={m.label}
          href={m.href}
          className="group flex flex-col items-center rounded-[20px] px-3 py-4 text-center transition-all hover:-translate-y-1 hover:shadow-md sm:py-5"
          style={{ background: m.bg, color: m.color }}
        >
          <span className="text-[28px]">{m.emoji}</span>
          <span className="mt-1 text-[13px] font-extrabold">{m.label}</span>
          <span className="mt-0.5 text-[11px] font-semibold opacity-70">{m.sub}</span>
        </Link>
      ))}
    </div>
  );
}
