import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getAllKidsFilms } from "@/data/programming-loader";

export default function FilmVanDeWeek() {
  const films = getAllKidsFilms();

  if (films.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-[#2D2D2D]">
        🎬 Kinderfilms deze week
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {films.map((film) => (
          <Link key={film.slug} href={`/film/${film.slug}`} className="group w-[160px] shrink-0 sm:w-[180px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[16px]">
              <Image
                src={film.image}
                alt={film.title}
                fill
                sizes="180px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {film.ageLabel && (
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2D2D2D] backdrop-blur-sm">
                  {film.ageLabel}
                </span>
              )}
            </div>
            <div className="mt-2 px-0.5">
              <h3 className="text-[13px] font-bold leading-snug text-[#2D2D2D] line-clamp-2 group-hover:text-[#E0685F]">
                {film.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#6B6B6B] line-clamp-1">
                {film.cinema}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {film.times.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#FFF3E0] px-2 py-0.5 text-[10px] font-semibold text-[#A67A40]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
