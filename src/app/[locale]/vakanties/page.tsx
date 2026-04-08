import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import { activities } from "@/data/activities";
import { resolveEventImages } from "@/lib/photos";
import ActivityCard from "@/components/ActivityCard";

export const metadata: Metadata = {
  title: "Vakantietips voor kinderen | Berry Kids",
  description:
    "Surfcamps, theaterkampen, buitenactiviteiten en meer voor de schoolvakanties.",
};

const MEI_DAY_PLANS = [
  {
    day: "Week 1 · Ma 27 apr",
    theme: "Strand & Surf",
    emoji: "🏄",
    morning: "Surfles bij Pim Mulder in Zandvoort (6+ jaar, vanaf €35). Materiaal inbegrepen, groepsles van 10:00-12:00.",
    afternoon: "Stranddag! Zandkastelen bouwen, vliegeren, en friet bij de strandtent. Trein vanuit Haarlem: 20 min.",
    tip: "Boek de surfles minstens een week vooruit — de meivakantie is populair.",
    links: ["/activiteiten"],
  },
  {
    day: "Week 1 · Di 28 apr",
    theme: "Museum & Cultuur",
    emoji: "🎨",
    morning: "Kinderlab bij Teylers Museum — fossielen onderzoeken en proefjes doen (6-12 jaar). Museumkaart geldig!",
    afternoon: "Schetsboek mee naar het Frans Hals Museum. Kinderen krijgen opdrachten om schilderijen na te tekenen.",
    tip: "Combineer beide musea — ze liggen op 10 minuten lopen van elkaar.",
    links: ["/activiteiten"],
  },
  {
    day: "Week 1 · Wo 29 apr",
    theme: "Natuur & Dieren",
    emoji: "🐑",
    morning: "Lammetjes aaien bij Kinderboerderij De Olievaar (gratis!). Op woensdag is er ook een knutselmiddag.",
    afternoon: "Duinwandeling in de Kennemerduinen — de Kabouterwandeling (2 km) is perfect voor kleintjes. Damherten spotten!",
    tip: "Neem een verrekijker mee. En een picknickkleed voor de lunch in het gras.",
    links: ["/tips/lammetjes-aaien", "/tips/duinwandeling-met-kids"],
  },
  {
    day: "Week 1 · Do 30 apr",
    theme: "Sport & Actief",
    emoji: "🧗",
    morning: "Boulderen bij Klimmuur Haarlem (4+ jaar, €12). Speciale kinderwanden, geen ervaring nodig.",
    afternoon: "Peutergym of padel — Peakz Padel heeft speciale kidsuren. Rackets te leen.",
    tip: "Bij Klimmuur kun je ook een kinderfeestje boeken als je dat wilt combineren.",
    links: ["/activiteiten"],
  },
  {
    day: "Week 1 · Vr 1 mei",
    theme: "Creatief & Binnen",
    emoji: "🎭",
    morning: "Knutselen in de Stadsbibliotheek (gratis met bibpas). Elke vakantiedag extra programma.",
    afternoon: "Kinderfilm in De Schuur — elke dag een andere film tijdens de meivakantie. Gezellig en intiem.",
    tip: "Check de Schuur website voor het actuele filmprogramma.",
    links: ["/activiteiten"],
  },
  {
    day: "Week 2 · Ma 4 mei",
    theme: "Fietsen & Bloemen",
    emoji: "🌷",
    morning: "Fietstocht door de Bollenstreek! De tulpen en hyacinten staan nog in bloei. Route Haarlem → Lisse (25 km).",
    afternoon: "Picknick onderweg bij een van de dorpjes. IJsje bij de boerderijwinkel.",
    tip: "De route via Vogelenzang is het mooist. Neem de trein terug als de kleintjes moe zijn.",
    links: ["/tips/fietstocht-bollenstreek"],
  },
  {
    day: "Week 2 · Di 5 mei",
    theme: "Bevrijdingsdag!",
    emoji: "🎉",
    morning: "Bevrijdingsdag! Bevrijdingspop in Haarlem — gratis festival met muziek en kinderactiviteiten.",
    afternoon: "Kindervrijmarkt en spelletjes op het Frederiksplein. De hele binnenstad is feest.",
    tip: "Bevrijdingsdag is een nationale feestdag — veel winkels zijn dicht maar alle parken en festivals zijn open.",
    links: ["/"],
  },
];

