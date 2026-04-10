import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";
import GoTogetherButton from "@/components/GoTogetherButton";
import { getAllKidsFilms, getFilmBySlug } from "@/data/programming-loader";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return ["nl", "en"].flatMap((locale) =>
    getAllKidsFilms().map((f) => ({ locale, slug: f.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilmBySlug(slug);
  if (!film) return {};
  return {
    title: `${film.title} | Berry Kids`,
    description: film.description,
  };
}

export default async function FilmPage({ params }: Props) {
  const { slug } = await params;
  const film = getFilmBySlug(slug);

  if (!film) notFound();

  const t = await getTranslations("home");
  const allFilms = getAllKidsFilms().filter((f) => f.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[880px] px-4 py-6 sm:px-8">
        {/* Back */}
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1 text-[13px] text-[#6B6B6B] hover:text-[#2D2D2D]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Berry Kids
        </Link>

        {/* Hero */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm sm:flex">
          <div className="relative aspect-[2/3] sm:aspect-auto sm:w-[280px] sm:shrink-0">
            <Image
              src={film.image}
              alt={film.title}
              fill
              sizes="(max-width: 640px) 100vw, 280px"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-5 sm:p-7">
            <span className="rounded-full bg-[#E0685F]/10 px-3 py-1 text-[11px] font-bold text-[#E0685F]">
              {film.ageLabel}
            </span>
            <h1 className="mt-3 text-[24px] font-black leading-[1.1] tracking-[-0.5px] text-[#1A1A1A] sm:text-[28px]">
              {film.title}
            </h1>
            <p className="mt-1 text-[14px] font-semibold text-[#6B6B6B]">
              📍 {film.cinema}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#2D2D2D]">
              {film.description}
            </p>

            {/* Showtimes */}
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#888]">Speeltijden</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {film.times.map((time) => (
                  <span
                    key={time}
                    className="rounded-full bg-[#FFF3E0] px-3 py-1.5 text-[13px] font-semibold text-[#A67A40]"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              <GoTogetherButton title={film.title} slug={`film/${film.slug}`} />
            </div>
          </div>
        </div>

        {/* Other films */}
        {allFilms.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-[18px] font-extrabold text-[#2D2D2D]">
              Ook in de bioscoop
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-none sm:grid sm:grid-cols-3">
              {allFilms.map((f) => (
                <Link key={f.slug} href={`/film/${f.slug}`} className="group w-[140px] shrink-0 sm:w-auto">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-[16px]">
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      sizes="140px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2D2D2D]">
                      {f.ageLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] font-bold leading-snug text-[#2D2D2D] group-hover:text-[#E0685F]">
                    {f.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#6B6B6B]">{f.cinema}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
