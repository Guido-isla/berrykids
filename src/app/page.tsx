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
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveAct } from "@/lib/photos";
import { generateBerryDayPlan } from "@/lib/berry-brain";
import { formatShortDate } from "@/lib/dates";

export default async function Home() {
  const events = getScrapedEvents();
  const all = resolveEventImages(events);
  const ctx = await getSiteContext();

  const withImg = all.filter((e) => e.image !== "/berry-icon.png");
  const outdoorEvents = withImg.filter((e) => !e.indoor);
  const indoorEvents = withImg.filter((e) => e.indoor);

  // ===== DECISION ENGINE =====
  // Berry picks based on situation, not taxonomy
  const preferIndoor = ctx.berryPick.preferIndoor;
  const primaryEvents = preferIndoor
    ? [...indoorEvents, ...outdoorEvents]
    : [...outdoorEvents, ...indoorEvents];
  const topPick = primaryEvents[0] || withImg[0];
  const alternatives = primaryEvents.slice(1, 4);

  // Hero slides: top pick first, then alternatives — weather-sorted
  const heroSlides = [topPick, ...alternatives].filter(Boolean).slice(0, 4).map((e) => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    image: e.resolvedImage || e.image,
    location: e.location,
    free: e.free,
  }));

  // Berry's day plan from berry-brain.ts
  const dayPlan = generateBerryDayPlan(ctx, events, activities, ctx.season.suggestions);

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

  // Fallback events: whatever situation doesn't prefer
  const fallbackEvents = preferIndoor
    ? outdoorEvents.slice(0, 3)
    : indoorEvents.slice(0, 3);
  const fallbackLabel = preferIndoor
    ? "Als het toch opklaart"
    : "Als het weer omslaat";

  // Activities for lower sections
  const sportAct = resolveAct(activities.filter((a) => a.category === "sport").slice(0, 3));
  const cultAct = resolveAct(activities.filter((a) => a.category === "cultuur" || a.category === "indoor").slice(0, 3));

  // Parse day plan message into structured lines
  const planLines = dayPlan.message.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== WEATHER DECISION BAR ===== */}
      <div className="mx-auto max-w-[1200px] px-5 pt-5 sm:px-10">
        <div className="flex items-center gap-3 rounded-xl bg-[#F0ECE8] px-4 py-2.5 sm:px-5 sm:py-3">
          <span className="text-[22px] leading-none">{ctx.weather.current.icon}</span>
          <div>
            <p className="text-[14px] font-bold text-[#1A1A1A]">
              {ctx.weather.current.temp}°C · {ctx.weather.current.description}
            </p>
            <p className="text-[13px] text-[#666]">{ctx.berryPick.reason}</p>
          </div>
        </div>
      </div>

      {/* ===== HERO — Berry's #1 pick + alternatives ===== */}
      <HeroSlideshow
        slides={heroSlides}
        heading="Doe dit vandaag"
        dateLine={ctx.calendar.todayLabel}
      />

      {/* ===== TOMORROW FLIP — urgency from forecast ===== */}
      {tomorrowFlip && (
        <div className="mx-auto max-w-[1200px] px-5 pt-4 sm:px-10">
          <div className="rounded-xl bg-[#1A1A1A] px-5 py-3">
            <p className="text-center text-[14px] font-semibold text-white/80">{tomorrowFlip}</p>
          </div>
        </div>
      )}

      {/* ===== BERRY'S DAY PLAN — the decision engine ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-10 sm:px-10">
        <div className="flex items-start gap-4">
          <div className="animate-berry-bounce shrink-0 pt-1">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="h-12 w-auto" />
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#1A1A1A]">
              Berry&apos;s dagplan
            </h2>
            <div className="mt-3 space-y-2">
              {planLines.map((line, i) => {
                // Parse [text](href) links in the line
                const parts = line.split(/\[([^\]]+)\]\(([^)]+)\)/);
                return (
                  <p key={i} className="text-[15px] leading-relaxed text-[#444]">
                    {parts.length === 1 ? (
                      line
                    ) : (
                      parts.map((part, j) => {
                        if (j % 3 === 1) {
                          // Link text
                          const href = parts[j + 1];
                          return (
                            <Link key={j} href={href} className="font-bold text-[#E85A5A] hover:underline">
                              {part}
                            </Link>
                          );
                        }
                        if (j % 3 === 2) return null; // href, already consumed
                        return <span key={j}>{part}</span>;
                      })
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VANDAAG — Berry's top picks, no explanation ===== */}
      <section className="bg-[#FAF8F6] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
            <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
            Vandaag
          </h2>
          <div className="grid gap-8 lg:grid-cols-[5fr_2fr]">
            <div>
              {primaryEvents[0] && <EventCard event={primaryEvents[0]} />}
              <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
                {primaryEvents.slice(1, 5).map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
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
