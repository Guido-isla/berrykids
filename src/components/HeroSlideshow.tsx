"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

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
}: {
  slide: HeroSlide;
  large?: boolean;
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
        sizes={large ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 50vw, 20vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        priority={large}
      />
      <div
        className="absolute inset-0"
        style={{
          background: large
            ? "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />
      <div className={`absolute inset-x-0 bottom-0 ${large ? "p-6 sm:p-8" : "p-4 sm:p-5"}`}>
        <p
          className={`font-bold uppercase tracking-wide text-[#E85A5A] ${
            large ? "text-[13px]" : "text-[11px]"
          }`}
        >
          {slide.category}
          {slide.free && " · Gratis"}
        </p>
        <h2
          className={`mt-1.5 font-extrabold leading-[1.1] tracking-tight text-white ${
            large
              ? "text-[clamp(1.5rem,3.5vw,2.6rem)]"
              : "text-[clamp(0.95rem,1.8vw,1.15rem)]"
          }`}
        >
          {slide.title}
        </h2>
        {large && (
          <span className="mt-4 inline-block rounded-full bg-[#E85A5A] px-6 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-[#D04A4A]">
            Lees meer
          </span>
        )}
      </div>
    </Link>
  );
}

export default function HeroSlideshow({
  slides,
  dateLine,
}: {
  slides: HeroSlide[];
  dateLine: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % Math.max(slides.length - 3, 1));
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 4) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next, slides.length]);

  const mainSlide = slides[active];
  const sideSlides = slides.slice(active + 1, active + 4).concat(
    // wrap around if needed
    slides.slice(0, Math.max(0, active + 4 - slides.length))
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-6 sm:px-10">
      {/* Date line */}
      <p className="mb-3 text-[13px] font-semibold text-[#888]">{dateLine}</p>

      {/* Grid: 1 large + 3 small, tight gap, rounded outer */}
      <div
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 gap-[3px] bg-white md:grid-cols-[3fr_1fr] md:grid-rows-3">
          {/* Main hero — spans all 3 rows */}
          <div className="relative aspect-[16/10] md:row-span-3 md:aspect-auto md:min-h-[480px]">
            <HeroTile slide={mainSlide} large />
          </div>

          {/* 3 side tiles */}
          {sideSlides.map((s) => (
            <div key={s.slug} className="relative aspect-[16/9] md:aspect-auto">
              <HeroTile slide={s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
