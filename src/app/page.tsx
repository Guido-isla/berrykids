import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { activities } from "@/data/activities";
import { resolveEventImages as resolveActivityImages } from "@/lib/photos";
import ActivityCard from "@/components/ActivityCard";
import { formatShortDate } from "@/lib/dates";

function getWhyLine(t: string): string {
  const m: Record<string, string> = {
    "Mike & Molly": "Meezingen, lachen en dansen — altijd een hit",
    "Taartrovers": "Eerste bioscoopje! Kort en speciaal voor peuters",
    "Kweekmarkt": "Struinen, proeven en snuffelen tussen de kramen",
    "OPLOS": "Hiphop, dans en workshops — energie kwijt!",
    "Paasontbijt": "Gezellig ontbijten voor het festival",
    "Kunstspeeltuin": "Zelf bouwen en ontdekken, geen regels",
    "Vilt": "Rustig en zintuiglijk — voor je allerkleinste",
    "Okapi": "Muzikaal landschap van klank en klei",
    "Stilte": "Betoverend — zachte klanken voor baby's",
    "Houtje": "Grappig theater dat kleintjes meepakt",
    "Springer": "Natuur ontdekken met alle zintuigen",
  };
  for (const [k, v] of Object.entries(m)) { if (t.includes(k)) return v; }
  return "Leuk voor het hele gezin";
}