const SUMMER_PREVIEW = [
  { emoji: "🏖️", title: "Strandweken", text: "Elke dag strand met activiteiten voor kids" },
  { emoji: "🏄", title: "Surfcamps", text: "Weekcursussen surfen en SUP in Zandvoort" },
  { emoji: "🎪", title: "Zomerfestivals", text: "Muziek, eten en kindertheater in de parken" },
  { emoji: "⛺", title: "Buitenkampen", text: "Natuur- en sportkampen in de regio" },
];

export default function VakantiesPage() {
  const sportActivities = resolveEventImages(
    activities.filter((a) => a.category === "sport").slice(0, 3)
  );

  return (
    <div className="min-h-screen">
      <NewsTicker />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF8F4]">
        <div className="mx-auto max-w-[880px] px-5 py-10 sm:px-8 sm:py-14">
          <h1 className="text-3xl font-extrabold leading-tight text-[#2D2D2D] sm:text-4xl">
            Schoolvakanties
          </h1>
          <p className="mt-2 max-w-lg text-base text-[#6B6B6B] sm:text-lg">
            Dagplannen, camps en activiteiten voor elke vakantieperiode.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[880px] px-5 py-8 sm:px-8">

        {/* Meivakantie — fully planned out */}
        <section>
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#E0685F] to-[#FFD8B0] p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  26 april – 9 mei 2026
                </span>
                <h2 className="mt-1 text-xl font-extrabold text-[#2D2D2D] sm:text-2xl md:text-3xl">
                  🌷 Meivakantie — jouw weekplan
                </h2>
                <p className="mt-2 max-w-lg text-sm text-[#2D2D2D]/70">
                  Twee weken geen school! Berry heeft voor elke dag een plan gemaakt.
                  Mix en match — of gebruik het als inspiratie.
                </p>
              </div>
              <Image
                src="/berry-wink.png"
                alt=""
                width={64}
                height={64}
                className="hidden h-auto shrink-0 sm:block"
              />
            </div>
          </div>

          {/* Day plans */}
          <div className="space-y-4">
            {MEI_DAY_PLANS.map((plan, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  {/* Day label */}
                  <div className="flex w-full shrink-0 flex-row items-center gap-2 bg-[#FFF8F4] p-3 sm:w-24 sm:flex-col sm:justify-center sm:gap-0">
                    <span className="text-2xl">{plan.emoji}</span>
                    <span className="mt-1 text-center text-xs font-bold uppercase leading-tight text-[#E0685F]">
                      {plan.theme}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5">
                    <p className="text-xs font-bold text-[#6B6B6B]">{plan.day}</p>

                    <div className="mt-2 space-y-2">
                      <div className="rounded-lg bg-[#FFF8F4] px-3 py-2">
                        <p className="text-[13px] text-[#2D2D2D]">
                          <span className="font-bold">☀️ Ochtend:</span> {plan.morning}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#FFF8F4] px-3 py-2">
                        <p className="text-[13px] text-[#2D2D2D]">
                          <span className="font-bold">🌤️ Middag:</span> {plan.afternoon}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-[#6B6B6B]">
                      💡 {plan.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA: sport activities for meivakantie */}
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-extrabold text-[#2D2D2D]">
              Sportcamps in de meivakantie
            </h3>
            <div className="grid gap-5 sm:grid-cols-3">
              {sportActivities.map((a) => (
                <ActivityCard key={a.slug} activity={a} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-12 border-t border-[#F0E6E0]" />

        {/* Zomervakantie preview */}
        <section>
          <h2 className="text-2xl font-extrabold text-[#2D2D2D]">
            ☀️ Zomervakantie
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            4 juli – 16 augustus 2026 · Dagplannen komen in juni
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUMMER_PREVIEW.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="mt-2 font-bold text-[#2D2D2D]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#6B6B6B]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other vacations — compact */}
        <div className="my-12 border-t border-[#F0E6E0]" />

        <section>
          <h2 className="mb-4 text-lg font-extrabold text-[#2D2D2D]">
            Later dit jaar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-lg">🍂</p>
              <h3 className="mt-1 font-bold text-[#2D2D2D]">Herfstvakantie</h3>
              <p className="text-sm text-[#6B6B6B]">17 – 25 oktober 2026</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">Tips komen in september</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-lg">❄️</p>
              <h3 className="mt-1 font-bold text-[#2D2D2D]">Kerstvakantie</h3>
              <p className="text-sm text-[#6B6B6B]">19 dec – 3 januari 2027</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">Tips komen in november</p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-12 rounded-2xl bg-[#FDF1EA] p-8 text-center">
          <Image
            src="/berry-wink.png"
            alt=""
            width={48}
            height={48}
            className="mx-auto mb-3 h-auto"
          />
          <h2 className="text-xl font-extrabold text-[#2D2D2D]">
            Vakantietips in je inbox
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
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
