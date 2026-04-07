import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import ActivityCard from "@/components/ActivityCard";
import BerryZone from "@/components/BerryZone";
import MoodTiles from "@/components/MoodTiles";
import SaveButton from "@/components/SaveButton";
import WeatherChip from "@/components/WeatherChip";
import { getScrapedEvents, getDayPlanEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveAct } from "@/lib/photos";
import { generateBerryDayPlan } from "@/lib/berry-brain";

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

  return (
    <div className="min-h-screen">

      {/* ===== BERRY ZONE — pastel ATF ===== */}
      <BerryZone mood={weatherMood}>
        <Header />

        <div className="mx-auto max-w-[880px] px-5 pb-4 sm:px-6">

          {/* Berry row — avatar + vibe + headline + weather */}
          <div className="mb-3 flex items-center gap-3">
            <div className="animate-berry-bounce shrink-0" style={{ filter: "drop-shadow(0 6px 16px rgba(244,160,156,0.3))" }}>
              <Image src="/berry-wink.png" alt="Berry" width={100} height={100} className="h-[72px] w-auto sm:h-[100px]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#F4A09C]">{dayPlan.vibe}</p>
              <h1 className="text-[clamp(24px,4vw,34px)] font-black tracking-tight text-[#2D2D2D]" style={{ lineHeight: 1.05 }}>
                Doe dit vandaag
              </h1>
            </div>
            <WeatherChip
              icon={ctx.weather.current.icon}
              temp={ctx.weather.current.temp}
              description={ctx.weather.current.description}
              reason={ctx.berryPick.reason}
              forecast={ctx.weather.forecast.slice(1, 5).map((d) => ({
                icon: d.icon,
                day: ["zo","ma","di","wo","do","vr","za"][new Date(d.date + "T00:00:00").getDay()],
                tempMax: d.tempMax,
                isRainy: d.isRainy,
              }))}
            />
          </div>

          {/* Speech bubble */}
          <div className="relative mb-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <div className="absolute -top-2 left-12 h-4 w-4 rotate-45 bg-white" />
            <div className="relative space-y-1">
              {planLines.slice(0, 3).map((line, i) => {
                const parts = line.split(/\[([^\]]+)\]\(([^)]+)\)/);
                return (
                  <p key={i} className="text-[15px] font-semibold leading-relaxed text-[#3D3D3D]">
                    {parts.length === 1 ? (
                      line
                    ) : (
                      parts.map((part, j) => {
                        if (j % 3 === 1) {
                          const href = parts[j + 1];
                          return (
                            <Link key={j} href={href} className="font-extrabold text-[#F4A09C] hover:underline">
                              {part}
                            </Link>
                          );
                        }
                        if (j % 3 === 2) return null;
                        return <span key={j}>{part}</span>;
                      })
                    )}
                  </p>
                );
              })}
              {tomorrowFlip && (
                <p className="text-[12px] font-semibold text-[#BBB]">{tomorrowFlip}</p>
              )}
            </div>
          </div>

          {/* Hero card — Berry's #1 */}
          {topPick && (
            <Link href={`/event/${topPick.slug}`} className="group block">
              <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-[200px] overflow-hidden sm:h-[280px]">
                  <Image
                    src={topPick.resolvedImage || topPick.image}
                    alt={topPick.title}
                    fill
                    sizes="(max-width: 880px) 100vw, 880px"
                    className="object-cover transition-transform duration-[5s] ease-out group-hover:scale-[1.04]"
                    priority
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)" }} />
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-[#F4A09C] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Berry&apos;s #1
                  </div>
                  <SaveButton slug={topPick.slug} />
                  <div className="absolute bottom-3.5 left-3.5 flex gap-1.5">
                    {topPick.free && <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">Gratis</span>}
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">{topPick.ageLabel}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <h2 className="text-[18px] font-extrabold tracking-tight text-[#2D2D2D]">{topPick.title}</h2>
                    <p className="mt-0.5 text-[12px] font-semibold text-[#BBB]">📍 {topPick.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#F4A09C] px-5 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-[#E88E8A]">
                    Bekijk →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Also good — compact row */}
          {alsoGood.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {alsoGood.slice(0, 2).map((e) => (
                <Link key={e.slug} href={e.date ? `/event/${e.slug}` : `/activiteiten/${e.slug}`} className="group flex gap-3 rounded-[20px] bg-white p-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[12px] sm:h-[72px] sm:w-[72px]">
                    <Image src={e.resolvedImage || e.image} alt={e.title} fill sizes="72px" className="object-cover" />
                    {e.free && <span className="absolute bottom-1 left-1 rounded-full bg-[#7BC67F] px-1.5 py-0.5 text-[9px] font-bold text-white">Gratis</span>}
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#F4A09C]">{e.category}</p>
                    <h3 className="text-[14px] font-extrabold leading-snug tracking-tight text-[#2D2D2D] group-hover:text-[#F4A09C]">{e.title}</h3>
                    <p className="truncate text-[11px] text-[#BBB]">{e.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-3 text-center text-[11px] font-semibold text-[#2D2D2D]/15">
            Nieuw weekendplan vrijdag om 15:00
          </p>
        </div>
      </BerryZone>

      {/* ===== MOOD TILES ===== */}
      <section className="mx-auto max-w-[880px] px-5 py-8 sm:px-6 sm:py-10">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#D4C8BE]">Vandaag voelt als</p>
        <MoodTiles />
      </section>

      {/* ===== VANDAAG — more events ===== */}
      {primaryEvents.length > 2 && (
        <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#D4C8BE]">Ook goed vandaag</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {primaryEvents.slice(2, 6).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-[880px] px-5 py-10 sm:px-6">
        <div className="rounded-[24px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mx-auto max-w-md text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F4A09C]">Elke vrijdag om 15:00</p>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#2D2D2D]">Weekend gepland in 2 minuten</h2>
            <p className="mt-2 text-[14px] text-[#BBB]">De 5 leukste tips. Geen zoeken. Gewoon gaan.</p>
            <div className="mt-5"><NewsletterForm /></div>
            <p className="mt-2 text-[12px] text-[#D4C8BE]">2.340+ ouders · gratis</p>
          </div>
        </div>
      </section>

      {/* ===== FALLBACK — if weather changes ===== */}
      {fallbackEvents.length > 0 && (
        <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#D4C8BE]">{fallbackLabel}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackEvents.map((e) => <EventCard key={e.slug + "-fb"} event={e} />)}
          </div>
        </section>
      )}

      {/* ===== FILM + THEATER ===== */}
      <div className="mx-auto max-w-[880px] px-5 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* ===== MEER ONTDEKKEN ===== */}
      <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#D4C8BE]">Meer ontdekken</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...sportAct, ...cultAct].slice(0, 6).map((a) => <ActivityCard key={a.slug} activity={a} />)}
        </div>
      </section>

      {/* ===== MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-[880px] px-5 pb-10 sm:px-6">
        <Link href="/vakanties" className="group block rounded-[24px] bg-[#2D2D2D] p-7 text-white transition-colors hover:bg-[#3D3D3D] sm:p-9">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#F4A09C]">26 april – 9 mei</p>
          <h2 className="mt-2 text-[24px] font-extrabold tracking-tight">Meivakantie — jouw weekplan</h2>
          <p className="mt-2 max-w-md text-[14px] text-white/40">Dagplannen, surfcamps en meer.</p>
          <span className="mt-4 inline-block text-[14px] font-bold text-[#F4A09C]">Bekijk dagplannen →</span>
        </Link>
      </section>

      {/* ===== BOTTOM NEWSLETTER ===== */}
      <section id="newsletter" className="border-t border-[#F0ECE8]">
        <div className="mx-auto max-w-[880px] px-5 py-14 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="mx-auto mb-3 h-12 w-auto" />
            <h2 className="text-[24px] font-extrabold tracking-tight text-[#2D2D2D]">Weekend sorted</h2>
            <p className="mt-1 text-[14px] text-[#BBB]">Elke vrijdag om 15:00. 5 tips. Klaar.</p>
            <div className="mt-5"><NewsletterForm /></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
