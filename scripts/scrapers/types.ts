/** Shared types for all scrapers */

export type ScrapedEvent = {
  source: "patronaat" | "schuur" | "philharmonie" | "kidsproof" | "haarlemmarketing";
  title: string;
  date: string; // ISO
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

export function toIsoDate(day: number, month: number, year: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const DUTCH_MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mrt: 3, mar: 3, apr: 4, mei: 5, may: 5,
  jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, oct: 10,
  nov: 11, dec: 12,
};

export function parseDutchDate(text: string): string | null {
  // Matches: "5 apr", "12 mei 2026", "za 5 apr"
  const match = text.match(/(\d{1,2})\s+(jan|feb|mrt|mar|apr|mei|may|jun|jul|aug|sep|okt|oct|nov|dec)\s*(\d{4})?/i);
  if (!match) return null;
  const day = parseInt(match[1]);
  const month = DUTCH_MONTHS[match[2].toLowerCase()];
  const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
  if (!month) return null;
  return toIsoDate(day, month, year);
}
