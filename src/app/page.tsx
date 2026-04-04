import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import FilterableEvents from "@/components/FilterableEvents";
import Sidebar from "@/components/Sidebar";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import EventCard from "@/components/EventCard";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { generateBerryDayPlan } from "@/lib/berry-brain";
import { activities } from "@/data/activities";
import { formatShortDate } from "@/lib/dates";

export default async function Home() {
  const events = getScrapedEvents();
  const eventsWithImages = resolveEventImages(events);
  const ctx = await getSiteContext();
  const berryTip = generateBerryDayPlan(ctx, events, activities, ctx.season.suggestions);

  // Top 5 picks: best events with images and descriptions
  const top5 = eventsWithImages
    .filter((e) => e.description && e.description.length > 20 && e.image !== "/berry-icon.png")
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <NewsTicker label={ctx.ticker.label} />
      <Header />

      {/* HERO — "This weekend, solved" */}
      <section className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
            {/* Left: headline + top 5 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#E85A5A]">
                  {ctx.weather.current.icon} {ctx.weather.current.temp}°C · {ctx.calendar.todayLabel}
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-[#2B2B2B] sm:text-4xl lg:text-[2.75rem]">
                De 5 leukste dingen om te doen met kinderen dit weekend
              </h1>

              <p className="mt-2 text-base text-[#6B6B6B]">
                Haarlem e.o. · Elke week vers geselecteerd
              </p>

              {/* Top 5 compact list */}
              <div className="mt-6 space-y-0 divide-y divide-[#E8E0DA] overflow-hidden rounded-2xl bg-white shadow-sm">
                {top5.map((event, i) => (
                  <Link
                    key={event.slug}
                    href={`/event/${event.slug}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-[#FFF8F4]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E85A5A] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#2B2B2B]">
                        {event.title}
                      </h3>
                      <p className="mt-0.5 truncate text-sm text-[#6B6B6B]">
                        {formatShortDate(event.date)} · {event.location}
                        {event.free ? " · Gratis" : ""}
                      </p>
                    </div>
                    <div className="hidden shrink-0 sm:block">
                      {event.free ? (
                        <span className="rounded-full bg-[#8BC34A]/15 px-2.5 py-1 text-xs font-semibold text-[#6FAF3A]">
                          Gratis
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B6B6B]">{event.price}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Newsletter — right after top 5, high urgency */}
              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Image src="/berry-wink.png" alt="" width={36} height={36} className="mt-0.5 h-9 w-auto shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#2B2B2B]">
                      Elke vrijdag deze top 5 in je inbox
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B6B6B]">
                      Geen zoeken meer. 5 tips. Klaar.
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <NewsletterForm variant="hero" />
                </div>
                <p className="mt-1.5 text-[10px] text-[#999]">2.340+ ouders · gratis · altijd opzegbaar</p>
              </div>
            </div>

            {/* Right: Berry's dagplan */}
            <Sidebar
              tip={berryTip}
              weatherLine={`${ctx.weather.current.icon} ${ctx.weather.current.temp}°C ${ctx.weather.current.description.toLowerCase()} · ${ctx.calendar.todayLabel}`}
            />
          </div>
        </div>
      </section>

      {/* Top 5 cards with images — visual version below the fold */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h2 className="mb-6 text-xl font-extrabold text-[#2B2B2B]">
          Top picks dit weekend
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {top5.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      {/* Film + Theater — compact */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* All events with filters */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h2 className="mb-2 text-xl font-extrabold text-[#2B2B2B]">
          Alle events
        </h2>
        <p className="mb-4 text-sm text-[#6B6B6B]">
          Zoek en filter door alle activiteiten in de regio Haarlem
        </p>
        <FilterableEvents events={eventsWithImages} />
      </main>

      {/* Vacation banner */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <a href="/vakanties" className="group block overflow-hidden rounded-2xl bg-gradient-to-r from-[#E85A5A] to-[#F4845F] p-6 text-white shadow-sm transition-shadow hover:shadow-md sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">26 april – 9 mei</span>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Meivakantie komt eraan
              </h2>
              <p className="mt-1 max-w-md text-sm opacity-90">
                Surfcamps, theaterkampen, buitenactiviteiten en meer.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-white/30 sm:block">
              Bekijk dagplannen →
            </span>
          </div>
        </a>
      </section>

      {/* Altijd leuk — compact */}
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#2B2B2B]">Altijd leuk</h2>
          <a href="/activiteiten" className="text-sm font-semibold text-[#E85A5A] hover:text-[#D04A4A]">
            Alles →
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "⚽", label: "Sport", count: "6 clubs", href: "/activiteiten" },
            { icon: "🎨", label: "Cultuur", count: "3 musea", href: "/activiteiten" },
            { icon: "🐑", label: "Dieren", count: "2 boerderijen", href: "/activiteiten" },
            { icon: "🏠", label: "Indoor", count: "3 plekken", href: "/activiteiten" },
          ].map((cat) => (
            <a key={cat.label} href={cat.href} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
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
            <h2 className="text-xl font-extrabold text-[#2B2B2B]">
              Weekend sorted. Elke vrijdag.
            </h2>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              5 tips. Geen zoeken. Gewoon gaan.
            </p>
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
