import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import FilterableEvents from "@/components/FilterableEvents";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import EventCard from "@/components/EventCard";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { generateBerryDayPlan } from "@/lib/berry-brain";
import { activities } from "@/data/activities";
import { formatShortDate } from "@/lib/dates";

function getWhyLine(event: { title: string; free: boolean; indoor: boolean; description?: string }): string {
  const lines: Record<string, string> = {
    "Mike & Molly vieren feest": "Meezingen, lachen en dansen — altijd een hit",
    "Taartrovers Cinemini": "Eerste bioscoopje! Kort, rustig en speciaal voor peuters",
    "Kweekmarkt": "Struinen tussen de kramen, proeven en snuffelen",
    "OPLOS Festival": "Hiphop, dans en workshops — energie kwijt!",
    "Paasontbijt": "Gezellig ontbijten met het hele gezin voor het festival",
    "Kunstspeeltuin": "Zelf bouwen en ontdekken, geen regels",
    "Vilt": "Rustig, zintuiglijk — perfect voor je allerkleinste",
    "Okapi": "Muzikaal landschap van klank en klei",
    "Stilte": "Betoverend voor baby's — zachte klanken en licht",
    "Houtje": "Grappig theater dat kleintjes helemaal meepakt",
    "Mijn vlek": "Woordloos, visueel — werkt in elke taal",
    "Nekandinskie": "Bouw mee aan een nieuwe wereld",
    "Koningsconcert": "Het Kennemer Jeugdorkest in actie",
    "De gele duikmachine": "Beatles voor kinderen — magisch!",
    "Springer Festival": "Natuur ontdekken met alle zintuigen",
  };
  for (const [key, val] of Object.entries(lines)) {
    if (event.title.includes(key)) return val;
  }
  if (event.free && !event.indoor) return "Gratis en lekker buiten";
  if (event.free && event.indoor) return "Gratis en lekker binnen";
  if (event.indoor) return "Regenproof en gezellig";
  return "Leuk voor het hele gezin";
}

function getEffort(event: { indoor: boolean; free: boolean; url?: string }): { label: string; color: string } {
  if (event.free && !event.url) return { label: "🟢 Loop binnen", color: "text-[#6FAF3A]" };
  if (event.free) return { label: "🟢 Gratis · loop binnen", color: "text-[#6FAF3A]" };
  if (event.url) return { label: "🟡 Tickets nodig", color: "text-[#D97706]" };
  return { label: "🟢 Geen reservering", color: "text-[#6FAF3A]" };
}

