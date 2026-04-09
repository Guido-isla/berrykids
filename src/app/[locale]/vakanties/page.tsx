import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
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
  dayNl: string;
  dayEn: string;
  themeNl: string;
  themeEn: string;
  emoji: string;
  picks: { slug: string; tipNl: string; tipEn: string }[];
  berryTipNl: string;
  berryTipEn: string;
};

const MEI_DAY_PLANS: DayPlan[] = [
  {
    dayNl: "Ma 27 apr", dayEn: "Mon 27 Apr",
    themeNl: "Strand & Surf", themeEn: "Beach & Surf",
    emoji: "🏄",
    picks: [
      { slug: "zandvoort-strand", tipNl: "Trein vanuit Haarlem: 20 min", tipEn: "Train from Haarlem: 20 min" },
      { slug: "pepsports-zandvoort", tipNl: "Surfles vanaf 6 jaar, €35", tipEn: "Surf lessons from age 6, €35" },
      { slug: "bloemendaal-strand", tipNl: "Rustiger dan Zandvoort", tipEn: "Quieter than Zandvoort" },
    ],
    berryTipNl: "Boek de surfles vooruit — meivakantie is populair!",
    berryTipEn: "Book surf lessons ahead — spring break is busy!",
  },
  {
    dayNl: "Di 28 apr", dayEn: "Tue 28 Apr",
    themeNl: "Museum & Cultuur", themeEn: "Museum & Culture",
    emoji: "🎨",
    picks: [
      { slug: "teylers-museum", tipNl: "Kinderlab: fossielen & proefjes", tipEn: "Kids lab: fossils & experiments" },
      { slug: "frans-hals-museum", tipNl: "Schetsboek mee — tekenparcours", tipEn: "Bring a sketchbook — drawing trail" },
      { slug: "archeologisch-museum-haarlem", tipNl: "Museumkaart geldig", tipEn: "Museum card accepted" },
    ],
    berryTipNl: "Combineer Teylers + Frans Hals — 10 min lopen van elkaar.",
    berryTipEn: "Combine Teylers + Frans Hals — 10 min walk apart.",
  },
  {
    dayNl: "Wo 29 apr", dayEn: "Wed 29 Apr",
    themeNl: "Natuur & Dieren", themeEn: "Nature & Animals",
    emoji: "🐑",
    picks: [
      { slug: "kinderboerderij-t-molentje", tipNl: "Gratis! Lammetjes aaien", tipEn: "Free! Pet the lambs" },
      { slug: "kennemerduinen-wandelen", tipNl: "Kabouterwandeling (2 km)", tipEn: "Gnome trail (2 km)" },
      { slug: "hertenkamp-bloemendaal", tipNl: "Damherten spotten", tipEn: "Spot fallow deer" },
    ],
    berryTipNl: "Verrekijker en picknickkleed meenemen!",
    berryTipEn: "Bring binoculars and a picnic blanket!",
  },
  {
    dayNl: "Do 30 apr", dayEn: "Thu 30 Apr",
    themeNl: "Sport & Actief", themeEn: "Sports & Active",
    emoji: "🧗",
    picks: [
      { slug: "klimhal-haarlem", tipNl: "4+ jaar, €12 per kind", tipEn: "Ages 4+, €12 per child" },
      { slug: "padel-haarlem", tipNl: "Speciale kidsuren, rackets te leen", tipEn: "Special kids hours, rackets available" },
      { slug: "street-jump-haarlem", tipNl: "Trampolinepark — antislip sokken mee", tipEn: "Trampoline park — bring grip socks" },
    ],
    berryTipNl: "Geen ervaring nodig bij de Klimmuur — kinderwanden!",
    berryTipEn: "No experience needed at Klimmuur — kids' walls!",
  },
  {
    dayNl: "Vr 1 mei", dayEn: "Fri 1 May",
    themeNl: "Creatief & Binnen", themeEn: "Creative & Indoor",
    emoji: "🎭",
    picks: [
      { slug: "stadsbibliotheek-haarlem", tipNl: "Gratis knutselen in de vakantie", tipEn: "Free crafts during holidays" },
      { slug: "filmschuur-haarlem", tipNl: "Kinderfilm elke dag in de vakantie", tipEn: "Kids movie daily during holidays" },
      { slug: "ontdekplek", tipNl: "Tech-werkplaats: solderen, bouwen", tipEn: "Tech workshop: soldering, building" },
    ],
    berryTipNl: "Regendag? De bieb heeft elke vakantiedag extra programma.",
    berryTipEn: "Rainy day? The library has extra activities every holiday.",
  },
  {
    dayNl: "Ma 4 mei", dayEn: "Mon 4 May",
    themeNl: "Fietsen & Bloemen", themeEn: "Cycling & Flowers",
    emoji: "🌷",
    picks: [
      { slug: "haarlemmerhout", tipNl: "Start je fietstocht hier", tipEn: "Start your bike ride here" },
      { slug: "buitenplaats-beeckestijn", tipNl: "Tussenstop met picknick", tipEn: "Picnic stop" },
      { slug: "elswout-overveen", tipNl: "Prachtige tuinen, gratis", tipEn: "Beautiful gardens, free" },
    ],
    berryTipNl: "Route via Vogelenzang is het mooist. Neem trein terug!",
    berryTipEn: "Route via Vogelenzang is prettiest. Take the train back!",
  },
  {
    dayNl: "Di 5 mei", dayEn: "Tue 5 May",
    themeNl: "Bevrijdingsdag", themeEn: "Liberation Day",
    emoji: "🎉",
    picks: [
      { slug: "haarlemmerhout", tipNl: "Bevrijdingspop — gratis festival", tipEn: "Liberation Pop — free festival" },
      { slug: "linnaeushof", tipNl: "Grootste speeltuin van Europa", tipEn: "Europe's biggest playground" },
      { slug: "spaarnwoude-recreatie", tipNl: "Fietsen, zwemmen, speelweides", tipEn: "Cycling, swimming, play fields" },
    ],
    berryTipNl: "Hele binnenstad is feest — veel winkels dicht, alle parken open!",
    berryTipEn: "The whole city centre is a party — most shops closed, all parks open!",
  },
];

