"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

type HeroSlide = {
  slug: string;
  title: string;
  category: string;
  image: string;
  location: string;
  free: boolean;
};

const INTERVAL = 5000;

function HeroTile({
  slide,
  large,
  active,
}: {
  slide: HeroSlide;
  large?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={`/event/${slide.slug}`}
      className="group relative block h-full w-full overflow-hidden"
    >
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        sizes={large ? "(max-width: 768px) 100vw, 75vw" : "25vw"}
        className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
          large && active ? "animate-ken-burns" : ""
        }`}
        priority={large}
      />
      <div
        className="absolute inset-0"
        style={{
          background: large
            ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />
      <div className={`absolute inset-x-0 bottom-0 ${large ? "p-6 sm:p-8" : "p-3 sm:p-4"}`}>
        <p
          className={`font-bold uppercase tracking-wide ${
            large ? "text-[14px] text-[#E0685F]" : "text-[11px] text-[#E0685F] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          }`}
        >
          {slide.category}
          {slide.free && " · Gratis"}
        </p>
        <h2
          className={`mt-1 font-extrabold leading-[1.1] tracking-tight text-white ${
            large
              ? "text-[clamp(1.5rem,3.5vw,2.6rem)]"
              : "text-[clamp(0.85rem,1.6vw,1.05rem)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
          }`}
        >
          {slide.title}
        </h2>
        {large && (
          <span className="mt-4 inline-block rounded-full bg-[#E0685F] px-6 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-[#D05A52]">
            Lees meer
          </span>
        )}
      </div>
    </Link>
  );
}

export default function HeroSlideshow({
  slides,
  heading,
  dateLine,
}: {
  slides: HeroSlide[];
  heading: string;
  dateLine: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slideCount = Math.max(slides.length - 3, 1);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-rotate, respecting reduced motion
  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next, slideCount]);

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    }

    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const mainSlide = slides[active];
  const sideSlides = slides
    .slice(active + 1, active + 4)
    .concat(slides.slice(0, Math.max(0, active + 4 - slides.length)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] pt-4 sm:px-10 sm:pt-6">
      {/* Decision heading */}
      <div className="mb-3 flex items-end justify-between px-5 sm:px-0">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#E0685F]">{dateLine}</p>
          <h1 className="mt-1 text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold tracking-tight text-[#2D2D2D]">
            {heading}
          </h1>
        </div>
        {/* Slide indicators — desktop top-right */}
        {slideCount > 1 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Ga naar slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all ${
                  i === active
                    ? "w-6 bg-[#E0685F]"
                    : "w-3 bg-[#2D2D2D]/20 hover:bg-[#2D2D2D]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid: 1 large + 3 small */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Uitgelichte evenementen"
        aria-roledescription="carousel"
        className="overflow-hidden sm:rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#E0685F] focus-visible:ring-offset-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 gap-[3px] bg-white md:grid-cols-[3fr_1fr] md:grid-rows-3">
          {/* Main hero — spans all 3 rows */}
          <div
            className="relative aspect-[16/9] md:row-span-3 md:aspect-auto md:min-h-[480px]"
            aria-live="polite"
          >
            <HeroTile slide={mainSlide} large active />
          </div>

          {/* 3 side tiles — hidden on mobile */}
          {sideSlides.map((s) => (
            <div key={s.slug} className="relative hidden md:block md:aspect-auto">
              <HeroTile slide={s} />
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators — mobile bottom */}
      {slideCount > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ga naar slide ${i + 1}`}
              className={`h-[3px] rounded-full transition-all ${
                i === active
                  ? "w-6 bg-[#E0685F]"
                  : "w-3 bg-[#2D2D2D]/20 hover:bg-[#2D2D2D]/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
