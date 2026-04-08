import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getAllSuggestions, getSuggestionBySlug } from "@/data/dutch-calendar";
import { activities } from "@/data/activities";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import ActivityCard from "@/components/ActivityCard";
import { resolveEventImages } from "@/lib/photos";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSuggestions().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tip = getSuggestionBySlug(slug);
  if (!tip) return {};
  return {
    title: `${tip.title} | Berry Kids`,
    description: tip.description,
  };
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params;
  const tip = getSuggestionBySlug(slug);

  if (!tip) notFound();

  const mapQuery = encodeURIComponent(tip.location);

  // Find related activities
  const relatedActivities = tip.relatedActivitySlugs
    ? activities.filter((a) => tip.relatedActivitySlugs!.includes(a.slug))
    : [];
  const relatedWithImages = resolveEventImages(relatedActivities);

  return (
    <div className="min-h-screen">
      <NewsTicker />
      <Header />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[#6B6B6B] transition-colors hover:text-[#2D2D2D]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Terug
        </Link>

        {/* Hero image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={tip.image}
            alt={tip.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#2D2D2D] backdrop-blur-sm">
            {tip.seasonEmoji} {tip.seasonName}tip
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {tip.free ? (
                <span className="rounded-full bg-[#8BC34A]/15 px-3 py-1 text-sm font-semibold text-[#6FAF3A]">
                  Gratis
                </span>
              ) : (
                <span className="rounded-full bg-[#FDDCDA] px-3 py-1 text-sm font-semibold text-[#E0685F]">
                  Betaald
                </span>
              )}
              <span className="rounded-full bg-[#F0E6E0] px-3 py-1 text-sm text-[#6B6B6B]">
                {tip.ageLabel}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-snug text-[#2D2D2D] sm:text-3xl">
              {tip.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#6B6B6B]">
              <svg className="h-5 w-5 shrink-0 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <p className="text-[#2D2D2D]">{tip.location}</p>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#2D2D2D]">
              {tip.fullDescription}
            </p>

            {/* Tips */}
            {tip.tips.length > 0 && (
              <div className="mt-6 rounded-xl bg-[#FDF1EA] p-5">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E0685F]">
                  Tips
                </h2>
                <ul className="space-y-2">
                  {tip.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#2D2D2D]">
                      <span className="mt-0.5 text-[#E0685F]">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar: Map */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[#F0E6E0]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBN-CNaX3zejJ6YsxStrVgLt2tBwfxod5k&q=${mapQuery}`}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Kaart: ${tip.location}`}
              />
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#6B6B6B]">
                Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Locatie</dt>
                  <dd className="text-[#6B6B6B]">{tip.location}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Leeftijd</dt>
                  <dd className="text-[#6B6B6B]">{tip.ageLabel}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Prijs</dt>
                  <dd className="text-[#6B6B6B]">{tip.free ? "Gratis" : "Betaald"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">Seizoen</dt>
                  <dd className="text-[#6B6B6B]">{tip.seasonEmoji} {tip.seasonName}</dd>
                </div>
              </dl>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E0D8D2] px-4 py-2.5 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#E0685F] hover:text-[#E0685F]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              Route plannen
            </a>
          </div>
        </div>

        {/* Related activities */}
        {relatedWithImages.length > 0 && (
          <section className="mt-14 border-t border-[#F0E6E0] pt-8">
            <h2 className="mb-5 text-lg font-bold text-[#2D2D2D]">
              Gerelateerde activiteiten
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWithImages.map((a) => (
                <ActivityCard key={a.slug} activity={a} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="mt-14 rounded-2xl bg-[#FDF1EA] px-6 py-8 text-center">
          <h2 className="text-xl font-extrabold text-[#2D2D2D]">
            Meer seizoenstips?
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Elke week de leukste tips voor het seizoen in je inbox.
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
