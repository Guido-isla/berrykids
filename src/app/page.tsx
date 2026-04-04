import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import FilmVanDeWeek from "@/components/FilmVanDeWeek";
import TheaterAgenda from "@/components/TheaterAgenda";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import { getSiteContext } from "@/lib/context";
import { formatShortDate } from "@/lib/dates";

function getWhyLine(event: { title: string; free: boolean; indoor: boolean }): string {
  const lines: Record<string, string> = {
    "Mike & Molly": "Meezingen, lachen en dansen — altijd een hit",
    "Taartrovers": "Eerste bioscoopje! Kort en speciaal voor peuters",
    "Kweekmarkt": "Struinen, proeven en snuffelen tussen de kramen",
    "OPLOS": "Hiphop, dans en workshops — energie kwijt!",
    "Paasontbijt": "Gezellig ontbijten voor het festival begint",
    "Kunstspeeltuin": "Zelf bouwen en ontdekken, geen regels",
    "Vilt": "Rustig en zintuiglijk — perfect voor je allerkleinste",
    "Okapi": "Muzikaal landschap van klank en klei",
    "Stilte": "Betoverend — zachte klanken en licht voor baby's",
    "Houtje": "Grappig theater dat kleintjes helemaal meepakt",
    "Mijn vlek": "Woordloos en visueel — werkt in elke taal",
    "Springer": "Natuur ontdekken met alle zintuigen",
    "Koningsconcert": "Het Kennemer Jeugdorkest in actie",
    "gele duikmachine": "Beatles voor kinderen — magisch!",
  };
  for (const [key, val] of Object.entries(lines)) {
    if (event.title.includes(key)) return val;
  }
  if (event.free && !event.indoor) return "Gratis en lekker buiten";
  if (event.free) return "Gratis en lekker binnen";
  if (event.indoor) return "Regenproof en gezellig";
  return "Leuk voor het hele gezin";
}

export default async function Home() {
  const events = getScrapedEvents();
  const all = resolveEventImages(events);
  const ctx = await getSiteContext();

  // Categorize
  const withImage = all.filter((e) => e.image !== "/berry-icon.png");
  const hero = withImage[0];
  const freeEvents = withImage.filter((e) => e.free).slice(0, 3);
  const indoorEvents = withImage.filter((e) => e.indoor).slice(0, 3);
  const weekendEvents = withImage.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <NewsTicker label={ctx.ticker.label} />
      <Header />

      {/* HERO — editorial, one big story */}
      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-semibold text-[#E85A5A]">
          {ctx.weather.current.icon} {ctx.weather.current.temp}°C · {ctx.calendar.todayLabel}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
          Dit weekend met kinderen in Haarlem
        </h1>
        <p className="mt-2 max-w-xl text-base text-[#666]">
          De beste uitjes, events en activiteiten — elke week vers geselecteerd.
        </p>
      </section>

      {/* Hero card — one dominant pick */}
      {hero && (
        <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
          <Link href={`/event/${hero.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[21/9] sm:aspect-[2.5/1]">
                <Image
                  src={hero.resolvedImage || hero.image}
                  alt={hero.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)" }}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                  {hero.category} · {formatShortDate(hero.date)}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                  {hero.title}
                </h2>
                <p className="mt-1 max-w-lg text-sm text-white/90 sm:text-base">
                  {getWhyLine(hero)}. {hero.location}.
                  {hero.free ? " Gratis." : ""}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Berry's tip — compact inline */}
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="flex items-center gap-3 rounded-xl border border-[#F0EBE6] bg-[#FDFBF9] p-4">
          <div className="animate-berry-bounce shrink-0">
            <Image src="/berry-wink.png" alt="" width={36} height={36} className="h-9 w-auto" />
          </div>
          <p className="text-sm text-[#1A1A1A]">
            <span className="font-bold text-[#E85A5A]">Berry&apos;s tip:</span>{" "}
            {hero ? (
              <>
                Ga naar{" "}
                <Link href={`/event/${hero.slug}`} className="font-bold text-[#E85A5A] underline decoration-[#E85A5A]/30 underline-offset-2 hover:text-[#D04A4A]">
                  {hero.title}
                </Link>{" "}— {getWhyLine(hero).toLowerCase()}.
              </>
            ) : (
              "Scroll naar beneden voor alle tips."
            )}
          </p>
        </div>
      </section>

      {/* SECTION: Dit weekend */}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Dit weekend</h2>
          <p className="mt-1 text-sm text-[#666]">
            {weekendEvents.length} events in Haarlem e.o.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {weekendEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER — editorial break */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl bg-[#FAFAFA] p-8 sm:p-12">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E85A5A]">
              Elke vrijdag om 15:00
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl">
              Weekend gepland in 2 minuten
            </h2>
            <p className="mt-2 text-sm text-[#666]">
              De 5 leukste dingen om te doen met kinderen dit weekend. Geen zoeken. Gewoon gaan.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
            <p className="mt-2 text-xs text-[#999]">
              2.340+ ouders · gratis · altijd opzegbaar
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Gratis eropuit */}
      {freeEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Gratis eropuit</h2>
            <p className="mt-1 text-sm text-[#666]">
              Leuke dingen die niks kosten
            </p>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {freeEvents.map((event) => (
              <EventCard key={event.slug + "-free"} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION: Bij slecht weer */}
      {indoorEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Bij slecht weer</h2>
            <p className="mt-1 text-sm text-[#666]">
              Regenproof en gezellig — lekker binnen
            </p>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {indoorEvents.map((event) => (
              <EventCard key={event.slug + "-indoor"} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Film + Theater */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* Meivakantie banner */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link href="/vakanties" className="group block rounded-2xl bg-[#1A1A1A] p-8 text-white transition-colors hover:bg-[#2B2B2B] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E85A5A]">
            26 april – 9 mei
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Meivakantie — jouw weekplan
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/70">
            Dagplannen, surfcamps en meer. Twee weken geen school, twee weken vol.
          </p>
          <span className="mt-4 inline-block text-sm font-bold text-[#E85A5A]">
            Bekijk dagplannen →
          </span>
        </Link>
      </section>

      {/* Altijd leuk */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Altijd leuk</h2>
            <p className="mt-1 text-sm text-[#666]">
              Sportclubs, musea en kinderboerderijen — elk moment
            </p>
          </div>
          <Link href="/activiteiten" className="text-sm font-bold text-[#E85A5A] hover:text-[#D04A4A]">
            Alles bekijken →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "⚽", label: "Sport", sub: "6 clubs" },
            { icon: "🎨", label: "Cultuur", sub: "3 musea" },
            { icon: "🐑", label: "Dieren", sub: "2 boerderijen" },
            { icon: "🏠", label: "Indoor", sub: "3 plekken" },
          ].map((c) => (
            <Link key={c.label} href="/activiteiten" className="flex items-center gap-4 rounded-xl border border-[#F0EBE6] p-5 transition-colors hover:border-[#E85A5A]/30 hover:bg-[#FDFBF9]">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-bold text-[#1A1A1A]">{c.label}</p>
                <p className="text-sm text-[#666]">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom newsletter */}
      <section id="newsletter" className="border-t border-[#F0EBE6] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <Image src="/berry-wink.png" alt="" width={40} height={40} className="mx-auto mb-4 h-10 w-auto" />
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">
              Weekend sorted
            </h2>
            <p className="mt-1 text-sm text-[#666]">
              Elke vrijdag om 15:00. De 5 beste tips. Klaar.
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
