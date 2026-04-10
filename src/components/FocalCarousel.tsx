import type { ReactNode } from "react";

export type FocalCarouselProps = {
  children: ReactNode;
  /** Tailwind grid classes used on desktop (lg+). Default: 2-3-4 column grid */
  desktopGrid?: string;
};

/**
 * Mobile: focal carousel — snap-scroll with peek + scale tween (Strava-style).
 * Desktop (lg+): falls back to a normal grid.
 *
 * The scale tween uses CSS scroll-driven animations (Chrome 115+, Safari 18+).
 * Older browsers degrade gracefully to a plain snap-scroll carousel.
 */
export default function FocalCarousel({
  children,
  desktopGrid = "lg:grid lg:grid-cols-3 lg:gap-4",
}: FocalCarouselProps) {
  return (
    <div
      className={`focal-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pl-4 pr-[15vw] scrollbar-none lg:block lg:overflow-visible lg:px-0 lg:pb-0 ${desktopGrid}`}
    >
      {children}
    </div>
  );
}