export default async function Home() {
  const events = getScrapedEvents();
  const all = resolveEventImages(events);
  const ctx = await getSiteContext();

  const withImg = all.filter((e) => e.image !== "/berry-icon.png");
  const hero = withImg[0];
  const subPicks = withImg.slice(1, 5);
  const freeEvents = withImg.filter((e) => e.free).slice(0, 3);
  const indoorEvents = withImg.filter((e) => e.indoor).slice(0, 3);
  const sportActivities = resolveActivityImages(
    activities.filter((a) => a.category === "sport").slice(0, 3)
  );
  const cultureActivities = resolveActivityImages(
    activities.filter((a) => a.category === "cultuur" || a.category === "indoor").slice(0, 3)
  );

  // Berry's tip — short, max ~90 chars
  let berryTip = "Fijne dag! Scroll naar beneden voor de leukste tips.";
  if (ctx.calendar.holidayName?.includes("Paas")) {
    berryTip = hero
      ? `Fijne Pasen! 🥚 Ga naar ${hero.title} — ${getWhyLine(hero.title).toLowerCase()}.`
      : "Fijne Pasen! 🥚 Genoeg te doen dit weekend.";
  } else if (ctx.weather.isRainy && indoorEvents[0]) {
    berryTip = `Het regent 🌧️ Tip: ${indoorEvents[0].title} — lekker binnen!`;
  } else if (ctx.weather.isGoodWeather && hero) {
    berryTip = `${ctx.weather.current.temp}°C ☀️ Mijn tip: ${hero.title}. Ga eropuit!`;
  } else if (hero) {
    berryTip = `Mijn tip voor vandaag: ${hero.title} in ${hero.location}.`;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== 1. FULL-SCREEN HERO ===== */}
      {hero && (
        <section className="relative">
          <Link href={`/event/${hero.slug}`} className="group block">
            <div className="relative h-[70vh] min-h-[400px] max-h-[600px]">
              <Image
                src={hero.resolvedImage || hero.image}
                alt={hero.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                <div className="mx-auto max-w-6xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#E85A5A]">
                    {hero.category}
                  </p>
                  <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {hero.title}
                  </h1>
                  <p className="mt-2 max-w-lg text-base text-white/80 sm:text-lg">
                    {getWhyLine(hero.title)}. {hero.location}. {hero.free ? "Gratis." : ""}
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-[#E85A5A] px-6 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#D04A4A]">
                    Lees meer
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ===== 2. SUB-PICKS — 4 compact text links ===== */}
      <section className="border-b border-[#F0EBE6]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#F0EBE6] sm:grid-cols-4">
          {subPicks.map((e) => (
            <Link
              key={e.slug}
              href={`/event/${e.slug}`}
              className="group p-4 transition-colors hover:bg-[#FDFBF9] sm:p-5"
            >
              <div className="mb-2 h-0.5 w-8 bg-[#E85A5A]" />
              <p className="text-sm font-bold leading-snug text-[#1A1A1A] group-hover:text-[#E85A5A]">
                {e.title}
              </p>
              <p className="mt-1 text-xs text-[#666]">
                {formatShortDate(e.date)} · {e.free ? "Gratis" : e.price || ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 3. BERRY'S ADVIES — speech bubble ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-start gap-3">
          <div className="animate-berry-bounce shrink-0">
            <Image src="/berry-wink.png" alt="" width={44} height={44} className="h-11 w-auto" />
          </div>
          <div className="relative animate-berry-fade-in">
            <div className="absolute -left-2 top-3 h-0 w-0 border-y-[6px] border-r-[8px] border-y-transparent border-r-[#F5F0ED]" />
            <div className="max-w-sm rounded-2xl bg-[#F5F0ED] px-4 py-3">
              <p className="text-sm leading-relaxed text-[#1A1A1A]">
                {berryTip}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. FILTERS + "Wat te doen in Haarlem" ===== */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl">
          Wat te doen in Haarlem
        </h2>
        <div className="mt-4 flex justify-center gap-3">
          {["Vandaag", "Dit weekend", "Deze week", "Deze maand"].map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#E85A5A] px-5 py-2 text-sm font-bold text-white"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ===== 5. AD SPACE ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[#CCC]">
          Advertentie
        </p>
        <div className="flex h-24 items-center justify-center rounded-xl bg-[#F5F5F5] text-sm text-[#CCC]">
          Advertentieruimte
        </div>
      </section>

      {/* ===== 6. CONTENT GRID — Time Out style ===== */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#1A1A1A]">
            <span className="mr-2 inline-block h-1 w-8 bg-[#E85A5A] align-middle" />
            Dit weekend
          </h2>
        </div>

        {/* Main article + ad sidebar (Time Out layout) */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main event — large */}
          {withImg[0] && (
            <EventCard event={withImg[0]} />
          )}

          {/* Sidebar ad */}
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[#CCC]">Advertentie</p>
            <div className="flex h-64 items-center justify-center rounded-xl bg-[#F5F5F5] text-sm text-[#CCC]">
              Advertentieruimte
            </div>
          </div>
        </div>

        {/* Smaller articles grid */}
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {withImg.slice(1, 7).map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl bg-[#FAFAFA] p-8 sm:p-12">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E85A5A]">
              Elke vrijdag om 15:00
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#1A1A1A]">
              Weekend gepland in 2 minuten
            </h2>
            <p className="mt-2 text-sm text-[#666]">
              De 5 leukste tips. Geen zoeken. Gewoon gaan.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
            <p className="mt-2 text-xs text-[#999]">2.340+ ouders · gratis</p>
          </div>
        </div>
      </section>

      {/* ===== SECTION: Gratis eropuit ===== */}
      {freeEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="mb-8 text-2xl font-extrabold text-[#1A1A1A]">
            <span className="mr-2 inline-block h-1 w-8 bg-[#E85A5A] align-middle" />
            Gratis eropuit
          </h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {freeEvents.map((e) => (
              <EventCard key={e.slug + "-f"} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* ===== SECTION: Film + Theater ===== */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* ===== SECTION: Bij slecht weer ===== */}
      {indoorEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="mb-8 text-2xl font-extrabold text-[#1A1A1A]">
            <span className="mr-2 inline-block h-1 w-8 bg-[#E85A5A] align-middle" />
            Bij slecht weer
          </h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {indoorEvents.map((e) => (
              <EventCard key={e.slug + "-i"} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* ===== AD SPACE ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[#CCC]">
          Advertentie
        </p>
        <div className="flex h-24 items-center justify-center rounded-xl bg-[#F5F5F5] text-sm text-[#CCC]">
          Advertentieruimte
        </div>
      </section>

      {/* ===== SECTION: Sport ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <h2 className="mb-8 text-2xl font-extrabold text-[#1A1A1A]">
          <span className="mr-2 inline-block h-1 w-8 bg-[#E85A5A] align-middle" />
          Sport & buiten
        </h2>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {sportActivities.map((a) => (
            <ActivityCard key={a.slug} activity={a} />
          ))}
        </div>
      </section>

      {/* ===== SECTION: Cultuur & musea ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <h2 className="mb-8 text-2xl font-extrabold text-[#1A1A1A]">
          <span className="mr-2 inline-block h-1 w-8 bg-[#E85A5A] align-middle" />
          Cultuur & musea
        </h2>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {cultureActivities.map((a) => (
            <ActivityCard key={a.slug} activity={a} />
          ))}
        </div>
      </section>

      {/* ===== MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link href="/vakanties" className="group block rounded-2xl bg-[#1A1A1A] p-8 text-white hover:bg-[#2B2B2B] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E85A5A]">26 april – 9 mei</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Meivakantie — jouw weekplan</h2>
          <p className="mt-2 max-w-md text-sm text-white/70">Dagplannen, surfcamps en meer.</p>
          <span className="mt-4 inline-block text-sm font-bold text-[#E85A5A]">Bekijk dagplannen →</span>
        </Link>
      </section>

      {/* ===== BOTTOM NEWSLETTER ===== */}
      <section id="newsletter" className="border-t border-[#F0EBE6] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={36} height={36} className="mx-auto mb-3 h-9 w-auto" />
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Weekend sorted</h2>
            <p className="mt-1 text-sm text-[#666]">Elke vrijdag om 15:00. 5 tips. Klaar.</p>
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