export default async function VakantiesPage() {
  const t = await getTranslations("vakantie");
  const tNewsletter = await getTranslations("newsletter");

  // Build activity lookup
  const resolvedActivities = resolveEventImages(activities);
  const resolvedMap = new Map(resolvedActivities.map((a) => [a.slug, a]));

  // Get meivakantie events
  const meiEvents = resolveEventImages(
    getScrapedEvents().filter((e) => e.date >= "2026-04-25" && e.date <= "2026-05-09")
  ).filter((e) => e.image !== "/berry-icon.png");

  const seenTitles = new Set<string>();
  const uniqueMeiEvents = meiEvents.filter((e) => {
    if (seenTitles.has(e.title)) return false;
    seenTitles.add(e.title);
    return true;
  }).slice(0, 6);

  // Detect locale for day plan text
  const locale = t("heroTitle").includes("Spring") ? "en" : "nl";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
                {t("dateRange")}
              </span>
              <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
                {t("heroTitle")}
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
                {t("heroSub")}
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

        {/* Real events */}
        {uniqueMeiEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              {t("eventsTitle")}
            </h2>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">
              {t("eventsSub")}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueMeiEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Day plans */}
        <section>
          <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
            {t("weekPlanTitle")}
          </h2>
          <p className="mt-1 mb-6 text-[14px] font-semibold text-[#6B6B6B]">
            {t("weekPlanSub")}
          </p>

          <div className="space-y-4">
            {MEI_DAY_PLANS.map((plan, i) => {
              const day = locale === "en" ? plan.dayEn : plan.dayNl;
              const theme = locale === "en" ? plan.themeEn : plan.themeNl;
              const berryTip = locale === "en" ? plan.berryTipEn : plan.berryTipNl;

              const pickActivities = plan.picks
                .map((p) => {
                  const resolved = resolvedMap.get(p.slug);
                  const tip = locale === "en" ? p.tipEn : p.tipNl;
                  return resolved ? { ...resolved, pickTip: tip } : null;
                })
                .filter(Boolean) as (typeof resolvedActivities[number] & { pickTip: string })[];

              return (
                <div key={i} className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-3 border-b border-[#F5F0EB] bg-[#FFF8F4] px-5 py-3">
                    <span className="text-[24px]">{plan.emoji}</span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#E0685F]">
                        {t("week")} {i < 5 ? "1" : "2"} · {day}
                      </p>
                      <p className="text-[16px] font-extrabold text-[#2D2D2D]">{theme}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {pickActivities.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/activiteiten/${a.slug}`}
                          className="group flex gap-3 rounded-[14px] bg-[#FAF7F4] p-2.5 transition-all hover:bg-[#F5F0EB] sm:flex-col sm:gap-0 sm:bg-transparent sm:p-0"
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
                              <span className="absolute right-1.5 top-1.5 rounded-full bg-[#4A8060] px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {locale === "en" ? "Free" : "Gratis"}
                              </span>
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

                    <div className="mt-3 flex items-start gap-2 rounded-[12px] bg-[#FDF1EA] px-3 py-2.5">
                      <Image src="/berry-icon.png" alt="" width={16} height={16} className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="text-[13px] font-semibold text-[#6B6B6B]">{berryTip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="my-12 border-t border-[#F0E6E0]" />

        {/* Summer preview */}
        <section>
          <h2 className="text-[22px] font-extrabold text-[#2D2D2D]">{t("summerTitle")}</h2>
          <p className="mt-1 text-[14px] text-[#6B6B6B]">{t("summerDate")}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "🏖️", title: t("summerBeach"), text: t("summerBeachSub") },
              { emoji: "🏄", title: t("summerSurf"), text: t("summerSurfSub") },
              { emoji: "🎪", title: t("summerFestival"), text: t("summerFestivalSub") },
              { emoji: "⛺", title: t("summerCamp"), text: t("summerCampSub") },
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <span className="text-[28px]">{item.emoji}</span>
                <h3 className="mt-2 text-[15px] font-extrabold text-[#2D2D2D]">{item.title}</h3>
                <p className="mt-1 text-[13px] text-[#6B6B6B]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="my-12 border-t border-[#F0E6E0]" />

        {/* Later this year */}
        <section>
          <h2 className="mb-4 text-[18px] font-extrabold text-[#2D2D2D]">{t("laterTitle")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <span className="text-[24px]">🍂</span>
              <h3 className="mt-2 font-extrabold text-[#2D2D2D]">{t("autumnTitle")}</h3>
              <p className="text-[13px] text-[#6B6B6B]">{t("autumnDate")}</p>
              <p className="mt-1 text-[13px] text-[#999]">{t("autumnSub")}</p>
            </div>
            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <span className="text-[24px]">❄️</span>
              <h3 className="mt-2 font-extrabold text-[#2D2D2D]">{t("winterTitle")}</h3>
              <p className="text-[13px] text-[#6B6B6B]">{t("winterDate")}</p>
              <p className="mt-1 text-[13px] text-[#999]">{t("winterSub")}</p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-12 rounded-[24px] bg-[#FDF1EA] p-6 text-center sm:p-8">
          <Image src="/berry-wink.png" alt="" width={48} height={48} className="mx-auto mb-3 h-auto" />
          <h2 className="text-[20px] font-extrabold text-[#2D2D2D]">{t("newsletterTitle")}</h2>
          <p className="mt-1 text-[14px] text-[#6B6B6B]">{t("newsletterSub")}</p>
          <div className="mx-auto mt-4 max-w-sm">
            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
