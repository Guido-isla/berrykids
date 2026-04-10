import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import MediaCard from "@/components/MediaCard";
import TopFiveHero from "@/components/TopFiveHero";
import type { TopFivePick } from "@/components/TopFiveHero";
import { getDayPlanEvents, getWeekendEvents, getScrapedEvents } from "@/data/events-loader";
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

  // Tomorrow flip — uses berry.tomorrow* translation keys, computed below after tBerry init

  // === SCORE ALL ITEMS ===
  const currentMonth = new Date().getMonth() + 1;
  const verifiedAvailable = activities.filter(
    (a) => a.verified && (!a.availableMonths || a.availableMonths.includes(currentMonth))
  );
  // Dedupe events by title — multi-day films/shows shouldn't count twice
  const eventSeenTitles = new Set<string>();
  const uniqueTodayEvents = todayWithImg.filter((e) => {
    if (eventSeenTitles.has(e.title)) return false;
    eventSeenTitles.add(e.title);
    return true;
  });
  const scoredEvents = uniqueTodayEvents.map((e) => ({ item: e, score: scoreEvent(e, ctx), isEvent: true as const }));
  const scoredActivities = resolveAct(verifiedAvailable).map((a) => ({ item: a, score: scoreActivity(a, ctx), isEvent: false as const }));
  const allScored = [...scoredEvents, ...scoredActivities]
    .filter((s) => s.item.image && s.item.image !== "/berry-icon.png")
    .sort((a, b) => b.score - a.score);

  // === TRANSLATIONS ===
  const tBerry = await getTranslations("berry");
  const tHome = await getTranslations("home");
  const tNewsletter = await getTranslations("newsletter");

  // Tomorrow flip — localized via tBerry
  const tomorrow = ctx.weather.forecast[1];
  let tomorrowFlip: string | null = null;
  if (tomorrow) {
    const todayRainy = ctx.weather.isRainy;
    const tomorrowRainy = tomorrow.isRainy;
    if (!todayRainy && tomorrowRainy) tomorrowFlip = tBerry("tomorrowRain");
    else if (todayRainy && !tomorrowRainy) tomorrowFlip = tBerry("tomorrowDry", { temp: String(tomorrow.tempMax) });
    else if (!todayRainy && !tomorrowRainy && tomorrow.tempMax >= 18 && ctx.weather.current.temp < 16) tomorrowFlip = tBerry("tomorrowWarmer", { temp: String(tomorrow.tempMax) });
  }

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

  // 2. MEER ONTDEKKEN — 8 from remaining (single discovery section)
  const meerPicks = pickTopN(allScored, 8);

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

  // Resolve the vibe label via translation keys
  const localizedDay = tBerry(dayPlan.vibeDayKey);
  const localizedVibe = tBerry(dayPlan.vibeKey, { day: localizedDay });

  return (
    <div className="min-h-screen">
      {/* ===== 1. BERRY'S PICKS — ATF ===== */}
      <TopFiveHero
        picks={berryPicks}
        vibe={localizedVibe}
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
        <div className="mx-auto mt-3 max-w-[1200px] px-4 sm:px-8">
          <div className="rounded-[14px] bg-[#EDE7F6] px-4 py-2.5 text-center text-[13px] font-bold text-[#7B6BA0]">
            {tomorrowFlip}
          </div>
        </div>
      )}

      {/* ===== 2. DIT WEEKEND — 1 hero + 2-col grid ===== */}
      {weekendEvents.length > 0 && (() => {
        const [heroEvent, ...restEvents] = weekendEvents;
        return (
          <section className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-8">
            <div className="mb-4">
              <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("weekendTitle")}</h2>
              <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{tHome("weekendSub")}</p>
            </div>
            {/* Hero card */}
            <Link
              href={`/event/${heroEvent.slug}`}
              className="group block overflow-hidden rounded-[24px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/8]">
                <Image
                  src={heroEvent.resolvedImage || heroEvent.image}
                  alt={heroEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                {/* Date badge */}
                <div className="absolute left-4 top-4 flex flex-col items-center rounded-[14px] bg-white/95 px-3 py-2 text-center backdrop-blur-sm">
                  <span className="text-[11px] font-bold uppercase text-[#E0685F]">
                    {["zo","ma","di","wo","do","vr","za"][new Date(heroEvent.date + "T00:00:00").getDay()]}
                  </span>
                  <span className="text-[22px] font-black leading-none text-[#2D2D2D]">
                    {new Date(heroEvent.date + "T00:00:00").getDate()}
                  </span>
                </div>
                {heroEvent.featured ? (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#E0685F] to-[#FFB347] px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.39 7.36h7.74l-6.26 4.55 2.39 7.36L12 16.71l-6.26 4.56 2.39-7.36L1.87 9.36h7.74L12 2z" />
                    </svg>
                    {tHome("ourTip")}
                  </span>
                ) : heroEvent.free && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#4A8060] px-3 py-1 text-[11px] font-bold text-white shadow-sm">{tHome("gratis")}</span>
                )}
                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-5 pt-12">
                  <h3 className="text-[22px] font-black leading-tight text-white sm:text-[26px]">{heroEvent.title}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-white/85">📍 {heroEvent.location}{heroEvent.time ? ` · ${heroEvent.time}` : ""}</p>
                </div>
              </div>
            </Link>
            {/* Grid of remaining events */}
            {restEvents.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {restEvents.map((e) => (
                  <MediaCard
                    key={e.slug}
                    href={`/event/${e.slug}`}
                    slug={e.slug}
                    image={e.resolvedImage || e.image}
                    title={e.title}
                    date={e.date}
                    free={e.free}
                    freeLabel={tHome("gratis")}
                    featured={e.featured}
                    featuredLabel={tHome("ourTip")}
                    meta={`📍 ${e.location}${e.time ? ` · ${e.time}` : ""}`}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })()}

      {/* ===== 3. BINNENKORT — clean 2-col grid ===== */}
      {binnenkortEvents.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("binnenkortTitle")}</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{tHome("binnenkortSub")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {binnenkortEvents.map((e) => (
              <MediaCard
                key={e.slug}
                href={`/event/${e.slug}`}
                slug={e.slug}
                image={e.resolvedImage || e.image}
                title={e.title}
                date={e.date}
                free={e.free}
                freeLabel={tHome("gratis")}
                featured={e.featured}
                featuredLabel={tHome("ourTip")}
                berryTip={generateBerryTip(e as unknown as Record<string, unknown>, ctx, tBerry)}
                featuredNote={e.featuredNote}
                meta={`📍 ${e.location}${e.time ? ` · ${e.time}` : ""}`}
              />
            ))}
            <Link
              href="/evenementen"
              className="flex flex-col items-center justify-center rounded-[20px] bg-gradient-to-br from-[#E0685F] to-[#FFD8B0] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-[32px]">📆</span>
              <p className="mt-2 text-[15px] font-extrabold leading-snug text-white sm:text-[16px]">
                {tHome("allEvents")}
              </p>
              <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-[14px] text-white">
                →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ===== 4. NEWSLETTER (single placement) ===== */}
      <section id="newsletter" className="mx-auto max-w-[880px] px-4 py-12 sm:px-6">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="mx-auto mb-3 h-12 w-auto" />
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#E0685F]">{tNewsletter("frequency")}</p>
            <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[24px]">{tNewsletter("headline")}</h2>
            <p className="mt-2 text-[14px] text-[#6B6B6B]">{tNewsletter("subtitle")}</p>
            <div className="mt-5"><NewsletterForm variant="personalize" /></div>
            <p className="mt-2 text-[12px] text-[#888]">{tNewsletter("subscriberCount")}</p>
          </div>
        </div>
      </section>

      {/* ===== 5. MEER ONTDEKKEN — single discovery section ===== */}
      {meerPicks.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-8">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">{tHome("discoverTitle")}</h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">{tHome("discoverSub")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {meerPicks.map((p) => {
              const item = allScored.find((s) => (s.item as Record<string, unknown>).slug === p.slug);
              const raw = item ? (item.item as Record<string, unknown>) : {};
              return (
                <MediaCard
                  key={p.slug}
                  href={p.isEvent ? `/event/${p.slug}` : `/activiteiten/${p.slug}`}
                  slug={p.slug}
                  image={p.image}
                  title={p.title}
                  free={p.free}
                  freeLabel={tHome("gratis")}
                  berryTip={generateBerryTip(raw, ctx, tBerry)}
                  meta={p.location}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ===== 6. MEIVAKANTIE BANNER ===== */}
      <section className="mx-auto max-w-[880px] px-4 pb-12 sm:px-6">
        <Link href="/vakanties" className="group block rounded-[24px] bg-gradient-to-r from-[#E0685F] to-[#FFD8B0] p-6 transition-shadow hover:shadow-lg sm:p-9">
          <p className="text-[12px] font-bold uppercase tracking-widest text-white">{tHome("meivakantieDate")}</p>
          <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[24px]">{tHome("meivakantieTitle")}</h2>
          <p className="mt-2 max-w-md text-[14px] text-[#2D2D2D]/70">{tHome("meivakantieSub")}</p>
          <span className="mt-4 inline-block text-[14px] font-bold text-white">{tHome("meivakantieLink")}</span>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