export default async function Home() {
  const events = getScrapedEvents();
  const eventsWithImages = resolveEventImages(events);
  const ctx = await getSiteContext();
  const berryTip = generateBerryDayPlan(ctx, events, activities, ctx.season.suggestions);

  // Top 5 with images and descriptions
  const top5 = eventsWithImages
    .filter((e) => e.description && e.description.length > 15 && e.image !== "/berry-icon.png")
    .slice(0, 5);

  const hero = top5[0];
  const rest = top5.slice(1);

  // Berry's one clear recommendation
  const berryChoice = hero;

  return (
    <div className="min-h-screen">
      <NewsTicker label={ctx.ticker.label} />
      <Header />

      {/* HERO */}
      <section className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {/* Context line */}
          <p className="text-sm font-semibold text-[#E85A5A]">
            {ctx.weather.current.icon} {ctx.weather.current.temp}°C · {ctx.calendar.todayLabel} · Haarlem e.o.
          </p>

          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-[#1A1A1A] sm:text-3xl lg:text-4xl">
            Dit weekend met kinderen
          </h1>

          {/* Hero grid: #1 big + #2-5 small */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
            {/* #1 — Big hero card */}
            {hero && (
              <Link href={`/event/${hero.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                    <Image
                      src={hero.resolvedImage || hero.image}
                      alt={hero.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                  {/* Strong gradient overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)" }}
                  >
                    <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#E85A5A] px-2.5 py-1 text-[11px] font-bold text-white">
                      ⭐ Beste keuze
                    </span>
                    <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                      {hero.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formatShortDate(hero.date)} · {hero.location}
                    </p>
                    <p className="mt-1 text-sm italic text-white/90">
                      &ldquo;{getWhyLine(hero)}&rdquo;
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`text-xs font-semibold ${getEffort(hero).color} rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm`}>
                        {getEffort(hero).label}
                      </span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                        {hero.indoor ? "🏠 Binnen" : "☀️ Buiten"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* #2-5 — Small grid */}
            <div className="grid grid-cols-2 gap-3">
              {rest.map((event, i) => (
                <Link
                  key={event.slug}
                  href={`/event/${event.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={event.resolvedImage || event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {event.free && (
                      <span className="absolute right-2 top-2 rounded-full bg-[#2B9A3E] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        Gratis
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold leading-snug text-[#1A1A1A] group-hover:text-[#E85A5A]">
                      {event.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#444]">
                      {formatShortDate(event.date)} · {event.indoor ? "Binnen" : "Buiten"}
                    </p>
                    <p className="mt-1 text-xs italic text-[#666]">
                      {getWhyLine(event)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Berry decision helper + newsletter — compact bar */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Berry: "Twijfel? Doe dit:" */}
            {berryChoice && (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="animate-berry-bounce shrink-0">
                  <Image src="/berry-wink.png" alt="" width={40} height={40} className="h-10 w-auto" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#E85A5A]">
                    Twijfel? Doe dit:
                  </p>
                  <p className="mt-0.5 text-sm text-[#2B2B2B]">
                    Ga naar{" "}
                    <Link href={`/event/${berryChoice.slug}`} className="font-bold text-[#E85A5A] underline decoration-[#E85A5A]/30 underline-offset-2">
                      {berryChoice.title}
                    </Link>
                    {" "}— {getWhyLine(berryChoice).toLowerCase()}.
                  </p>
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-[#2B2B2B]">
                Elke vrijdag deze tips in je inbox
              </p>
              <p className="mt-0.5 text-[11px] text-[#6B6B6B]">
                5 tips. Geen zoeken. Gewoon gaan.
              </p>
              <div className="mt-2">
                <NewsletterForm variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Film + Theater — side by side */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* All events with filters */}
      <main className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <h2 className="mb-2 text-xl font-extrabold text-[#2B2B2B]">
          Alle events
        </h2>
        <p className="mb-4 text-sm text-[#6B6B6B]">
          {eventsWithImages.length} activiteiten in de regio Haarlem
        </p>
        <FilterableEvents events={eventsWithImages} />
      </main>

      {/* Vacation banner */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <a href="/vakanties" className="group block overflow-hidden rounded-2xl bg-gradient-to-r from-[#E85A5A] to-[#F4845F] p-6 text-white shadow-sm transition-shadow hover:shadow-md sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">26 april – 9 mei</span>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Meivakantie komt eraan</h2>
              <p className="mt-1 max-w-md text-sm opacity-90">Dagplannen, surfcamps en meer.</p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold group-hover:bg-white/30 sm:block">
              Bekijk dagplannen →
            </span>
          </div>
        </a>
      </section>

      {/* Altijd leuk */}
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#2B2B2B]">Altijd leuk</h2>
          <a href="/activiteiten" className="text-sm font-semibold text-[#E85A5A] hover:text-[#D04A4A]">Alles →</a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "⚽", label: "Sport", count: "6 clubs" },
            { icon: "🎨", label: "Cultuur", count: "3 musea" },
            { icon: "🐑", label: "Dieren", count: "2 boerderijen" },
            { icon: "🏠", label: "Indoor", count: "3 plekken" },
          ].map((cat) => (
            <a key={cat.label} href="/activiteiten" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
              <span className="text-xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-bold text-[#2B2B2B]">{cat.label}</p>
                <p className="text-xs text-[#6B6B6B]">{cat.count}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Bottom newsletter */}
      <section id="newsletter" className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-icon.png" alt="" width={40} height={40} className="mx-auto mb-3 h-auto" />
            <h2 className="text-xl font-extrabold text-[#2B2B2B]">Weekend sorted. Elke vrijdag.</h2>
            <p className="mt-1 text-sm text-[#6B6B6B]">5 tips. Geen zoeken. Gewoon gaan.</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
