import { getScrapedEvents } from "@/data/events-loader";
import { formatShortDate } from "@/lib/dates";

export default function NewsTicker({ label = "DIT WEEKEND" }: { label?: string }) {
  const events = getScrapedEvents();
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date + "T00:00:00") >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const tickerText = upcoming
    .map(
      (e) =>
        `${e.title} — ${formatShortDate(e.date)} · ${e.location}${e.free ? " · Gratis" : ""}`
    )
    .join("     ★     ");

  const doubled = `${tickerText}     ★     ${tickerText}     ★     `;

  return (
    <div className="overflow-hidden border-b border-[#F0ECE8] bg-[#FDF1EA]">
      <div className="relative flex items-center py-2">
        <span className="shrink-0 rounded-sm bg-[#E0685F] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          {label}
        </span>
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap">
            <span className="text-sm font-medium text-[#6B6B6B]">{doubled}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
