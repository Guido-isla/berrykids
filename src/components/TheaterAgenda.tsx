import { getAllTheaterShows } from "@/data/programming-loader";
import { formatShortDate } from "@/lib/dates";

export default function TheaterAgenda() {
  const upcoming = getAllTheaterShows().slice(0, 6);

  if (upcoming.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#2B2B2B]">
          🎭 Theater &amp; concerten
        </h2>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {upcoming.map((show, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-5 ${
              i < upcoming.length - 1 ? "border-b border-[#F0E6E0]" : ""
            }`}
          >
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FDF1EA]">
              <span className="text-xs font-bold uppercase text-[#E85A5A]">
                {formatShortDate(show.date).split(" ")[0]}
              </span>
              <span className="text-lg font-extrabold leading-none text-[#2B2B2B]">
                {new Date(show.date + "T00:00:00").getDate()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2B2B2B]">{show.title}</h3>
              <p className="mt-0.5 text-sm text-[#6B6B6B]">
                {show.venue} · {show.time} · {show.ageLabel}
              </p>
              <p className="mt-1 text-sm text-[#6B6B6B]">{show.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-sm font-semibold text-[#2B2B2B]">{show.price}</span>
              {show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  className="mt-1 block text-xs font-semibold text-[#E85A5A] transition-colors hover:text-[#D04A4A]"
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
