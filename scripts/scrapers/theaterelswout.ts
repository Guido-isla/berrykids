/**
 * Scraper for Theater Elswout — outdoor family theater in Overveen
 * URL: https://theaterelswout.nl/
 */

import * as cheerio from "cheerio";
import type { ScrapedEvent } from "./types";
import { parseDutchDate } from "./types";

const URL = "https://theaterelswout.nl/";

export async function scrapeTheaterElswout(): Promise<ScrapedEvent[]> {
  console.log("🌳 Scraping Theater Elswout...");

  const res = await fetch(URL, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    console.error(`  ❌ HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const events: ScrapedEvent[] = [];

  // Theater Elswout is a single-page site with show info
  // Look for show titles + dates
  $("h2, h3").each((_, el) => {
    const title = $(el).text().trim();
    if (title.length < 3 || title.length > 80) return;
    if (["theater elswout", "waar de verhalen", "party time", "nieuwsbrief"].some(
      (skip) => title.toLowerCase().includes(skip)
    )) return;

    // Find date near this element
    const parent = $(el).parent();
    const text = parent.text();
    const dateMatch = text.match(/(\d{1,2}\s+(?:jan|feb|mrt|mar|apr|mei|may|jun|jul|aug|sep|okt|oct|nov|dec)\w*\s*\d{0,4})/i);
    if (!dateMatch) return;

    const date = parseDutchDate(dateMatch[1]);
    if (!date) return;

    // Get time
    const timeMatch = text.match(/(\d{1,2}[:.]\d{2})\s*(?:uur|u)?/);
    const time = timeMatch ? timeMatch[1].replace(".", ":") : "";

    // Get image
    const img = parent.find("img").first().attr("src") || parent.prev("img").attr("src") || "";

    events.push({
      source: "theaterelswout" as ScrapedEvent["source"],
      title,
      date,
      time,
      venue: "Theater Elswout, Overveen",
      ageLabel: "Alle leeftijden",
      description: "Buitentheater op landgoed Elswout in Overveen. Magische voorstellingen onder de bomen.",
      imageUrl: img.startsWith("http") ? img : img ? `https://theaterelswout.nl${img}` : "",
      ticketUrl: URL,
      category: "theater",
      tags: ["familie", "buitentheater", "overveen"],
    });
  });

  console.log(`  Shows: ${events.length}`);
  return events;
}
