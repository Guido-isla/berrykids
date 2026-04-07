"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SaveButton from "./SaveButton";

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
  "bg-[#F4A09C] text-white",
  "bg-[#FFD8B0] text-[#A67A40]",
  "bg-[#C5B8E8] text-[#5B4FA0]",
  "bg-[#B8E0D4] text-[#3D7A6A]",
  "bg-[#F0ECE8] text-[#6B6B6B]",
];

export default function TopFiveHero({
  picks,
  vibe,
  weatherIcon,
  weatherTemp,
  weatherLabel,
  totalActivities,
}: {
  picks: TopFivePick[];
  vibe: string;
  weatherIcon: string;
  weatherTemp: number;
  weatherLabel: string;
  totalActivities: number;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={heroRef}
      className="mx-auto max-w-[1320px] px-5 pt-2 sm:px-8 sm:pt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        {/* Hero photo area */}
        <div className="relative h-[280px] overflow-hidden rounded-[24px] sm:h-[400px] lg:h-[500px]">
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
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Left gradient — fades into top-5 card */}
          <div
            className="pointer-events-none absolute inset-0 z-[2] rounded-[24px] hidden lg:block"
            style={{
              background: "linear-gradient(to right, rgba(255,249,240,0.95) 0%, rgba(255,249,240,0.7) 32%, transparent 52%)",
            }}
          />

          {/* Save button */}
          <div className="absolute right-5 top-5 z-[5]">
            <SaveButton slug={pick.slug} />
          </div>

          {/* Detail card — desktop only */}
          <div className="absolute bottom-6 right-6 z-[5] hidden w-[380px] lg:block">
            <div key={`detail-${current}`} className="animate-fade-up rounded-[20px] bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#F4A09C]">
                {pick.category}{pick.free ? " \u00b7 Gratis" : ""}
              </p>
              <h3 className="mt-1 text-[22px] font-black leading-[1.1] tracking-[-0.4px] text-[#2D2D2D]">
                {pick.title}
              </h3>
              <p className="mt-1.5 text-[13px] font-semibold leading-[1.45] text-[#6B6B6B]">
                {pick.whyNow}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {pick.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
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
                <p className="text-[12px] font-semibold text-[#6B6B6B]">
                  📍 {pick.location}{pick.time ? ` \u00b7 🕐 ${pick.time}` : ""}
                </p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F4A09C] px-4 py-2 text-[12px] font-bold text-white transition-all hover:bg-[#E88E8A] hover:-translate-y-px"
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
              className="h-full bg-[#F4A09C]"
              style={{
                width: "0%",
                animation: paused ? "none" : `progressFill ${INTERVAL}ms linear forwards`,
              }}
            />
          </div>
        </div>

        {/* Top-5 card — overlapping left on desktop, below photo on mobile */}
        <div className="relative z-10 -mt-8 mx-4 rounded-[24px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] lg:absolute lg:left-12 lg:top-7 lg:mt-0 lg:mx-0 lg:w-[400px]">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 pt-5">
            <div className="shrink-0" style={{ animation: "berry-bob 4s ease-in-out infinite", filter: "drop-shadow(0 4px 10px rgba(244,160,156,0.2))" }}>
              <Image src="/berry-wink.png" alt="Berry" width={48} height={48} className="h-12 w-auto" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F4A09C]">{vibe}</p>
              <h2 className="text-[20px] font-black leading-[1.1] tracking-[-0.4px] text-[#2D2D2D]">
                Berry&apos;s top 5 vandaag
              </h2>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-0.5 text-[10px] font-bold text-[#A67A40]">
                {weatherIcon} {weatherTemp}°C · {weatherLabel}
              </span>
            </div>
          </div>

          {/* List */}
          <div className="mt-2">
            <p className="px-5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#A09488]">
              Berry&apos;s keuzes
            </p>

            {picks.map((p, i) => {
              const itemHref = p.isEvent ? `/event/${p.slug}` : `/activiteiten/${p.slug}`;
              return (
                <button
                  key={p.slug}
                  onClick={() => goTo(i)}
                  className={`flex w-full items-center gap-2 px-5 py-2 text-left transition-colors ${
                    i === current ? "bg-[#FFF3E0]" : "hover:bg-[#FFF9F0]"
                  } ${i > 0 ? "border-t border-[#F5F0EB]" : ""}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[12px] font-black ${NUM_COLORS[i]}`}>
                    {i + 1}
                  </span>
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px]">
                    <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold leading-snug tracking-[-0.1px] text-[#2D2D2D]">
                      {p.title}
                    </p>
                    <p className="truncate text-[12px] font-semibold text-[#6B6B6B]">
                      {p.whyNow}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F5F0EB] px-5 py-2.5 text-center">
            <Link href="/activiteiten" className="text-[11px] font-bold text-[#F4A09C]">
              Alle {totalActivities} activiteiten →
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile detail — shown below card */}
      <div className="mt-3 lg:hidden">
        <Link
          href={href}
          className="block rounded-[20px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#F4A09C]">
            {pick.category}{pick.free ? " · Gratis" : ""}
          </p>
          <h3 className="mt-1 text-[18px] font-black leading-[1.1] text-[#2D2D2D]">
            {pick.title}
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-[#6B6B6B]">{pick.whyNow}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[12px] text-[#6B6B6B]">📍 {pick.location}</p>
            <span className="rounded-full bg-[#F4A09C] px-4 py-2 text-[12px] font-bold text-white">
              Bekijk →
            </span>
          </div>
        </Link>
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
