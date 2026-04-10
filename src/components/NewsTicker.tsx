import { Link } from "@/i18n/navigation";
import { getScrapedEvents } from "@/data/events-loader";
import { formatShortDate } from "@/lib/dates";
import { getTranslations } from "next-intl/server";

export default async function NewsTicker() {
  const t = await getTranslations("ticker");
  const events = getScrapedEvents();
  const now = new Date().toISOString().split("T")[0];

  // Take the next 6 unique-by-title upcoming events
  const seenTitles = new Set<string>();
  const upcoming = events
    .filter((e) => e.date >= now)
    .filter((e) => {
      if (seenTitles.has(e.title)) return false;
      seenTitles.add(e.title);
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  if (upcoming.length === 0) return null;

  return (
    <div className="border-b border-[#F0E6E0] bg-[#FDF1EA]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-2 sm:px-8">
        <span className="hidden shrink-0 rounded-full bg-[#E0685F] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white sm:inline-block">
          {t("label")}
        </span>
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            {upcoming.map((e) => (
              <Link
                key={e.slug}
                href={`/event/${e.slug}`}
                className="group flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#6B6B6B] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:bg-[#FFF3E0] hover:text-[#E0685F]"
              >
                <span className="text-[10px] font-bold uppercase text-[#E0685F]">
                  {formatShortDate(e.date).split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="line-clamp-1 max-w-[180px]">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
