import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { activities } from "@/data/activities";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import Footer from "@/components/Footer";
import SavedItemsClient from "./SavedItemsClient";

export const metadata: Metadata = {
  title: "Opgeslagen | Berry Kids",
};

export type SavedLookupItem = {
  slug: string;
  title: string;
  image: string;
  href: string;
  meta: string;
  date?: string;
  free?: boolean;
};

export default async function OpgeslagenPage() {
  const t = await getTranslations("saved");

  // Build a complete lookup of every saveable item: activities + events
  const resolvedActivities = resolveEventImages(activities);
  const resolvedEvents = resolveEventImages(getScrapedEvents());

  const lookup: Record<string, SavedLookupItem> = {};

  for (const a of resolvedActivities) {
    lookup[a.slug] = {
      slug: a.slug,
      title: a.title,
      image: (a as { resolvedImage?: string }).resolvedImage || a.image,
      href: `/activiteiten/${a.slug}`,
      meta: `📍 ${a.location}`,
      free: a.free,
    };
  }
  for (const e of resolvedEvents) {
    if (lookup[e.slug]) continue;
    lookup[e.slug] = {
      slug: e.slug,
      title: e.title,
      image: (e as { resolvedImage?: string }).resolvedImage || e.image,
      href: `/event/${e.slug}`,
      meta: `📍 ${e.location}${e.time ? ` · ${e.time}` : ""}`,
      date: e.date,
      free: e.free,
    };
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
            ❤️ {t("badge")}
          </span>
          <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
        <SavedItemsClient lookup={lookup} />
      </main>

      <Footer />
    </div>
  );
}
