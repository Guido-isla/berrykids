import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import ActivityCard from "@/components/ActivityCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import { getScrapedEvents, getDayPlanEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveAct } from "@/lib/photos";
import { generateBerryDayPlan } from "@/lib/berry-brain";
import { formatShortDate } from "@/lib/dates";

// Revalidate every 30 minutes — keeps weather, events and dagplan fresh
export const revalidate = 1800;

export default async function Home() {
  const allEvents = getScrapedEvents();
  const todayEvents = getDayPlanEvents();
  const ctx = await getSiteContext();

  // Hero + Vandaag: only today/weekend events with images
  const todayWithImg = resolveEventImages(todayEvents).filter((e) => e.image !== "/berry-icon.png");
  // Fallback section + lower page: all upcoming events
  const allWithImg = resolveEventImages(allEvents).filter((e) => e.image !== "/berry-icon.png");

  const outdoorEvents = todayWithImg.filter((e) => !e.indoor);
  const indoorEvents = todayWithImg.filter((e) => e.indoor);

  // ===== DECISION ENGINE =====
  // Berry picks based on situation, not taxonomy
  const preferIndoor = ctx.berryPick.preferIndoor;
  const primaryEvents = preferIndoor
    ? [...indoorEvents, ...outdoorEvents]
    : [...outdoorEvents, ...indoorEvents];
  const topPick = primaryEvents[0] || todayWithImg[0];
  const alternatives = primaryEvents.slice(1, 4);

  // Hero slides: top pick first, then alternatives — today only
  const heroSlides = [topPick, ...alternatives].filter(Boolean).slice(0, 4).map((e) => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    image: e.resolvedImage || e.image,
    location: e.location,
    free: e.free,
  }));

  // Berry's day plan from berry-brain.ts
  const dayPlanEvents = getDayPlanEvents();
  const dayPlan = generateBerryDayPlan(ctx, dayPlanEvents, activities, ctx.season.suggestions);

  // Situational heading — Berry decides, not the user
  let situationHeading = `${ctx.weather.current.temp}°C ${ctx.weather.current.icon} — ${ctx.berryPick.reason.toLowerCase()}`;
  if (ctx.calendar.holidayName) {
    situationHeading = `${ctx.calendar.holidayName} · ${ctx.weather.current.temp}°C ${ctx.weather.current.icon}`;
  } else if (ctx.calendar.isSchoolVacation) {
    situationHeading = `${ctx.calendar.vacationName} · ${ctx.weather.current.temp}°C ${ctx.weather.current.icon}`;
  }

  // Tomorrow flip — use forecast to create urgency
  const tomorrow = ctx.weather.forecast[1];
  let tomorrowFlip: string | null = null;
  if (tomorrow) {
    const todayRainy = ctx.weather.isRainy;
    const tomorrowRainy = tomorrow.isRainy;
    if (!todayRainy && tomorrowRainy) {
      tomorrowFlip = `${tomorrow.icon} Morgen regent het — pak vandaag mee`;
    } else if (todayRainy && !tomorrowRainy) {
      tomorrowFlip = `${tomorrow.icon} Morgen ${tomorrow.tempMax}°C en droog — bewaar buiten voor morgen`;
    } else if (!todayRainy && !tomorrowRainy && tomorrow.tempMax >= 18 && ctx.weather.current.temp < 16) {
      tomorrowFlip = `${tomorrow.icon} Morgen ${tomorrow.tempMax}°C — nog mooier dan vandaag`;
    }
  }

  // Fallback: opposite weather direction from today's events, or upcoming if few today
  const allOutdoor = allWithImg.filter((e) => !e.indoor);
  const allIndoor = allWithImg.filter((e) => e.indoor);
  const fallbackEvents = preferIndoor
    ? allOutdoor.slice(0, 3)
    : allIndoor.slice(0, 3);
  const fallbackLabel = preferIndoor
    ? "Als het toch opklaart"
    : "Als het weer omslaat";

  // Activities for lower sections
  const sportAct = resolveAct(activities.filter((a) => a.category === "sport").slice(0, 3));
  const cultAct = resolveAct(activities.filter((a) => a.category === "cultuur" || a.category === "indoor").slice(0, 3));

  // "Ook goed vandaag" — 3 alternatives (mix of events + activities)
  const alsoGood = primaryEvents.slice(1, 4);
  // If fewer than 3 events, fill with weather-matched activities
  const verifiedActs = resolveAct(
    activities.filter((a) => a.verified && (!a.availableMonths || a.availableMonths.includes(new Date().getMonth() + 1)))
  );
  const matchedActs = preferIndoor
    ? verifiedActs.filter((a) => a.category === "indoor" || a.category === "cultuur")
    : verifiedActs.filter((a) => a.category === "natuur" || a.category === "dieren" || a.category === "sport");
  while (alsoGood.length < 3 && matchedActs.length > 0) {
    const act = matchedActs.shift()!;
    if (!alsoGood.some((e) => e.title === act.title)) {
      alsoGood.push({ ...act, date: "", time: "", indoor: act.category === "indoor" || act.category === "cultuur", slug: act.slug, image: act.resolvedImage || act.image } as typeof primaryEvents[0]);
    }
  }

  // Parse day plan message into structured lines
  const planLines = dayPlan.message.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== ATF — Berry's decision + #1 pick + alternatives ===== */}
      <section className="mx-auto max-w-[1200px] px-5 pt-5 sm:px-10">
        {/* Weather chip */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F0ECE8] px-4 py-2">
          <span className="text-[18px] leading-none">{ctx.weather.current.icon}</span>
          <span className="text-[13px] font-bold text-[#1A1A1A]">{ctx.weather.current.temp}°C · {ctx.weather.current.description}</span>
          <span className="text-[12px] text-[#888]">— {ctx.berryPick.reason.toLowerCase()}</span>
        </div>

        {/* Berry message + #1 card side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[5fr_7fr]">
          {/* LEFT: Berry's message */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-berry-bounce shrink-0">
                <Image src="/berry-wink.png" alt="" width={64} height={64} className="h-14 w-auto" />
              </div>
              <div>
                <p className="text-[12px] font-semibold lowercase tracking-wide text-[#E85A5A]">{dayPlan.vibe}</p>
                <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight text-[#1A1A1A]">
                  Doe dit vandaag
                </h1>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 rounded-xl bg-[#F0ECE8] p-4">
              {planLines.slice(0, 3).map((line, i) => {
                const parts = line.split(/\[([^\]]+)\]\(([^)]+)\)/);
                return (
                  <p key={i} className="text-[13px] leading-relaxed text-[#444]">
                    {parts.length === 1 ? (
                      line
                    ) : (
                      parts.map((part, j) => {
                        if (j % 3 === 1) {
                          const href = parts[j + 1];
                          return (
                            <Link key={j} href={href} className="font-bold text-[#E85A5A] hover:underline">
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
            </div>
            {/* Tomorrow flip — inline */}
            {tomorrowFlip && (
              <p className="mt-3 text-[12px] font-semibold text-[#888]">{tomorrowFlip}</p>
            )}
            <p className="mt-2 text-[11px] text-[#BBB]">Nieuw weekendplan vrijdag om 15:00</p>
          </div>

          {/* RIGHT: #1 pick card — large */}
          {topPick && (
            <Link href={`/event/${topPick.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/10]">
                <Image
                  src={topPick.resolvedImage || topPick.image}
                  alt={topPick.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)" }} />
                <div className="absolute left-4 top-4 rounded-full bg-[#E85A5A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Berry&apos;s #1
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[13px] font-semibold text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    {dayPlan.whyNow}
                  </p>
                  <h2 className="mt-1 text-[clamp(1.2rem,2.5vw,1.8rem)] font-extrabold leading-[1.1] tracking-tight text-white">
                    {topPick.title}
                  </h2>
                  <p className="mt-1 text-[12px] text-white/50">{topPick.location} · {topPick.category}{topPick.free ? " · Gratis" : ""}</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* "Ook goed vandaag" — 3 compact alternatives */}
        {alsoGood.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#999]">Ook goed vandaag</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {alsoGood.slice(0, 3).map((e) => (
                <Link key={e.slug} href={e.date ? `/event/${e.slug}` : `/activiteiten/${e.slug}`} className="group flex gap-3 rounded-xl bg-[#FAF8F6] p-3 transition-colors hover:bg-[#F0ECE8]">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
                    <Image
                      src={e.resolvedImage || e.image}
                      alt={e.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#E85A5A]">
                      {e.category}{e.free && " · Gratis"}
                    </p>
                    <h3 className="text-[14px] font-bold leading-snug tracking-tight text-[#1A1A1A] group-hover:text-[#E85A5A]">
                      {e.title}
                    </h3>
                    <p className="text-[12px] text-[#888] truncate">{e.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== VANDAAG — Berry's top picks, no explanation ===== */}
      <section className="bg-[#FAF8F6] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
            <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
            Vandaag
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_2fr]">
            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6">
              {primaryEvents.slice(1, 7).map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
            <div className="hidden lg:block">
              <p className="mb-1.5 text-[10px] uppercase tracking-widest text-[#CCC]">Advertentie</p>
              <div className="flex h-[600px] items-center justify-center rounded bg-[#F0ECE8] text-[13px] text-[#CCC]">
                Advertentie
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-12 sm:py-20 sm:px-10">
        <div className="rounded-2xl bg-[#FAFAFA] p-8 sm:p-12">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#E85A5A]">Elke vrijdag om 15:00</p>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">Weekend gepland in 2 minuten</h2>
            <p className="mt-2 text-[14px] text-[#666]">De 5 leukste tips. Geen zoeken. Gewoon gaan.</p>
            <div className="mt-5"><NewsletterForm /></div>
            <p className="mt-2 text-[12px] text-[#999]">2.340+ ouders · gratis</p>
          </div>
        </div>
      </section>

      {/* ===== FALLBACK — if weather changes ===== */}
      {fallbackEvents.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 py-12 sm:py-20 sm:px-10">
          <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
            <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
            {fallbackLabel}
          </h2>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackEvents.map((e) => <EventCard key={e.slug + "-fb"} event={e} />)}
          </div>
        </section>
      )}

      {/* ===== FILM + THEATER ===== */}
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:py-20 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* ===== AD ===== */}
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-10">
        <p className="mb-1.5 text-center text-[10px] uppercase tracking-widest text-[#CCC]">Advertentie</p>
        <div className="flex h-[90px] items-center justify-center rounded bg-[#F5F5F5] text-[13px] text-[#CCC]">Advertentieruimte</div>
      </div>

      {/* ===== MEER ONTDEKKEN — activities, demoted ===== */}
      <section className="bg-[#FAF8F6] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
            <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
            Meer ontdekken
          </h2>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...sportAct, ...cultAct].slice(0, 6).map((a) => <ActivityCard key={a.slug} activity={a} />)}
          </div>
        </div>
      </section>

      {/* ===== MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-12 sm:py-20 sm:px-10">
        <Link href="/vakanties" className="group block rounded-2xl bg-[#1A1A1A] p-8 text-white hover:bg-[#2A2A2A] sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#E85A5A]">26 april – 9 mei</p>
          <h2 className="mt-2 text-[26px] font-extrabold tracking-tight">Meivakantie — jouw weekplan</h2>
          <p className="mt-2 max-w-md text-[14px] text-white/60">Dagplannen, surfcamps en meer.</p>
          <span className="mt-4 inline-block text-[14px] font-bold text-[#E85A5A]">Bekijk dagplannen →</span>
        </Link>
      </section>

      {/* ===== BOTTOM NEWSLETTER ===== */}
      <section id="newsletter" className="border-t border-black/[0.06] bg-[#FAF8F6]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-10">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={36} height={36} className="mx-auto mb-3 h-9 w-auto" />
            <h2 className="text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">Weekend sorted</h2>
            <p className="mt-1 text-[14px] text-[#666]">Elke vrijdag om 15:00. 5 tips. Klaar.</p>
            <div className="mt-5"><NewsletterForm /></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
