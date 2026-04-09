import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { activities } from "@/data/activities";
import { getScrapedEvents } from "@/data/events-loader";
import { resolveEventImages } from "@/lib/photos";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = {
  title: "Meivakantie tips voor kinderen | Berry Kids",
  description:
    "Berry's weekplan voor de meivakantie: elke dag een uitje met je kids in Haarlem en omgeving.",
};

type DayPlan = {
  day: string;
  theme: string;
  emoji: string;
  picks: { slug: string; tip: string }[];
  berryTip: string;
};

const MEI_DAY_PLANS: DayPlan[] = [
  {
    day: "Ma 27 apr",
    theme: "Strand & Surf",
    emoji: "🏄",
    picks: [
      { slug: "zandvoort-strand", tip: "Trein vanuit Haarlem: 20 min" },
      { slug: "pepsports-zandvoort", tip: "Surfles vanaf 6 jaar, €35" },
      { slug: "bloemendaal-strand", tip: "Rustiger dan Zandvoort" },
    ],
    berryTip: "Boek de surfles vooruit — meivakantie is populair!",
  },
  {
    day: "Di 28 apr",
    theme: "Museum & Cultuur",
    emoji: "🎨",
    picks: [
      { slug: "teylers-museum", tip: "Kinderlab: fossielen & proefjes" },
      { slug: "frans-hals-museum", tip: "Schetsboek mee — tekenparcours" },
      { slug: "archeologisch-museum-haarlem", tip: "Museumkaart geldig" },
    ],
    berryTip: "Combineer Teylers + Frans Hals — 10 min lopen van elkaar.",
  },
  {
    day: "Wo 29 apr",
    theme: "Natuur & Dieren",
    emoji: "🐑",
    picks: [
      { slug: "kinderboerderij-t-molentje", tip: "Gratis! Lammetjes aaien" },
      { slug: "kennemerduinen-wandelen", tip: "Kabouterwandeling (2 km)" },
      { slug: "hertenkamp-bloemendaal", tip: "Damherten spotten" },
    ],
    berryTip: "Verrekijker en picknickkleed meenemen!",
  },
  {
    day: "Do 30 apr",
    theme: "Sport & Actief",
    emoji: "🧗",
    picks: [
      { slug: "klimhal-haarlem", tip: "4+ jaar, €12 per kind" },
      { slug: "padel-haarlem", tip: "Speciale kidsuren, rackets te leen" },
      { slug: "street-jump-haarlem", tip: "Trampolinepark — antislip sokken mee" },
    ],
    berryTip: "Geen ervaring nodig bij de Klimmuur — kinderwanden!",
  },
  {
    day: "Vr 1 mei",
    theme: "Creatief & Binnen",
    emoji: "🎭",
    picks: [
      { slug: "stadsbibliotheek-haarlem", tip: "Gratis knutselen in de vakantie" },
      { slug: "filmschuur-haarlem", tip: "Kinderfilm elke dag in de vakantie" },
      { slug: "ontdekplek", tip: "Tech-werkplaats: solderen, bouwen" },
    ],
    berryTip: "Regendag? De bieb heeft elke vakantiedag extra programma.",
  },
  {
    day: "Ma 4 mei",
    theme: "Fietsen & Bloemen",
    emoji: "🌷",
    picks: [
      { slug: "haarlemmerhout", tip: "Start je fietstocht hier" },
      { slug: "buitenplaats-beeckestijn", tip: "Tussenstop met picknick" },
      { slug: "elswout-overveen", tip: "Prachtige tuinen, gratis" },
    ],
    berryTip: "Route via Vogelenzang is het mooist. Neem trein terug!",
  },
  {
    day: "Di 5 mei",
    theme: "Bevrijdingsdag",
    emoji: "🎉",
    picks: [
      { slug: "haarlemmerhout", tip: "Bevrijdingspop — gratis festival" },
      { slug: "linnaeushof", tip: "Grootste speeltuin van Europa" },
      { slug: "spaarnwoude-recreatie", tip: "Fietsen, zwemmen, speelweides" },
    ],
    berryTip: "Hele binnenstad is feest — veel winkels dicht, alle parken open!",
  },
];

const SUMMER_PREVIEW = [
  { emoji: "🏖️", title: "Strandweken", text: "Elke dag strand met activiteiten voor kids" },
  { emoji: "🏄", title: "Surfcamps", text: "Weekcursussen surfen en SUP in Zandvoort" },
  { emoji: "🎪", title: "Zomerfestivals", text: "Muziek, eten en kindertheater in de parken" },
  { emoji: "⛺", title: "Buitenkampen", text: "Natuur- en sportkampen in de regio" },
];

