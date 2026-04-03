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
    <div className="overflow-hidden bg-[#E85A5A] text-white">
      <div className="relative flex items-center py-2">
        <span className="shrink-0 bg-[#D04A4A] px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap">
            <span className="text-sm font-medium">{doubled}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
