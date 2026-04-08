import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import ActivityCard from "@/components/ActivityCard";
import TopFiveHero from "@/components/TopFiveHero";
import type { TopFivePick, MoodKey } from "@/components/TopFiveHero";
import { getScrapedEvents, getDayPlanEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveAct } from "@/lib/photos";
import { generateBerryDayPlan, scoreEvent, scoreActivity } from "@/lib/berry-brain";

// Revalidate every 30 minutes — keeps weather, events and dagplan fresh
export const revalidate = 1800;

export default async function Home() {
  const allEvents = getScrapedEvents();
  const todayEvents = getDayPlanEvents();
  const ctx = await getSiteContext();

  const todayWithImg = resolveEventImages(todayEvents).filter((e) => e.image !== "/berry-icon.png");
  const allWithImg = resolveEventImages(allEvents).filter((e) => e.image !== "/berry-icon.png");

  const outdoorEvents = todayWithImg.filter((e) => !e.indoor);
  const indoorEvents = todayWithImg.filter((e) => e.indoor);

  const preferIndoor = ctx.berryPick.preferIndoor;
  const primaryEvents = preferIndoor
    ? [...indoorEvents, ...outdoorEvents]
    : [...outdoorEvents, ...indoorEvents];
  const topPick = primaryEvents[0] || todayWithImg[0];

  const dayPlanEvents = getDayPlanEvents();
  const dayPlan = generateBerryDayPlan(ctx, dayPlanEvents, activities, ctx.season.suggestions);

  const tomorrow = ctx.weather.forecast[1];
  let tomorrowFlip: string | null = null;
  if (tomorrow) {
    const todayRainy = ctx.weather.isRainy;
    const tomorrowRainy = tomorrow.isRainy;
    if (!todayRainy && tomorrowRainy) {
      tomorrowFlip = `🌧️ Morgen regent het — pak vandaag mee`;
    } else if (todayRainy && !tomorrowRainy) {
      tomorrowFlip = `☀️ Morgen ${tomorrow.tempMax}°C en droog — bewaar buiten voor morgen`;
    } else if (!todayRainy && !tomorrowRainy && tomorrow.tempMax >= 18 && ctx.weather.current.temp < 16) {
      tomorrowFlip = `☀️ Morgen ${tomorrow.tempMax}°C — nog mooier dan vandaag`;
    }
  }

  const allOutdoor = allWithImg.filter((e) => !e.indoor);
  const allIndoor = allWithImg.filter((e) => e.indoor);
  const fallbackEvents = preferIndoor ? allOutdoor.slice(0, 3) : allIndoor.slice(0, 3);
  const fallbackLabel = preferIndoor ? "Als het toch opklaart" : "Als het weer omslaat";

  const sportAct = resolveAct(activities.filter((a) => a.category === "sport" && a.verified).slice(0, 3));
  const cultAct = resolveAct(activities.filter((a) => (a.category === "cultuur" || a.category === "indoor") && a.verified).slice(0, 3));

  const planLines = dayPlan.message.split("\n\n").filter(Boolean);

  // Also good today — 2 alts
  const alsoGood = primaryEvents.slice(1, 3);
  const verifiedActs = resolveAct(
    activities.filter((a) => a.verified && (!a.availableMonths || a.availableMonths.includes(new Date().getMonth() + 1)))
  );
  const matchedActs = preferIndoor
    ? verifiedActs.filter((a) => a.category === "indoor" || a.category === "cultuur")
    : verifiedActs.filter((a) => a.category === "natuur" || a.category === "dieren" || a.category === "sport");
  while (alsoGood.length < 2 && matchedActs.length > 0) {
    const act = matchedActs.shift()!;
    if (!alsoGood.some((e) => e.title === act.title)) {
      alsoGood.push({ ...act, date: "", time: "", indoor: act.category === "indoor" || act.category === "cultuur", slug: act.slug, image: act.resolvedImage || act.image } as typeof primaryEvents[0]);
    }
  }

  const weatherMood = ctx.weather.isRainy ? "rainy" as const : ctx.weather.current.temp < 8 ? "cold" as const : "sunny" as const;

  // --- Build top 5 picks per mood for the ATF hero ---
  const currentMonth = new Date().getMonth() + 1;
  const verifiedAvailable = activities.filter(
    (a) => a.verified && (!a.availableMonths || a.availableMonths.includes(currentMonth))
  );
  const scoredEvents = todayWithImg.map((e) => ({
    item: e,
    score: scoreEvent(e, ctx),
    isEvent: true as const,
  }));
  const scoredActivities = resolveAct(verifiedAvailable).map((a) => ({
    item: a,
    score: scoreActivity(a, ctx),
    isEvent: false as const,
  }));
  const allScored = [...scoredEvents, ...scoredActivities]
    .filter((s) => s.item.image && s.item.image !== "/berry-icon.png")
    .sort((a, b) => b.score - a.score);

  function toPickItem(s: (typeof allScored)[number]): TopFivePick {
    const item = s.item as Record<string, unknown>;
    const tags: string[] = [];
    if (item.free) tags.push("Gratis");
    tags.push(item.ageLabel as string);
    return {
      slug: item.slug as string,
      title: item.title as string,
      image: (item.resolvedImage as string) || (item.image as string),
      category: (item.subcategory as string) || (item.category as string),
      location: item.location as string,
      free: item.free as boolean,
      ageLabel: item.ageLabel as string,
      whyNow: (item.tip as string) || (item.description as string)?.slice(0, 80) || "",
      tags,
      time: item.time as string | undefined,
      isEvent: s.isEvent,
    };
  }

  function pickTop5(items: typeof allScored): TopFivePick[] {
    const seen = new Set<string>();
    const result: TopFivePick[] = [];
    for (const s of items) {
      const title = (s.item as Record<string, unknown>).title as string;
      if (seen.has(title)) continue;
      seen.add(title);
      result.push(toPickItem(s));
      if (result.length >= 5) break;
    }
    return result;
  }

  const ENERGY_KEYWORDS = ["sport", "Speeltuin", "Trampolinepark", "Binnenspeeltuin", "Megaspeeltuin", "Klimhal", "Padel", "Surfen", "Boulderen"];
  const RUSTIG_KEYWORDS = ["cultuur", "Museum", "Bibliotheek", "Landgoed", "Rondvaart", "Theater", "Bioscoop"];

  const picksByMood: Record<MoodKey, TopFivePick[]> = {
    berry: pickTop5(allScored),
    buiten: pickTop5(allScored.filter((s) => {
      const item = s.item as Record<string, unknown>;
      const cat = item.category as string;
      const indoor = "indoor" in item ? item.indoor : (cat === "indoor" || cat === "cultuur");
      return !indoor;
    })),
    binnen: pickTop5(allScored.filter((s) => {
      const item = s.item as Record<string, unknown>;
      const cat = item.category as string;
      const indoor = "indoor" in item ? item.indoor : (cat === "indoor" || cat === "cultuur");
      return indoor;
    })),
    energie: pickTop5(allScored.filter((s) => {
      const item = s.item as Record<string, unknown>;
      const cat = item.category as string;
      const sub = (item.subcategory as string) || "";
      return ENERGY_KEYWORDS.some((k) => cat.includes(k) || sub.includes(k));
    })),
    rustig: pickTop5(allScored.filter((s) => {
      const item = s.item as Record<string, unknown>;
      const cat = item.category as string;
      const sub = (item.subcategory as string) || "";
      return RUSTIG_KEYWORDS.some((k) => cat.includes(k) || sub.includes(k));
    })),
    gratis: pickTop5(allScored.filter((s) => {
      return (s.item as Record<string, unknown>).free as boolean;
    })),
    bijzonder: pickTop5(allScored.filter((s) => {
      const item = s.item as Record<string, unknown>;
      const sub = (item.subcategory as string) || "";
      return ["Linnaeushof", "Rondvaart", "Speelbos", "Festival", "Theaterkamp", "Surfles"].some((k) => sub.includes(k)) || (item.featured as boolean);
    })),
  };

  return (
    <div className="min-h-screen">

      {/* ===== HEADER ===== */}
      <Header />

      {/* ===== TOP 5 HERO — ATF ===== */}
      <TopFiveHero
        picksByMood={picksByMood}
        vibe={dayPlan.vibe}
        weatherIcon={ctx.weather.current.icon}
        weatherTemp={ctx.weather.current.temp}
        weatherLabel={ctx.weather.current.description}
        weatherReason={ctx.berryPick.reason}
        weatherForecast={ctx.weather.forecast.slice(1, 5).map((d) => ({
          icon: d.icon,
          day: ["zo","ma","di","wo","do","vr","za"][new Date(d.date + "T00:00:00").getDay()],
          tempMax: d.tempMax,
          isRainy: d.isRainy,
        }))}
        totalActivities={activities.filter((a) => a.verified).length}
      />

      {/* Tomorrow flip */}
      {tomorrowFlip && (
        <div className="mx-auto mt-3 max-w-[1320px] px-5 sm:px-8">
          <div className="rounded-[14px] bg-[#EDE7F6] px-5 py-2.5 text-center text-[12px] font-bold text-[#7B6BA0]">
            {tomorrowFlip}
          </div>
        </div>
      )}

      {/* ===== VANDAAG — more events (excluding top 5) ===== */}
      {(() => {
        const top5Slugs = new Set(picksByMood.berry.map((p) => p.slug));
        const ookGoed = primaryEvents.filter((e) => !top5Slugs.has(e.slug)).slice(0, 4);
        if (ookGoed.length === 0) return null;
        return (
        <section className="mx-auto max-w-[880px] px-5 pb-10 pt-6 sm:px-6">
          <h2 className="mb-4 text-[22px] font-extrabold tracking-tight text-[#2D2D2D]">Ook goed vandaag</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible">
            {ookGoed.map((e) => {
              const tip = e.free && !e.indoor
                ? "Gratis en lekker buiten — ga nu"
                : e.free && e.indoor
                ? "Gratis en gezellig binnen"
                : !e.indoor && ctx.weather.isGoodWeather
                ? "Perfect weer hiervoor"
                : e.indoor && ctx.weather.isRainy
                ? "Ideaal voor een regendag"
                : e.free
                ? "Gratis — altijd goed"
                : "Berry aanrader voor vandaag";
              return <div key={e.slug} className="w-[75vw] shrink-0 sm:w-auto"><EventCard event={e} berryTip={tip} /></div>;
            })}
          </div>
        </section>
        );
      })()}

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-[880px] px-5 py-10 sm:px-6">
        <div className="rounded-[24px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mx-auto max-w-md text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F4A09C]">Elke vrijdag om 15:00</p>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#2D2D2D]">Weekend gepland in 2 minuten</h2>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">De 5 leukste tips. Geen zoeken. Gewoon gaan.</p>
            <div className="mt-5"><NewsletterForm variant="personalize" /></div>
            <p className="mt-2 text-[12px] text-[#A09488]">2.340+ ouders · gratis</p>
          </div>
        </div>
      </section>

      {/* ===== FALLBACK — if weather changes ===== */}
      {fallbackEvents.length > 0 && (
        <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#A09488]">{fallbackLabel}</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {fallbackEvents.map((e) => <div key={e.slug + "-fb"} className="w-[75vw] shrink-0 sm:w-auto"><EventCard event={e} /></div>)}
          </div>
        </section>
      )}

      {/* ===== FILMS ===== */}
      <div className="mx-auto max-w-[880px] px-5 py-8 sm:px-6">
        <FilmVanDeWeek />
      </div>

      {/* ===== THEATER ===== */}
      <div className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
        <TheaterAgenda />
      </div>

      {/* ===== MEER ONTDEKKEN ===== */}
      <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#A09488]">Meer ontdekken</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {[...sportAct, ...cultAct].slice(0, 6).map((a) => <div key={a.slug} className="w-[70vw] shrink-0 sm:w-auto"><ActivityCard activity={a} /></div>)}
        </div>
      </section>

      {/* ===== MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
        <Link href="/vakanties" className="group block rounded-[24px] bg-gradient-to-r from-[#F4A09C] to-[#FFD8B0] p-7 transition-shadow hover:shadow-lg sm:p-9">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white">26 april – 9 mei</p>
          <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#2D2D2D]">Meivakantie — jouw weekplan</h2>
          <p className="mt-2 max-w-md text-[14px] text-[#2D2D2D]/70">Dagplannen, surfcamps en meer.</p>
          <span className="mt-4 inline-block text-[14px] font-bold text-white">Bekijk dagplannen →</span>
        </Link>
      </section>

      {/* ===== BOTTOM NEWSLETTER ===== */}
      <section id="newsletter" className="border-t border-[#F0ECE8]">
        <div className="mx-auto max-w-[880px] px-5 py-14 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="mx-auto mb-3 h-12 w-auto" />
            <h2 className="text-[24px] font-extrabold tracking-tight text-[#2D2D2D]">Weekend sorted</h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">Elke vrijdag om 15:00. 5 tips. Klaar.</p>
            <div className="mt-5"><NewsletterForm /></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
