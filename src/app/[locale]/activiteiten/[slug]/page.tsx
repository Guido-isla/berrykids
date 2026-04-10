import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { activities } from "@/data/activities";
import { getEventImage, resolveEventImages } from "@/lib/photos";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import NewsletterForm from "@/components/NewsletterForm";
import ActivityCard from "@/components/ActivityCard";
import MapEmbed from "@/components/MapEmbed";

type Props = { params: Promise<{ slug: string }> };

const MONTH_NAMES = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export async function generateStaticParams() {
  return ["nl", "en"].flatMap((locale) =>
    activities.map((a) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = activities.find((a) => a.slug === slug);
  if (!activity) return {};
  return {
    title: `${activity.title} | Berry Kids`,
    description: activity.description,
  };
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("activityDetail");
  const tSubcategory = await getTranslations("subcategory");
  const tAge = await getTranslations("ageLabel");
  const activity = activities.find((a) => a.slug === slug);

  if (!activity) notFound();

  // Safe lookup: try translation, fall back to original Dutch string
  const safeTranslate = (
    translator: (key: string) => string,
    value: string
  ): string => {
    try {
      return translator(value);
    } catch {
      return value;
    }
  };
  const localizedSubcategory = safeTranslate(tSubcategory, activity.subcategory);
  const localizedAgeLabel = safeTranslate(tAge, activity.ageLabel);

  const { src, attribution } = getEventImage(activity);
  const mapQuery = encodeURIComponent(activity.location);

  // Related: same category, then fill with others
  const relatedRaw = activities
    .filter((a) => a.slug !== slug && a.category === activity.category)
    .slice(0, 3);
  if (relatedRaw.length < 3) {
    const others = activities
      .filter((a) => a.slug !== slug && !relatedRaw.includes(a))
      .slice(0, 3 - relatedRaw.length);
    relatedRaw.push(...others);
  }
  const related = resolveEventImages(relatedRaw);

  // Season label
  const seasonLabel = activity.availableMonths
    ? `${MONTH_NAMES[activity.availableMonths[0] - 1]} – ${MONTH_NAMES[activity.availableMonths[activity.availableMonths.length - 1] - 1]}`
    : t("yearRound");

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Back link */}
        <Link
          href="/activiteiten"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[#6B6B6B] transition-colors hover:text-[#2D2D2D]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t("back")}
        </Link>

        {/* Hero image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt={activity.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          {attribution && (
            <span className="absolute bottom-2 right-2 rounded bg-black/40 px-2 py-1 text-xs text-white/80">
              {t("photo")}: {attribution}
            </span>
          )}
        </div>

        {/* Content grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FDDCDA] px-3 py-1 text-sm font-semibold text-[#E0685F]">
                {localizedSubcategory}
              </span>
              {activity.free ? (
                <span className="rounded-full bg-[#8BC34A]/15 px-3 py-1 text-sm font-semibold text-[#6FAF3A]">
                  {t("free")}
                </span>
              ) : (
                <span className="rounded-full bg-[#F0E6E0] px-3 py-1 text-sm text-[#6B6B6B]">
                  {activity.price}
                </span>
              )}
              <span className="rounded-full bg-[#F0E6E0] px-3 py-1 text-sm text-[#6B6B6B]">
                {localizedAgeLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-xl font-extrabold leading-snug text-[#2D2D2D] sm:text-2xl md:text-3xl">
              {activity.title}
            </h1>

            {/* Location & hours */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 shrink-0 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                </svg>
                <p className="text-[#2D2D2D]">{activity.location}</p>
              </div>
              {activity.openingHours && (
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 shrink-0 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p className="text-[#2D2D2D]">{activity.openingHours}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-base leading-relaxed text-[#2D2D2D]">
                {activity.description}
              </p>
            </div>

            {/* Tip */}
            {activity.tip && (
              <div className="mt-4 rounded-xl bg-[#FDF1EA] px-4 py-3">
                <p className="text-sm text-[#6B6B6B]">
                  <span className="font-bold text-[#2D2D2D]">Tip</span> — {activity.tip}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {activity.website && (
                <a
                  href={activity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#E0685F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D05A52]"
                >
                  {t("website")}
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
                {t("route")}
              </a>
              <ShareButton title={activity.title} slug={`activiteiten/${activity.slug}`} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Privacy-friendly click-to-load map */}
            <MapEmbed location={activity.location} />

            {/* Details card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#6B6B6B]">
                {t("details")}
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">{t("location")}</dt>
                  <dd className="text-[#6B6B6B]">{activity.location}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">{t("price")}</dt>
                  <dd className="text-[#6B6B6B]">{activity.free ? t("free") : activity.price}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">{t("age")}</dt>
                  <dd className="text-[#6B6B6B]">{localizedAgeLabel}</dd>
                </div>
                {activity.openingHours && (
                  <div>
                    <dt className="font-semibold text-[#2D2D2D]">{t("openingHours")}</dt>
                    <dd className="text-[#6B6B6B]">{activity.openingHours}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-semibold text-[#2D2D2D]">{t("season")}</dt>
                  <dd className="text-[#6B6B6B]">{seasonLabel}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related activities */}
        <section className="mt-14 border-t border-[#F0E6E0] pt-8">
          <h2 className="mb-5 text-lg font-bold text-[#2D2D2D]">
            {t("moreOf", { subcategory: localizedSubcategory.toLowerCase() })}
          </h2>
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-3">
            {related.map((a) => (
              <ActivityCard key={a.slug} activity={a} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-14 rounded-2xl bg-[#FDF1EA] px-6 py-8 text-center">
          <h2 className="text-xl font-extrabold text-[#2D2D2D]">
            {t("newsletterTitle")}
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {t("newsletterSub")}
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
