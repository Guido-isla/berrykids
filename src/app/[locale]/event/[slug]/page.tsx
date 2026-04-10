import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { events as mockEvents } from "@/data/events";
import { getScrapedEvents } from "@/data/events-loader";
import { formatLongDate } from "@/lib/dates";
import { getEventImage, resolveEventImages } from "@/lib/photos";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";

type Props = { params: Promise<{ slug: string }> };

function getAllEvents() {
  const scraped = getScrapedEvents();
  const scrapedSlugs = new Set(scraped.map((e) => e.slug));
  const extras = mockEvents.filter((e) => !scrapedSlugs.has(e.slug));
  return [...scraped, ...extras];
}

export async function generateStaticParams() {
  return ["nl", "en"].flatMap((locale) =>
    getAllEvents().map((e) => ({ locale, slug: e.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getAllEvents().find((e) => e.slug === slug);
  if (!event) return {};
  return {
    title: `${event.title} | Berry Kids`,
    description: event.description,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const allEvents = getAllEvents();
  const event = allEvents.find((e) => e.slug === slug);

  if (!event) notFound();

  const { src, attribution } = getEventImage(event);
  const mapQuery = encodeURIComponent(event.location);

  // Deduplicate by title so multi-day events don't repeat
  const seenTitles = new Set<string>([event.title]);
  const relatedRaw = allEvents
    .filter((e) => {
      if (e.slug === slug || seenTitles.has(e.title)) return false;
      if (e.area !== event.area) return false;
      seenTitles.add(e.title);
      return true;
    })
    .slice(0, 3);
  if (relatedRaw.length < 3) {
    const others = allEvents
      .filter((e) => {
        if (e.slug === slug || seenTitles.has(e.title)) return false;
        seenTitles.add(e.title);
        return true;
      })
      .slice(0, 3 - relatedRaw.length);
    relatedRaw.push(...others);
  }
  const related = resolveEventImages(relatedRaw);

  return (
    <div className="min-h-screen">
      {/* Full-width hero image */}
      <div className="relative h-[280px] sm:h-[380px]">
        <Image
          src={src}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {attribution && (
          <span className="absolute bottom-3 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/80">
            Foto: {attribution}
          </span>
        )}
        {/* Back link */}
        <Link
          href="/evenementen"
          className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-bold text-[#2D2D2D] backdrop-blur-sm transition-colors hover:bg-white sm:left-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Terug
        </Link>
        <div className="absolute right-4 top-4 sm:right-8">
          <ShareButton title={event.title} slug={event.slug} />
        </div>
      </div>

      {/* Colored bar with category + badges */}
      <section className="bg-gradient-to-r from-[#E0685F] to-[#FFD8B0]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-5 py-3 sm:px-8">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[13px] font-bold text-white">
            {event.category}
          </span>
          {event.free ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[13px] font-bold text-[#4A8060]">
              Gratis
            </span>
          ) : event.price ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[13px] font-bold text-[#E0685F]">
              {event.price}
            </span>
          ) : null}
          <span className="rounded-full bg-white/20 px-3 py-1 text-[13px] font-bold text-white">
            {event.ageLabel}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-[13px] font-bold text-white">
            {event.indoor ? "Binnen" : "Buiten"}
          </span>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Content grid: info left, sidebar right */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div>
            {/* Title */}
            <h1 className="text-[24px] font-extrabold leading-snug text-[#2D2D2D] sm:text-[28px] md:text-[32px]">
              {event.title}
            </h1>

            {/* Date, time, location */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 shrink-0 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <div>
                  <p className="font-semibold text-[#2D2D2D]">
                    {formatLongDate(event.date)}
                    {event.endDate && ` – ${formatLongDate(event.endDate)}`}
                  </p>
                  <p className="text-[#6B6B6B]">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 shrink-0 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                </svg>
                <p className="text-[#2D2D2D]">{event.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-[15px] leading-relaxed text-[#2D2D2D]">
                {event.description}
              </p>
            </div>

            {/* Tip */}
            {event.tip && (
              <div className="mt-4 flex items-start gap-2 rounded-[14px] bg-[#FDF1EA] px-4 py-3">
                <Image src="/berry-icon.png" alt="" width={16} height={16} className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-[13px] font-semibold text-[#6B6B6B]">{event.tip}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#E0685F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D05A52]"
                >
                  Meer info & tickets →
                </a>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D8D2] px-4 py-2.5 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#E0685F] hover:text-[#E0685F]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                </svg>
                Route
              </a>
            </div>
          </div>

          {/* Sidebar: Map + details */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[20px] border border-[#F0E6E0]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBN-CNaX3zejJ6YsxStrVgLt2tBwfxod5k&q=${mapQuery}`}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Kaart: ${event.location}`}
              />
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <h3 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Datum</dt>
                  <dd className="text-[#6B6B6B]">
                    {formatLongDate(event.date)}
                    {event.endDate && ` – ${formatLongDate(event.endDate)}`}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Tijd</dt>
                  <dd className="text-[#6B6B6B]">{event.time}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Locatie</dt>
                  <dd className="text-[#6B6B6B]">{event.location}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Prijs</dt>
                  <dd className="text-[#6B6B6B]">{event.free ? "Gratis" : event.price}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Leeftijd</dt>
                  <dd className="text-[#6B6B6B]">{event.ageLabel}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Binnen/Buiten</dt>
                  <dd className="text-[#6B6B6B]">{event.indoor ? "Binnen" : "Buiten"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related events */}
        <section className="mt-14 border-t border-[#F0E6E0] pt-8">
          <h2 className="mb-5 text-[18px] font-extrabold text-[#2D2D2D]">
            Meer in {event.area}
          </h2>
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-3">
            {related.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-14 rounded-[24px] bg-[#FDF1EA] px-6 py-8 text-center">
          <h2 className="text-[20px] font-extrabold text-[#2D2D2D]">
            Elke week de beste tips
          </h2>
          <p className="mt-1 text-[14px] text-[#6B6B6B]">
            Wekelijks een kort overzicht van leuke dingen met kinderen bij jou in de buurt.
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
