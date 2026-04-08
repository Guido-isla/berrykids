import Image from "next/image";
import { getAllTheaterShows } from "@/data/programming-loader";
import { formatShortDate } from "@/lib/dates";

export default function TheaterAgenda() {
  const upcoming = getAllTheaterShows().slice(0, 6);

  if (upcoming.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-[#2D2D2D]">
        🎭 Theater &amp; concerten
      </h2>
      <div className="overflow-hidden rounded-[20px] bg-white shadow-sm">
        {upcoming.map((show, i) => (
          <a
            key={i}
            href={show.ticketUrl || "#"}
            target={show.ticketUrl ? "_blank" : undefined}
            rel={show.ticketUrl ? "noopener noreferrer" : undefined}
            className={`flex gap-3 p-3 transition-colors hover:bg-[#FFF9F0] sm:p-4 ${
              i < upcoming.length - 1 ? "border-b border-[#F0E6E0]" : ""
            }`}
          >
            {/* Date badge */}
            {show.imageUrl ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] sm:h-16 sm:w-16">
                <Image
                  src={show.imageUrl}
                  alt={show.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 rounded-tr-lg bg-[#FDF1EA] px-1.5 py-0.5">
                  <span className="text-[9px] font-bold uppercase text-[#E0685F]">
                    {formatShortDate(show.date).split(" ")[0]}
                  </span>
                  <span className="ml-0.5 text-[11px] font-extrabold text-[#2D2D2D]">
                    {new Date(show.date + "T00:00:00").getDate()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#FDF1EA]">
                <span className="text-[10px] font-bold uppercase text-[#E0685F]">
                  {formatShortDate(show.date).split(" ")[0]}
                </span>
                <span className="text-[16px] font-extrabold leading-none text-[#2D2D2D]">
                  {new Date(show.date + "T00:00:00").getDate()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-bold text-[#2D2D2D] line-clamp-1 sm:text-[14px]">{show.title}</h3>
              <p className="mt-0.5 text-[11px] text-[#6B6B6B] line-clamp-1 sm:text-[12px]">
                {show.venue} · {show.time} · {show.ageLabel}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#2D2D2D]">{show.price}</span>
                {show.ticketUrl && (
                  <span className="text-[11px] font-semibold text-[#E0685F]">Tickets →</span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
