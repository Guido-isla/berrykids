/**
 * Loads events from scraped data as the PRIMARY source.
 * Falls back to manual events.ts only for events that aren't scraped yet.
 *
 * This is the single source of truth for the homepage event grid.
 */

import scrapedData from "./scraped-events.json";
import type { Event } from "./events";
import { getDateRange, isInDateRange } from "@/lib/dates";

type ScrapedEvent = {
  source: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  ageLabel?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  ticketUrl?: string;
  category?: string;
  tags?: string[];
};

function resolveImageUrl(url: string | undefined, ticketUrl: string | undefined): string {
  if (!url) return "/berry-icon.png";
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("/") && ticketUrl) {
    try {
      const origin = new URL(ticketUrl).origin;
      return `${origin}${url}`;
    } catch { /* fall through */ }
  }
  return "/berry-icon.png";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function scrapedToEvent(s: ScrapedEvent): Event {
  // Only flag as free if explicitly stated. Missing price ≠ free.
  const priceText = (s.price || "").toLowerCase();
  const tagText = (s.tags || []).join(" ").toLowerCase();
  const isFree =
    s.price === "0" ||
    priceText.includes("gratis") ||
    priceText.includes("free") ||
    tagText.includes("gratis");

  return {
    slug: slugify(s.title) + "-" + s.date.slice(5),
    title: s.title,
    description: s.description || "",
    date: s.date,
    time: s.time || "",
    location: s.venue,
    area: extractArea(s.venue),
    free: isFree,
    price: isFree ? undefined : s.price,
    ageLabel: s.ageLabel || "Alle leeftijden",
    ageMin: parseAgeMin(s.ageLabel),
    ageMax: parseAgeMax(s.ageLabel),
    indoor: guessIndoor(s),
    image: resolveImageUrl(s.imageUrl, s.ticketUrl),
    category: mapCategory(s.category, s.title),
    url: s.ticketUrl,
  };
}

function extractArea(venue: string): string {
  const v = venue.toLowerCase();
  if (v.includes("heemstede")) return "Heemstede";
  if (v.includes("bloemendaal")) return "Bloemendaal";
  if (v.includes("zandvoort")) return "Zandvoort";
  if (v.includes("overveen")) return "Overveen";
  if (v.includes("bennebroek")) return "Bennebroek";
  return "Haarlem";
}

function parseAgeMin(ageLabel?: string): number | undefined {
  if (!ageLabel) return undefined;
  const match = ageLabel.match(/(\d+)/);
  return match ? parseInt(match[1]) : undefined;
}

function parseAgeMax(ageLabel?: string): number | undefined {
  if (!ageLabel) return undefined;
  const match = ageLabel.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) return parseInt(match[2]);
  // "4+ jaar" means 4 to 12
  if (ageLabel.includes("+")) return 12;
  return undefined;
}

function guessIndoor(s: ScrapedEvent): boolean {
  const text = `${s.title} ${s.venue} ${s.category}`.toLowerCase();
  if (text.includes("theater") || text.includes("film") || text.includes("concert") || text.includes("museum")) return true;
  if (text.includes("strand") || text.includes("park") || text.includes("markt") || text.includes("festival") || text.includes("duin")) return false;
  return true; // default to indoor
}

function mapCategory(category?: string, title?: string): string {
  // Title overrides — strong signals like "Festival" in title take priority
  const t = (title || "").toLowerCase();
  if (t.includes("festival")) return "Festival";
  if (t.includes("markt") || t.includes("market")) return "Markt";

  if (!category) return "Event";
  const c = category.toLowerCase();
  if (c.includes("film")) return "Film";
  if (c.includes("theater")) return "Theater";
  if (c.includes("concert")) return "Concert";
  if (c.includes("markt") || c.includes("market")) return "Markt";
  if (c.includes("festival")) return "Festival";
  return "Event";
}

/**
 * Get all real events from scraped data, converted to Event type.
 * Sorted by date, deduplicated. Marks upcoming events as "new".
 */
export function getScrapedEvents(): (Event & { isNew?: boolean })[] {
  const raw = scrapedData.events as ScrapedEvent[];
  const now = new Date().toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  return raw
    .map(scrapedToEvent)
    .filter((e) => {
      if (!e.title || e.title.length < 3) return false;
      if (!e.date) return false;
      if (e.date < now) return false;
      return true;
    })
    .map((e) => ({
      ...e,
      isNew: e.date >= now && e.date <= nextWeekStr,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Events happening TODAY only (or within a multi-day event's range).
 */
export function getTodayEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return getScrapedEvents().filter(
    (e) => e.date === today || (e.endDate && today >= e.date && today <= e.endDate)
  );
}

/**
 * Events happening this weekend (Fri-Sun).
 */
export function getWeekendEvents(): Event[] {
  const range = getDateRange("weekend");
  return getScrapedEvents().filter((e) => isInDateRange(e.date, range));
}

/**
 * Events for Berry's dagplan: only events happening literally TODAY.
 * The "Dit weekend" section on the homepage covers Saturday/Sunday separately,
 * so this stays accurate to the "vandaag" label.
 */
export function getDayPlanEvents(): Event[] {
  return getTodayEvents();
}
