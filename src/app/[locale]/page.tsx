import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import BerryCard from "@/components/BerryCard";
import ScrollCTA from "@/components/ScrollCTA";
import TopFiveHero from "@/components/TopFiveHero";
import type { TopFivePick } from "@/components/TopFiveHero";
import { getDayPlanEvents, getWeekendEvents, getScrapedEvents } from "@/data/events-loader";
import { formatShortDate } from "@/lib/dates";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveAct } from "@/lib/photos";
import { generateBerryDayPlan, scoreEvent, scoreActivity, enforceVariety } from "@/lib/berry-brain";

export const revalidate = 1800;

/** Generate a Berry tip — uses translation keys */
function generateBerryTip(
  item: Record<string, unknown>,
  ctx: { weather: { isGoodWeather: boolean; isRainy: boolean } },
  t: (key: string, params?: Record<string, string>) => string
): string {
  const sub = (item.subcategory as string) || "";
  const free = item.free as boolean;
  const indoor = item.indoor as boolean | undefined;

  if (sub.includes("Speeltuin")) return t("tipPlayground");
  if (sub.includes("Museum")) return t("tipMuseum");
  if (sub.includes("Strand")) return t("tipBeach");
  if (sub.includes("Kinderboerderij")) return t("tipFarm");
  if (sub.includes("Zwemmen") || sub.includes("Subtropisch")) return t("tipSwim");
  if (sub.includes("Klimmen") || sub.includes("Boulderen")) return t("tipClimb");
  if (sub.includes("Bioscoop")) return t("tipCinema");
  if (sub.includes("Bibliotheek")) return t("tipLibrary");
  if (sub.includes("Landgoed")) return t("tipEstate");
  if (sub.includes("Wandelen")) return t("tipHike");
  if (sub.includes("Surfen") || sub.includes("Suppen")) return t("tipSurf");
  if (sub.includes("Trampolinepark")) return t("tipTrampoline");
  if (sub.includes("Rondvaart")) return t("tipBoat");
  if (sub.includes("Escape Room")) return t("tipEscape");
  if (sub.includes("Bowling") || sub.includes("Midgetgolf")) return t("tipRainyDay");
  if (free && !indoor && ctx.weather.isGoodWeather) return t("tipFreeOutdoor");
  if (free && indoor) return t("tipFreeIndoor");
  if (free) return t("tipFree");
  return t("tipDefault", { location: item.location as string });
}

