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
import { formatShortDate } from "@/lib/dates";

function whyLine(t: string, free: boolean, indoor: boolean): string {
  const m: Record<string, string> = {
    "Mike & Molly": "Meezingen, lachen en dansen — altijd een hit",
    "Taartrovers": "Eerste bioscoopje voor peuters — kort en lief",
    "Kweekmarkt": "Struinen en proeven tussen de kramen",
    "OPLOS": "Hiphop, dans en workshops",
    "Paasontbijt": "Gezellig ontbijten voor het festival",
    "Kunstspeeltuin": "Zelf bouwen en ontdekken",
    "Vilt": "Rustig en zintuiglijk voor de allerkleinsten",
    "Okapi": "Muzikaal landschap van klank en klei",
    "Houtje": "Grappig theater dat kleintjes meepakt",
    "Springer": "Natuur ontdekken met alle zintuigen",
  };
  for (const [k, v] of Object.entries(m)) { if (t.includes(k)) return v; }
  if (free && !indoor) return "Gratis en lekker buiten";
  if (free) return "Gratis en gezellig";
  return "Leuk voor het hele gezin";
}

export default async function Home() {
  const events = getScrapedEvents();
  const all = resolveEventImages(events);
  const ctx = await getSiteContext();

  const withImg = all.filter((e) => e.image !== "/berry-icon.png");
  const subPicks = withImg.slice(0, 3);
  const freeEvents = withImg.filter((e) => e.free).slice(0, 3);
  const indoorEvents = withImg.filter((e) => e.indoor).slice(0, 3);
  const sportAct = resolveAct(activities.filter((a) => a.category === "sport").slice(0, 3));
  const cultAct = resolveAct(activities.filter((a) => a.category === "cultuur" || a.category === "indoor").slice(0, 3));

  const heroSlides = withImg.slice(0, 5).map((e) => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    image: e.resolvedImage || e.image,
    location: e.location,
    free: e.free,
  }));

  const topPick = withImg[0];
  // Berry tip — short
  let berryTip = "Scroll naar beneden voor de leukste tips deze week!";
  if (ctx.calendar.holidayName?.includes("Paas") && topPick) {
    berryTip = `Fijne Pasen! 🥚 Tip: ${topPick.title} — ${whyLine(topPick.title, topPick.free, topPick.indoor).toLowerCase()}.`;
  } else if (ctx.weather.isRainy && indoorEvents[0]) {
    berryTip = `Het regent 🌧️ Ga naar ${indoorEvents[0].title} — lekker binnen!`;
  } else if (ctx.weather.isGoodWeather && topPick) {
    berryTip = `${ctx.weather.current.temp}°C en zonnig! Tip: ${topPick.title}. Ga eropuit!`;
  } else if (topPick) {
    berryTip = `Mijn tip: ${topPick.title} in ${topPick.location}. ${topPick.free ? "Gratis!" : ""}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== HERO — Rotating event slideshow ===== */}
      <HeroSlideshow
        slides={heroSlides}
        dateLine={`${ctx.calendar.todayLabel} · ${ctx.weather.current.icon} ${ctx.weather.current.temp}°C`}
      />


      {/* ===== BERRY SPEECH BUBBLE ===== */}
      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-10">
        <div className="flex items-start gap-3">
          <div className="animate-berry-bounce shrink-0">
            <Image src="/berry-wink.png" alt="" width={48} height={48} className="h-12 w-auto" />
          </div>
          <div className="relative animate-berry-fade-in">
            <div className="absolute -left-2 top-4 h-0 w-0 border-y-[7px] border-r-[9px] border-y-transparent border-r-[#F0ECE8]" />
            <div className="max-w-[28rem] rounded-2xl bg-[#F0ECE8] px-5 py-3.5">
              <p className="text-[15px] leading-relaxed text-[#1A1A1A]">{berryTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FILTERS — "Wat te doen in Haarlem" ===== */}
      <div className="mx-auto max-w-[1200px] px-5 pb-10 sm:px-10">
        <h2 className="text-center text-[28px] font-extrabold tracking-tight text-[#1A1A1A]">
          Wat te doen in Haarlem
        </h2>
        <div className="mt-5 flex justify-center gap-3">
          {["Vandaag", "Dit weekend", "Deze week", "Deze maand"].map((label) => (
            <span key={label} className="cursor-pointer rounded-full bg-[#E85A5A] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#D04A4A]">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ===== AD SPACE ===== */}
      <div className="mx-auto max-w-[1200px] px-5 pb-10 sm:px-10">
        <p className="mb-1.5 text-center text-[10px] uppercase tracking-widest text-[#CCC]">Advertentie</p>
        <div className="flex h-[90px] items-center justify-center rounded bg-[#F5F5F5] text-[13px] text-[#CCC]">
          Advertentieruimte
        </div>
      </div>

      {/* ===== DIT WEEKEND — Time Out grid ===== */}
      <section className="mx-auto max-w-[1200px] px-5 pt-4 sm:px-10">
        <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
          <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
          Dit weekend
        </h2>
        <div className="grid gap-8 lg:grid-cols-[5fr_2fr]">
          <div>
            {withImg[0] && <EventCard event={withImg[0]} />}
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {withImg.slice(1, 5).map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-widest text-[#CCC]">Advertentie</p>
            <div className="flex h-[600px] items-center justify-center rounded bg-[#F5F5F5] text-[13px] text-[#CCC]">
              Advertentie
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-10">
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

      {/* ===== GRATIS ===== */}
      {freeEvents.length > 0 && (
        <section className="bg-[#FAF8F6] py-20">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
            <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
              <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
              Gratis eropuit
            </h2>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {freeEvents.map((e) => <EventCard key={e.slug + "-f"} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== FILM + THEATER ===== */}
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <FilmVanDeWeek />
          <TheaterAgenda />
        </div>
      </div>

      {/* ===== BIJ REGEN ===== */}
      {indoorEvents.length > 0 && (
        <section className="bg-[#FAF8F6] py-20">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
            <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
              <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
              Bij slecht weer
            </h2>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {indoorEvents.map((e) => <EventCard key={e.slug + "-i"} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== AD ===== */}
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-10">
        <p className="mb-1.5 text-center text-[10px] uppercase tracking-widest text-[#CCC]">Advertentie</p>
        <div className="flex h-[90px] items-center justify-center rounded bg-[#F5F5F5] text-[13px] text-[#CCC]">Advertentieruimte</div>
      </div>

      {/* ===== SPORT ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-10">
        <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
          <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
          Sport & buiten
        </h2>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {sportAct.map((a) => <ActivityCard key={a.slug} activity={a} />)}
        </div>
      </section>

      {/* ===== CULTUUR ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-10">
        <h2 className="mb-8 text-[26px] font-extrabold tracking-tight text-[#1A1A1A]">
          <span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />
          Cultuur & musea
        </h2>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {cultAct.map((a) => <ActivityCard key={a.slug} activity={a} />)}
        </div>
      </section>

      {/* ===== MEIVAKANTIE ===== */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-10">
        <Link href="/vakanties" className="group block bg-[#1A1A1A] p-8 text-white hover:bg-[#2A2A2A] sm:p-10">
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
