import Image from "next/image";
import { getFilmVanDeWeek } from "@/data/programming-loader";

export default function FilmVanDeWeek() {
  const film = getFilmVanDeWeek();

  return (
    <section>
      <h2 className="mb-4 text-lg font-extrabold text-[#2D2D2D]">
        🎬 Film van de week
      </h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm sm:flex">
        <div className="relative aspect-video sm:aspect-auto sm:w-64 sm:shrink-0">
          <Image
            src={film.image}
            alt={film.title}
            fill
            sizes="(max-width: 640px) 100vw, 256px"
            className="object-cover"
          />
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold text-[#2D2D2D]">{film.title}</h3>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {film.cinema} · {film.ageLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {film.times.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#E0D8D2] bg-[#FFF8F4] px-3 py-1 text-sm font-medium text-[#2D2D2D]"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
            {film.description}
          </p>
        </div>
      </div>
    </section>
  );
}
