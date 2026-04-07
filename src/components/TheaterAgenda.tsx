import Image from "next/image";
import { getAllTheaterShows } from "@/data/programming-loader";
import { formatShortDate } from "@/lib/dates";

export default function TheaterAgenda() {
  const upcoming = getAllTheaterShows().slice(0, 6);

  if (upcoming.length === 0) return null;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-extrabold text-[#2D2D2D]">
          🎭 Theater &amp; concerten
        </h2>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {upcoming.map((show, i) => (
          <div
            key={i}
            className={`flex gap-3 p-4 sm:gap-4 sm:p-5 ${
              i < upcoming.length - 1 ? "border-b border-[#F0E6E0]" : ""
            }`}
          >
            {/* Image or date badge */}
            {show.imageUrl ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                <Image
                  src={show.imageUrl}
                  alt={show.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 rounded-tr-lg bg-[#FDF1EA] px-2 py-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#F4A09C]">
                    {formatShortDate(show.date).split(" ")[0]}
                  </span>
                  <span className="ml-1 text-xs font-extrabold text-[#2D2D2D]">
                    {new Date(show.date + "T00:00:00").getDate()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FDF1EA] sm:h-14 sm:w-14">
                <span className="text-xs font-bold uppercase text-[#F4A09C]">
                  {formatShortDate(show.date).split(" ")[0]}
                </span>
                <span className="text-lg font-extrabold leading-none text-[#2D2D2D]">
                  {new Date(show.date + "T00:00:00").getDate()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#2D2D2D]">{show.title}</h3>
              <p className="mt-0.5 text-sm text-[#6B6B6B]">
                {show.venue} · {show.time} · {show.ageLabel}
              </p>
              <p className="mt-1 truncate text-sm text-[#6B6B6B]">{show.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-sm font-semibold text-[#2D2D2D]">{show.price}</span>
              {show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  className="mt-1 block text-xs font-semibold text-[#F4A09C] transition-colors hover:text-[#E88E8A]"
                >
                  Tickets →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
