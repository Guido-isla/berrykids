import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import FilterableEvents from "@/components/FilterableEvents";
import BerrysPick from "@/components/BerrysPick";
import Sidebar from "@/components/Sidebar";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import WeekView from "@/components/WeekView";
import SeasonalSuggestions from "@/components/SeasonalSuggestions";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { generateBerryDayPlan } from "@/lib/berry-brain";
import { activities } from "@/data/activities";

export default async function Home() {
  const events = getScrapedEvents();
  const eventsWithImages = resolveEventImages(events);
  const ctx = await getSiteContext();
  const berryTip = generateBerryDayPlan(ctx, events, activities, ctx.season.suggestions);

  // Berry's Pick: context-aware selection
  const berrysPick = (() => {
    const candidates = eventsWithImages.filter(
      (e) => e.description && e.description.length > 20 && e.image !== "/berry-icon.png"
    );

    if (ctx.berryPick.preferIndoor) {
      // Rainy/cold: prefer indoor events
      const indoor = candidates.find((e) => e.indoor);
      if (indoor) return indoor;
    } else {
      // Good weather: prefer outdoor events
      const outdoor = candidates.find((e) => !e.indoor);
      if (outdoor) return outdoor;
    }

    // Fallback: first candidate with age label
    return candidates.find((e) => e.ageLabel !== "Alle leeftijden") || candidates[0] || eventsWithImages[0];
  })();

  return (
    <div className="min-h-screen">
      {/* News ticker with dynamic label */}
      <NewsTicker label={ctx.ticker.label} />

      <Header />

      {/* Hero: Berry's Pick (70%) + Sidebar (30%) */}
      <section className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            {/* Left: Berry's Pick */}
            {berrysPick && (
              <BerrysPick event={berrysPick} reason={ctx.berryPick.reason} />
            )}

            {/* Right: unified sidebar */}
            <Sidebar
              tip={berryTip}
              weatherLine={`${ctx.weather.current.icon} ${ctx.weather.current.temp}°C ${ctx.weather.current.description.toLowerCase()} · ${ctx.calendar.todayLabel}`}
            />
          </div>
        </div>
      </section>

      {/* Seasonal suggestions — ATF */}
      <SeasonalSuggestions
        seasonName={ctx.season.name}
        seasonEmoji={ctx.season.emoji}
        suggestions={ctx.season.suggestions}
      />

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FilterableEvents events={eventsWithImages} />
      </main>

      {/* Per dag view */}
      <WeekView events={events} />

      {/* Film van de week */}
      <FilmVanDeWeek />

      {/* Theater & concerten */}
      <TheaterAgenda />

      {/* Vacation banner */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <a href="/vakanties" className="group block overflow-hidden rounded-2xl bg-gradient-to-r from-[#E85A5A] to-[#F4845F] p-6 text-white shadow-sm transition-shadow hover:shadow-md sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">26 april – 9 mei</span>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Meivakantie komt eraan
              </h2>
              <p className="mt-1 max-w-md text-sm opacity-90">
                Surfcamps, theaterkampen, buitenactiviteiten en meer. Bekijk onze vakantietips.
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-white/30 sm:block">
              Bekijk tips →
            </span>
          </div>
        </a>
      </section>

      {/* Altijd leuk section */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#2B2B2B] sm:text-2xl">
              Altijd leuk
            </h2>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Sportclubs, musea en kinderboerderijen — elk moment van het jaar.
            </p>
          </div>
          <a
            href="/activiteiten"
            className="shrink-0 text-sm font-semibold text-[#E85A5A] transition-colors hover:text-[#D04A4A]"
          >
            Alles bekijken →
          </a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "⚽", label: "Sport", count: "6 clubs", href: "/activiteiten" },
            { icon: "🎨", label: "Cultuur", count: "3 musea", href: "/activiteiten" },
            { icon: "🐑", label: "Dieren", count: "2 boerderijen", href: "/activiteiten" },
            { icon: "🏠", label: "Indoor", count: "3 plekken", href: "/activiteiten" },
          ].map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-bold text-[#2B2B2B]">{cat.label}</p>
                <p className="text-sm text-[#6B6B6B]">{cat.count}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Bottom newsletter CTA */}
      <section id="newsletter" className="relative overflow-hidden bg-[#FDF1EA]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #E85A5A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <Image
              src="/berry-icon.png"
              alt=""
              width={48}
              height={48}
              className="mx-auto mb-4 h-auto"
            />
            <h2 className="text-2xl font-extrabold text-[#2B2B2B]">
              Elke week de beste tips in je inbox
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Een kort wekelijks overzicht van leuke dingen om te doen met kinderen bij jou in de buurt.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