export default async function Home() {
  const todayEvents = getDayPlanEvents();
  const ctx = await getSiteContext();

  const todayWithImg = resolveEventImages(todayEvents).filter((e) => e.image !== "/berry-icon.png");

  const dayPlan = generateBerryDayPlan(ctx, todayEvents, activities, ctx.season.suggestions);

  const tomorrow = ctx.weather.forecast[1];
  let tomorrowFlip: string | null = null;
  if (tomorrow) {
    const todayRainy = ctx.weather.isRainy;
    const tomorrowRainy = tomorrow.isRainy;
    if (!todayRainy && tomorrowRainy) tomorrowFlip = `🌧️ Morgen regent het — pak vandaag mee`;
    else if (todayRainy && !tomorrowRainy) tomorrowFlip = `☀️ Morgen ${tomorrow.tempMax}°C en droog — bewaar buiten voor morgen`;
    else if (!todayRainy && !tomorrowRainy && tomorrow.tempMax >= 18 && ctx.weather.current.temp < 16) tomorrowFlip = `☀️ Morgen ${tomorrow.tempMax}°C — nog mooier dan vandaag`;
  }

  // === SCORE ALL ITEMS ===
  const currentMonth = new Date().getMonth() + 1;
  const verifiedAvailable = activities.filter(
    (a) => a.verified && (!a.availableMonths || a.availableMonths.includes(currentMonth))
  );
  const scoredEvents = todayWithImg.map((e) => ({ item: e, score: scoreEvent(e, ctx), isEvent: true as const }));
  const scoredActivities = resolveAct(verifiedAvailable).map((a) => ({ item: a, score: scoreActivity(a, ctx), isEvent: false as const }));
  const allScored = [...scoredEvents, ...scoredActivities]
    .filter((s) => s.item.image && s.item.image !== "/berry-icon.png")
    .sort((a, b) => b.score - a.score);

  // === TRANSLATIONS ===
  const tBerry = await getTranslations("berry");
  const tHome = await getTranslations("home");
  const tNewsletter = await getTranslations("newsletter");

  // === PROGRESSIVE DEDUP: build each section from remaining pool ===
  const usedSlugs = new Set<string>();

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
      whyNow: generateBerryTip(item, ctx, tBerry),
      tags,
      time: item.time as string | undefined,
      isEvent: s.isEvent,
    };
  }

  function pickTopN(items: typeof allScored, n: number): TopFivePick[] {
    // Enforce variety: max 3 per subcategory
    const diverse = enforceVariety(
      items.filter((s) => !usedSlugs.has((s.item as Record<string, unknown>).slug as string)),
      (s) => ((s.item as Record<string, unknown>).subcategory as string) || ((s.item as Record<string, unknown>).category as string),
      3,
      n,
    );
    return diverse.map(toPickItem);
  }

  function toBerryCardProps(pick: TopFivePick) {
    const item = allScored.find((s) => (s.item as Record<string, unknown>).slug === pick.slug);
    const raw = item ? (item.item as Record<string, unknown>) : {};
    return {
      slug: pick.slug,
      title: pick.title,
      image: pick.image,
      location: pick.location,
      free: pick.free,
      price: (raw.price as string) || undefined,
      berryTip: generateBerryTip(raw, ctx, tBerry),
      href: pick.isEvent ? `/event/${pick.slug}` : `/activiteiten/${pick.slug}`,
    };
  }

  // 1. BERRY'S PICKS — top 5
  const berryPicks = pickTopN(allScored, 5);
  berryPicks.forEach((p) => usedSlugs.add(p.slug));

  // 2. BUITEN — 8 outdoor, not in picks
  const outdoorScored = allScored.filter((s) => {
    const item = s.item as Record<string, unknown>;
    const cat = item.category as string;
    const indoor = "indoor" in item ? item.indoor : (cat === "indoor" || cat === "cultuur");
    return !indoor;
  });
  const buitenPicks = pickTopN(outdoorScored, 8);
  buitenPicks.forEach((p) => usedSlugs.add(p.slug));

  // 3. BINNEN — 6 indoor, not in picks or buiten
  const indoorScored = allScored.filter((s) => {
    const item = s.item as Record<string, unknown>;
    const cat = item.category as string;
    const indoor = "indoor" in item ? item.indoor : (cat === "indoor" || cat === "cultuur");
    return indoor;
  });
  const binnenPicks = pickTopN(indoorScored, 6);
  binnenPicks.forEach((p) => usedSlugs.add(p.slug));

  // 4. MEER ONTDEKKEN — 6 from remaining
  const meerPicks = pickTopN(allScored, 6);

  // === BERRY INTROS ===
  const w = { icon: ctx.weather.current.icon, temp: String(ctx.weather.current.temp), description: ctx.weather.current.description.toLowerCase() };
  const dailyMessage = ctx.weather.isRainy
    ? tBerry("dailyRain", w)
    : ctx.weather.isGoodWeather && ctx.weather.current.temp >= 18
    ? tBerry("dailyHot", w)
    : ctx.weather.isGoodWeather
    ? tBerry("dailyDry", w)
    : ctx.weather.current.temp < 8
    ? tBerry("dailyCold", w)
    : tBerry("dailyDefault", w);

  const buitenIntro = ctx.weather.isGoodWeather
    ? tBerry("outdoorGood")
    : ctx.weather.isRainy
    ? tBerry("outdoorRain")
    : tBerry("outdoorDefault");

  const binnenIntro = ctx.weather.isRainy
    ? tBerry("indoorRain")
    : ctx.weather.isGoodWeather
    ? tBerry("indoorGood")
    : tBerry("indoorDefault");

  // === UPCOMING EVENTS ===
  const today = new Date().toISOString().split("T")[0];
  const allUpcoming = resolveEventImages(getScrapedEvents().filter((e) => e.date >= today));
  // Prioritize one-off events (festivals, markets, concerts) over recurring (films, theater)
  const WEEKEND_PRIORITY: Record<string, number> = {
    Festival: 0, Markt: 0, Event: 1, Concert: 2, Theater: 3, Film: 4,
  };
  const weekendEventsRaw = resolveEventImages(getWeekendEvents())
    .filter((e) => e.image !== "/berry-icon.png")
    .sort((a, b) => (WEEKEND_PRIORITY[a.category] ?? 1) - (WEEKEND_PRIORITY[b.category] ?? 1));
  // Deduplicate by title — keep first occurrence, allow dupes only if < 4 unique
  const weekendSeenTitles = new Set<string>();
  const weekendUnique = weekendEventsRaw.filter((e) => {
    if (weekendSeenTitles.has(e.title)) return false;
    weekendSeenTitles.add(e.title);
    return true;
  });
  const weekendEvents = weekendUnique.length >= 4
    ? weekendUnique.slice(0, 4)
    : weekendEventsRaw.slice(0, 4);

  // "Binnenkort" — events 2+ days from now, excluding weekend events already shown
  const twoDaysOut = new Date();
  twoDaysOut.setDate(twoDaysOut.getDate() + 2);
  const twoDaysStr = twoDaysOut.toISOString().split("T")[0];
  const weekendSlugs = new Set(weekendEvents.map((e) => e.slug));
  const binnenkortEvents = allUpcoming
    .filter((e) => e.date >= twoDaysStr && !weekendSlugs.has(e.slug) && e.image !== "/berry-icon.png" && (e.resolvedImage || e.image) !== "/berry-icon.png")
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* ===== 1. BERRY'S PICKS — ATF ===== */}
      <TopFiveHero
        picks={berryPicks}
        vibe={dayPlan.vibe}
        dailyMessage={dailyMessage}
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
      />

      {/* Tomorrow flip */}
      {tomorrowFlip && (
        <div className="mx-auto mt-3 max-w-[1320px] px-4 sm:px-8">
          <div className="rounded-[14px] bg-[#EDE7F6] px-4 py-2.5 text-center text-[13px] font-bold text-[#7B6BA0]">
            {tomorrowFlip}
          </div>
        </div>
      )}

      {/* ===== 2. DIT WEEKEND ===== */}
      {weekendEvents.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">📅 Dit weekend</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">Wat er dit weekend te doen is</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {weekendEvents.map((e) => (
              <Link key={e.slug} href={`/event/${e.slug}`} className="group w-[75vw] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 sm:w-auto">
                <div className="relative h-[160px] overflow-hidden">
                  <Image
                    src={e.resolvedImage || e.image}
                    alt={e.title}
                    fill
                    sizes="(max-width: 768px) 75vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Date badge */}
                  <div className="absolute left-3 top-3 flex flex-col items-center rounded-[12px] bg-white/90 px-2.5 py-1.5 text-center backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase text-[#E0685F]">
                      {formatShortDate(e.date).split(" ")[0]}
                    </span>
                    <span className="text-[18px] font-black leading-none text-[#2D2D2D]">
                      {new Date(e.date + "T00:00:00").getDate()}
                    </span>
                  </div>
                  {e.free && (
                    <span className="absolute right-3 top-3 rounded-full bg-[#4A8060] px-2 py-0.5 text-[10px] font-bold text-white">Gratis</span>
                  )}
                </div>
                <div className="px-3.5 py-3">
                  <h3 className="text-[15px] font-extrabold leading-snug text-[#2D2D2D] group-hover:text-[#E0685F]">{e.title}</h3>
                  <p className="mt-0.5 text-[13px] text-[#6B6B6B]">📍 {e.location} · {e.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 3. BUITEN TIPS ===== */}
      {buitenPicks.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("outdoorTitle")}</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{buitenIntro}</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
            {buitenPicks.map((p) => (
              <div key={p.slug} className="w-[70vw] shrink-0 sm:w-auto">
                <BerryCard {...toBerryCardProps(p)} />
              </div>
            ))}
            <div className="w-[60vw] shrink-0 sm:w-auto">
              <ScrollCTA emoji="🌳" label="Meer buiten ontdekken" href="/activiteiten?mood=buiten" />
            </div>
          </div>
        </section>
      )}

      {/* ===== 3. NEWSLETTER ===== */}
      <section className="mx-auto max-w-[880px] px-4 py-10 sm:px-6">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mx-auto max-w-md text-center">
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#E0685F]">{tNewsletter("frequency")}</p>
            <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[24px]">{tNewsletter("headline")}</h2>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">{tNewsletter("subtitle")}</p>
            <div className="mt-5"><NewsletterForm variant="personalize" /></div>
            <p className="mt-2 text-[12px] text-[#A09488]">{tNewsletter("subscriberCount")}</p>
          </div>
        </div>
      </section>

      {/* ===== 4. FILMS ===== */}
      <section className="mx-auto max-w-[880px] px-4 pb-8 sm:px-6">
        <FilmVanDeWeek />
      </section>

      {/* ===== 5. BINNENKORT — upcoming events ===== */}
      {binnenkortEvents.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pb-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">📆 Binnenkort</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">De komende weken in de regio</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {binnenkortEvents.map((e) => {
              const berryTip = generateBerryTip(e as unknown as Record<string, unknown>, ctx, tBerry);
              return (
                <Link key={e.slug} href={`/event/${e.slug}`} className="group flex h-full w-[75vw] shrink-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 sm:w-auto">
                  <div className="relative h-[160px] shrink-0 overflow-hidden">
                    <Image
                      src={e.resolvedImage || e.image}
                      alt={e.title}
                      fill
                      sizes="(max-width: 768px) 75vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {/* Date badge */}
                    <div className="absolute left-3 top-3 flex flex-col items-center rounded-[12px] bg-white/90 px-2.5 py-1.5 text-center backdrop-blur-sm">
                      <span className="text-[10px] font-bold uppercase text-[#E0685F]">
                        {formatShortDate(e.date).split(" ")[0]}
                      </span>
                      <span className="text-[18px] font-black leading-none text-[#2D2D2D]">
                        {new Date(e.date + "T00:00:00").getDate()}
                      </span>
                    </div>
                    {e.free && (
                      <span className="absolute right-3 top-3 rounded-full bg-[#4A8060] px-2 py-0.5 text-[10px] font-bold text-white">Gratis</span>
                    )}
                    {/* Berry tip overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2.5 pt-6">
                      <p className="flex items-center gap-1 text-[12px] font-bold leading-snug text-white">
                        <Image src="/berry-icon.png" alt="" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
                        {berryTip}
                      </p>
                    </div>
                  </div>
                  <div className="px-3.5 py-3">
                    <h3 className="line-clamp-1 text-[15px] font-extrabold leading-snug text-[#2D2D2D] group-hover:text-[#E0685F]">{e.title}</h3>
                    <p className="mt-0.5 truncate text-[13px] text-[#6B6B6B]">📍 {e.location}{e.time ? ` · ${e.time}` : ""}</p>
                  </div>
                </Link>
              );
            })}
            <div className="w-[60vw] shrink-0 sm:w-auto">
              <ScrollCTA emoji="📆" label="Alle evenementen" href="/evenementen" />
            </div>
          </div>
        </section>
      )}

      {/* ===== 6. BINNEN TIPS ===== */}
      {binnenPicks.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pb-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("indoorTitle")}</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{binnenIntro}</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {binnenPicks.map((p) => (
              <div key={p.slug} className="w-[70vw] shrink-0 sm:w-auto">
                <BerryCard {...toBerryCardProps(p)} />
              </div>
            ))}
            <div className="w-[60vw] shrink-0 sm:w-auto">
              <ScrollCTA emoji="🏠" label="Meer binnen ontdekken" href="/activiteiten?mood=binnen" />
            </div>
          </div>
        </section>
      )}

      {/* ===== 6. THEATER ===== */}
      <section className="mx-auto max-w-[880px] px-4 pb-10 sm:px-8">
        <TheaterAgenda />
      </section>

      {/* ===== 7. MEER ONTDEKKEN ===== */}
      {meerPicks.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pb-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("discoverTitle")}</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{tHome("discoverSub")}</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {meerPicks.map((p) => (
              <div key={p.slug} className="w-[70vw] shrink-0 sm:w-auto">
                <BerryCard {...toBerryCardProps(p)} />
              </div>
            ))}
            <div className="w-[60vw] shrink-0 sm:w-auto">
              <ScrollCTA emoji="" label="Alle activiteiten" href="/activiteiten" useLogo />
            </div>
          </div>
        </section>
      )}

      {/* ===== 8. MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-[880px] px-4 pb-10 sm:px-6">
        <Link href="/vakanties" className="group block rounded-[24px] bg-gradient-to-r from-[#E0685F] to-[#FFD8B0] p-6 transition-shadow hover:shadow-lg sm:p-9">
          <p className="text-[12px] font-bold uppercase tracking-widest text-white">{tHome("meivakantieDate")}</p>
          <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[24px]">{tHome("meivakantieTitle")}</h2>
          <p className="mt-2 max-w-md text-[14px] text-[#2D2D2D]/70">{tHome("meivakantieSub")}</p>
          <span className="mt-4 inline-block text-[14px] font-bold text-white">{tHome("meivakantieLink")}</span>
        </Link>
      </section>

      {/* ===== 9. BOTTOM NEWSLETTER ===== */}
      <section id="newsletter" className="border-t border-[#F0ECE8]">
        <div className="mx-auto max-w-[880px] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="mx-auto mb-3 h-12 w-auto" />
            <h2 className="text-[22px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[24px]">{tHome("weekendSorted")}</h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">{tHome("weekendSortedSub")}</p>
            <div className="mt-5"><NewsletterForm /></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
