"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import SaveButton from "./SaveButton";
import WeatherChip from "./WeatherChip";

export type TopFivePick = {
  slug: string;
  title: string;
  image: string;
  category: string;
  location: string;
  free: boolean;
  ageLabel: string;
  whyNow: string;
  tags: string[];
  time?: string;
  isEvent: boolean;
};

const INTERVAL = 5000;
const NUM_COLORS = [
  "bg-[#E0685F] text-white",
  "bg-[#FFD8B0] text-[#A67A40]",
  "bg-[#C5B8E8] text-[#5B4FA0]",
  "bg-[#B8E0D4] text-[#3D7A6A]",
  "bg-[#F0ECE8] text-[#6B6B6B]",
];

type ForecastDay = {
  icon: string;
  day: string;
  tempMax: number;
  isRainy: boolean;
};

export default function TopFiveHero({
  picks,
  vibe,
  dailyMessage,
  weatherIcon,
  weatherTemp,
  weatherLabel,
  weatherReason,
  weatherForecast,
}: {
  picks: TopFivePick[];
  vibe: string;
  dailyMessage: string;
  weatherIcon: string;
  weatherTemp: number;
  weatherLabel: string;
  weatherReason: string;
  weatherForecast: ForecastDay[];
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused || picks.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((i) => {
        const next = (i + 1) % picks.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [paused, picks.length]);

  const pick = picks[current];
  if (!pick) return null;
  const href = pick.isEvent ? `/event/${pick.slug}` : `/activiteiten/${pick.slug}`;

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-8">

      {/* ===== MOBILE: Berry digest + card carousel ===== */}
      <div className="lg:hidden">
        {/* Berry daily digest */}
        <div className="pick-header-reveal pb-4 pt-2 text-center">
          <div className="mx-auto mb-3 w-fit" style={{ animation: "berry-bob 4s ease-in-out infinite", filter: "drop-shadow(0 6px 20px rgba(224,104,95,0.3))" }}>
            <Image src="/berry-wink.png" alt="Berry" width={120} height={120} className="h-24 w-auto" />
          </div>
          <p className="text-[13px] font-bold text-[#E0685F]">{vibe}</p>
          <h2 className="mt-1 text-[22px] font-black leading-[1.1] tracking-[-0.5px] text-[#2D2D2D]">
            Berry&apos;s picks vandaag
          </h2>
          <p className="mx-auto mt-2 max-w-[300px] text-[15px] font-semibold leading-snug text-[#6B6B6B]">
            {dailyMessage}
          </p>
          <div className="mt-3 flex justify-center">
            <WeatherChip
              icon={weatherIcon}
              temp={weatherTemp}
              description={weatherLabel}
              reason={weatherReason}
              forecast={weatherForecast}
            />
          </div>
        </div>

        {/* Swipeable card carousel */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
          {picks.map((p, i) => {
            const itemHref = p.isEvent ? `/event/${p.slug}` : `/activiteiten/${p.slug}`;
            return (
              <Link
                key={p.slug}
                href={itemHref}
                className={`pick-reveal pick-reveal-${i} pick-tap block w-[82vw] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all active:scale-[1.02]`}
              >
                {/* Photo */}
                <div className="relative h-[180px] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="82vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                  {/* Number badge */}
                  <span className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-[10px] text-[15px] font-black shadow-sm ${NUM_COLORS[i]}`}>
                    {i + 1}
                  </span>
                  <div className="absolute right-3 top-3">
                    <SaveButton slug={p.slug} />
                  </div>
                  {/* Berry tip on photo */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3.5 pb-3 pt-8">
                    <p className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                      <Image src="/berry-icon.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                      {p.whyNow.length > 60 ? p.whyNow.slice(0, 60) + "…" : p.whyNow}
                    </p>
                  </div>
                </div>
                {/* Info */}
                <div className="px-3.5 py-3">
                  <h3 className="text-[17px] font-extrabold leading-snug tracking-tight text-[#2D2D2D]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#6B6B6B]">📍 {p.location}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[13px] font-bold">
                      {p.free ? (
                        <span className="text-[#4A8060]">Gratis</span>
                      ) : (
                        <span className="text-[#2D2D2D]">{p.ageLabel}</span>
                      )}
                    </span>
                    <span className="rounded-full bg-[#E0685F] px-3.5 py-1.5 text-[12px] font-bold text-white">
                      Bekijk →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== DESKTOP: Hero photo + list + detail card (unchanged) ===== */}
      <div
        className="hidden lg:block"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Weather chip — top right */}
        <div className="mb-2 flex justify-end">
          <WeatherChip
            icon={weatherIcon}
            temp={weatherTemp}
            description={weatherLabel}
            reason={weatherReason}
            forecast={weatherForecast}
          />
        </div>

        <div className="relative">
          {/* Hero photo area */}
          <div className="relative h-[500px] overflow-hidden rounded-[24px]">
            {picks.map((p, i) => (
              <div
                key={p.slug}
                className={`absolute inset-0 transition-opacity duration-600 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="1320px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Left gradient */}
            <div
              className="pointer-events-none absolute inset-0 z-[2] rounded-[24px]"
              style={{
                background: "linear-gradient(to right, rgba(255,249,240,0.95) 0%, rgba(255,249,240,0.7) 32%, transparent 52%)",
              }}
            />

            {/* Save button */}
            <div className="absolute right-5 top-5 z-[5]">
              <SaveButton slug={pick.slug} />
            </div>

            {/* Detail card */}
            <div className="absolute bottom-6 right-6 z-[5] w-[380px]">
              <div key={`detail-${current}`} className="animate-fade-up rounded-[20px] bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[#E0685F]">
                  {pick.category}{pick.free ? " · Gratis" : ""}
                </p>
                <h3 className="mt-1 text-[22px] font-black leading-[1.1] tracking-[-0.4px] text-[#2D2D2D]">
                  {pick.title}
                </h3>
                <p className="mt-1.5 text-[14px] font-semibold leading-[1.45] text-[#6B6B6B]">
                  {pick.whyNow}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {pick.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
                        tag === "Gratis"
                          ? "bg-[#E8F8ED] text-[#4A8060]"
                          : "bg-[#F0ECE8] text-[#6B6B6B]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#F5F0EB] pt-3">
                  <p className="text-[13px] font-semibold text-[#6B6B6B]">
                    📍 {pick.location}{pick.time ? ` · 🕐 ${pick.time}` : ""}
                  </p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E0685F] px-4 py-2 text-[13px] font-bold text-white transition-all hover:bg-[#D05A52] hover:-translate-y-px"
                  >
                    Bekijk →
                  </Link>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute inset-x-0 bottom-0 z-[6] h-[3px] overflow-hidden rounded-b-[24px]">
              <div
                key={progressKey}
                className="h-full bg-[#E0685F]"
                style={{
                  width: "0%",
                  animation: paused ? "none" : `progressFill ${INTERVAL}ms linear forwards`,
                }}
              />
            </div>
          </div>

          {/* Top-5 list card — overlapping left */}
          <div className="absolute left-12 top-7 z-10 w-[420px] rounded-[24px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            {/* Berry header */}
            <div className="pick-header-reveal px-5 pt-6 text-center">
              <div className="mx-auto mb-2 w-fit" style={{ animation: "berry-bob 4s ease-in-out infinite", filter: "drop-shadow(0 6px 16px rgba(224,104,95,0.3))" }}>
                <Image src="/berry-wink.png" alt="Berry" width={100} height={100} className="h-20 w-auto" />
              </div>
              <p className="text-[12px] font-bold text-[#E0685F]">{vibe}</p>
              <h2 className="text-[22px] font-black leading-[1.1] tracking-[-0.4px] text-[#2D2D2D]">
                Berry&apos;s picks vandaag
              </h2>
              <p className="mt-1.5 text-[15px] font-semibold text-[#6B6B6B]">
                {dailyMessage}
              </p>
            </div>

            {/* List */}
            <div className="mt-3">
              {picks.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => goTo(i)}
                  className={`pick-reveal pick-reveal-${i} flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${i === 0 ? "pick-tap-hero" : "pick-tap"} ${
                    i === current ? "bg-[#FFF3E0]" : "hover:bg-[#FFF9F0]"
                  } ${i > 0 ? "border-t border-[#F5F0EB]" : ""}`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-black ${NUM_COLORS[i]}`}>
                    {i + 1}
                  </span>
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px]">
                    <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold leading-snug tracking-[-0.1px] text-[#2D2D2D]">
                      {p.title}
                    </p>
                    <p className="truncate text-[13px] font-semibold text-[#6B6B6B]">
                      {p.whyNow}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#F5F0EB] px-5 py-2.5 text-center">
              <Link href="/activiteiten" className="text-[12px] font-bold text-[#E0685F]">
                Alle activiteiten →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