export default function VakantiesPage() {
  // Build activity lookup
  const activityMap = new Map(activities.map((a) => [a.slug, a]));
  const resolvedActivities = resolveEventImages(activities);
  const resolvedMap = new Map(resolvedActivities.map((a) => [a.slug, a]));

  // Get meivakantie events (Apr 25 – May 9)
  const meiEvents = resolveEventImages(
    getScrapedEvents().filter((e) => e.date >= "2026-04-25" && e.date <= "2026-05-09")
  ).filter((e) => e.image !== "/berry-icon.png");

  // Deduplicate events by title
  const seenTitles = new Set<string>();
  const uniqueMeiEvents = meiEvents.filter((e) => {
    if (seenTitles.has(e.title)) return false;
    seenTitles.add(e.title);
    return true;
  }).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
                26 april – 9 mei 2026
              </span>
              <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
                🌷 Meivakantie met Berry
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
                Twee weken geen school! Berry heeft voor elke dag een plan
                gemaakt. Mix en match — of pak er gewoon eentje uit.
              </p>
            </div>
            <div className="hidden sm:block" style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
              <Image
                src="/berry-wink.png"
                alt=""
                width={80}
                height={80}
                className="h-20 w-auto drop-shadow-[0_6px_20px_rgba(224,104,95,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">

        {/* === Real events during meivakantie === */}
        {uniqueMeiEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              📅 Evenementen in de meivakantie
            </h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">
              Echte evenementen die je kunt boeken
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueMeiEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* === Day plans === */}
        <section>
          <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
            🗓️ Berry&apos;s weekplan
          </h2>
          <p className="mt-1 mb-6 text-[14px] font-semibold text-[#6B6B6B]">
            Elke dag een thema — tap voor details
          </p>

          <div className="space-y-4">
            {MEI_DAY_PLANS.map((plan, i) => {
              // Resolve the activity picks
              const pickActivities = plan.picks
                .map((p) => {
                  const resolved = resolvedMap.get(p.slug);
                  return resolved ? { ...resolved, pickTip: p.tip } : null;
                })
                .filter(Boolean) as (typeof resolvedActivities[number] & { pickTip: string })[];

              return (
                <div key={i} className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-[#F5F0EB] bg-[#FFF8F4] px-5 py-3">
                    <span className="text-[24px]">{plan.emoji}</span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#E0685F]">
                        Week {i < 5 ? "1" : "2"} · {plan.day}
                      </p>
                      <p className="text-[16px] font-extrabold text-[#2D2D2D]">{plan.theme}</p>
                    </div>
                  </div>

                  {/* Activity picks with images */}
                  <div className="p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {pickActivities.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/activiteiten/${a.slug}`}
                          className="group flex gap-3 rounded-[14px] bg-[#FAF7F4] p-2.5 transition-all hover:bg-[#F5F0EB] sm:flex-col sm:gap-0 sm:p-0 sm:bg-transparent"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] sm:aspect-[3/2] sm:h-auto sm:w-full sm:rounded-b-none">
                            <Image
                              src={(a as Record<string, unknown>).resolvedImage as string || a.image}
                              alt={a.title}
                              fill
                              sizes="(max-width: 768px) 64px, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            {a.free && (
                              <span className="absolute right-1.5 top-1.5 rounded-full bg-[#4A8060] px-1.5 py-0.5 text-[9px] font-bold text-white">Gratis</span>
                            )}
                          </div>
                          <div className="min-w-0 sm:px-2.5 sm:py-2">
                            <h4 className="text-[14px] font-bold leading-snug text-[#2D2D2D] group-hover:text-[#E0685F]">
                              {a.title}
                            </h4>
                            <p className="mt-0.5 text-[12px] text-[#6B6B6B]">{a.pickTip}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Berry tip */}
                    <div className="mt-3 flex items-start gap-2 rounded-[12px] bg-[#FDF1EA] px-3 py-2.5">
                      <Image src="/berry-icon.png" alt="" width={16} height={16} className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="text-[13px] font-semibold text-[#6B6B6B]">{plan.berryTip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="my-12 border-t border-[#F0E6E0]" />

        {/* Zomervakantie preview */}
        <section>
          <h2 className="text-[22px] font-extrabold text-[#2D2D2D]">
            ☀️ Zomervakantie
          </h2>
          <p className="mt-1 text-[14px] text-[#6B6B6B]">
            4 juli – 16 augustus 2026 · Dagplannen komen in juni
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUMMER_PREVIEW.map((item) => (
              <div key={item.title} className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <span className="text-[28px]">{item.emoji}</span>
                <h3 className="mt-2 text-[15px] font-extrabold text-[#2D2D2D]">{item.title}</h3>
                <p className="mt-1 text-[13px] text-[#6B6B6B]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Later dit jaar */}
        <div className="my-12 border-t border-[#F0E6E0]" />

        <section>
          <h2 className="mb-4 text-[18px] font-extrabold text-[#2D2D2D]">
            Later dit jaar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <span className="text-[24px]">🍂</span>
              <h3 className="mt-2 font-extrabold text-[#2D2D2D]">Herfstvakantie</h3>
              <p className="text-[13px] text-[#6B6B6B]">17 – 25 oktober 2026</p>
              <p className="mt-1 text-[13px] text-[#999]">Tips komen in september</p>
            </div>
            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <span className="text-[24px]">❄️</span>
              <h3 className="mt-2 font-extrabold text-[#2D2D2D]">Kerstvakantie</h3>
              <p className="text-[13px] text-[#6B6B6B]">19 dec – 3 januari 2027</p>
              <p className="mt-1 text-[13px] text-[#999]">Tips komen in november</p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-12 rounded-[24px] bg-[#FDF1EA] p-6 text-center sm:p-8">
          <Image
            src="/berry-wink.png"
            alt=""
            width={48}
            height={48}
            className="mx-auto mb-3 h-auto"
          />
          <h2 className="text-[20px] font-extrabold text-[#2D2D2D]">
            Vakantietips in je inbox
          </h2>
          <p className="mt-1 text-[14px] text-[#6B6B6B]">
            Vlak voor elke vakantie sturen we een compleet weekplan.
          </p>
          <div className="mx-auto mt-4 max-w-sm">
            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
