"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SituationPills, { type Situation } from "./SituationPills";

type HeroActivity = {
  slug: string;
  title: string;
  category: string;
  location: string;
  free: boolean;
  indoor: boolean;
  image: string;
  subcategory?: string;
  isEvent?: boolean;
};

export default function SituationHero({
  allItems,
  defaultSituation,
  whyNow,
}: {
  allItems: HeroActivity[];
  defaultSituation: Situation;
  whyNow: string;
}) {
  const [situation, setSituation] = useState<Situation>(defaultSituation);

  const filtered = useMemo(() => {
    if (situation === "berry") return allItems;
    return allItems.filter((item) => {
      switch (situation) {
        case "buiten": return !item.indoor;
        case "binnen": return item.indoor;
        case "energie": return ["sport", "Speeltuin", "Trampolinepark", "Binnenspeeltuin", "Megaspeeltuin", "Natuurspeeltuin"].some(
          (k) => item.category?.includes(k) || item.subcategory?.includes(k)
        );
        case "rustig": return ["cultuur", "Museum", "Bibliotheek", "Landgoed", "Rondvaart"].some(
          (k) => item.category?.includes(k) || item.subcategory?.includes(k)
        );
        case "gratis": return item.free;
        default: return true;
      }
    });
  }, [situation, allItems]);

  const topPick = filtered[0] || allItems[0];
  const alts = (filtered.length > 1 ? filtered : allItems).slice(1, 4);

  return (
    <>
      {/* Situation pills */}
      <div className="mb-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">Vandaag voelt als</p>
        <SituationPills onChange={setSituation} defaultSituation={defaultSituation} />
      </div>

      {/* #1 pick — large card */}
      <Link href={topPick.isEvent ? `/event/${topPick.slug}` : `/activiteiten/${topPick.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[21/9]">
          <Image
            src={topPick.image}
            alt={topPick.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)" }} />
          <div className="absolute left-4 top-4 rounded-full bg-[#E0685F] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Berry&apos;s #1
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className="text-[13px] font-semibold text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              {situation === "berry" ? whyNow : situationLabel(situation)}
            </p>
            <h2 className="mt-1 text-[clamp(1.3rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              {topPick.title}
            </h2>
            <p className="mt-1 text-[12px] text-white/50">
              {topPick.location} · {topPick.category}{topPick.free ? " · Gratis" : ""}
            </p>
          </div>
        </div>
      </Link>

      {/* Alternatives row */}
      {alts.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {alts.map((item) => (
            <Link
              key={item.slug}
              href={item.isEvent ? `/event/${item.slug}` : `/activiteiten/${item.slug}`}
              className="group flex gap-3 rounded-xl bg-[#FAF8F6] p-3 transition-colors hover:bg-[#F0ECE8]"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#E0685F]">
                  {item.category}{item.free ? " · Gratis" : ""}
                </p>
                <h3 className="text-[14px] font-bold leading-snug tracking-tight text-[#2D2D2D] group-hover:text-[#E0685F]">
                  {item.title}
                </h3>
                <p className="truncate text-[12px] text-[#6B6B6B]">{item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function situationLabel(s: Situation): string {
  switch (s) {
    case "buiten": return "Perfect om naar buiten te gaan";
    case "binnen": return "Lekker warm binnen";
    case "energie": return "Hier worden ze moe van";
    case "rustig": return "Rustig en ontspannen";
    case "gratis": return "Gratis en leuk";
    default: return "";
  }
}
