/**
 * Scraper for Patronaat Haarlem
 * URL: https://patronaat.nl/programma/
 *
 * HTML structure (WordPress):
 * - Event wrapper: div.event-program
 *   - Image: div.event-program__image > figure.media > a > img[src]
 *   - Status: div.event-program__status-tag > p ("UITVERKOCHT", "LAATSTE KAARTEN")
 *   - Date: div.event-program__date > a ("vr 3 apr 2026")
 *   - Title: h3.event-program__name > a
 *   - Subtitle: div.event-program__subtitle
 *   - Genre tags: div.event-program__tags > a.event__tags-item--genre
 *   - Event URL: from the a[href] in title or date
 *
 * Note: Patronaat rarely has kids events — mostly music/concerts.
 * We scrape everything and filter for family content.
 */

import * as cheerio from "cheerio";
import { type ScrapedEvent, parseDutchDate } from "./types";

const BASE_URL = "https://patronaat.nl";
const PROGRAMMA_URL = `${BASE_URL}/programma/`;

const KIDS_KEYWORDS = [
  "kinder", "kids", "jeugd", "familie", "family",
  "peuter", "kleuter", "junior", "young creatives",
  "kindervoorstelling", "familieshow", "kinderfeest",
];

function isKidsEvent(title: string, subtitle: string, tags: string[]): boolean {
  const text = `${title} ${subtitle} ${tags.join(" ")}`.toLowerCase();
  return KIDS_KEYWORDS.some((kw) => text.includes(kw));
}

export async function scrapePatronaat(): Promise<ScrapedEvent[]> {
  console.log("🎵 Scraping Patronaat...");

  const res = await fetch(PROGRAMMA_URL, {
    headers: { "User-Agent": "BerryKids/1.0 (family events aggregator)" },
  });

  if (!res.ok) {
    console.error(`  Patronaat: HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const allEvents: ScrapedEvent[] = [];
  let skippedSoldOut = 0;

  $("div.event-program").each((_, el) => {
    const $el = $(el);

    // Check sold out status
    const statusTag = $el.find("div.event-program__status-tag");
    if (statusTag.length) {
      const statusText = statusTag.text().trim().toLowerCase();
      if (statusText.includes("uitverkocht")) {
        skippedSoldOut++;
        return;
      }
    }

    // Title
    const titleEl = $el.find("h3.event-program__name a").first();
    const title = titleEl.text().trim();
    if (!title) return;

    // Event URL
    const href = titleEl.attr("href") || "";

    // Date
    const dateText = $el.find("div.event-program__date a").first().text().trim();
    const date = parseDutchDate(dateText);
    if (!date) return;

    // Image
    const imageUrl = $el.find("div.event-program__image img").first().attr("src") || "";

    // Subtitle
    const subtitle = $el.find("div.event-program__subtitle").text().trim();

    // Genre tags
    const tags: string[] = [];
    $el.find("a.event__tags-item--genre").each((_, tagEl) => {
      tags.push($(tagEl).text().trim().toLowerCase());
    });

    allEvents.push({
      source: "patronaat",
      title,
      date,
      time: "",
      venue: "Patronaat, Haarlem",
      description: subtitle,
      imageUrl: imageUrl.startsWith("http") ? imageUrl : imageUrl ? `${BASE_URL}${imageUrl}` : "",
      ticketUrl: href,
      category: tags[0] || "concert",
      tags,
    });
  });

  // Filter for kids/family events
  const kidsEvents = allEvents.filter((e) =>
    isKidsEvent(e.title, e.description || "", e.tags || [])
  );

  console.log(`  Total: ${allEvents.length} events (${skippedSoldOut} sold out skipped)`);
  console.log(`  Family/kids: ${kidsEvents.length} events`);

  return kidsEvents;
}
