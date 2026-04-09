/**
 * Scraper for Visit Haarlemmermeer
 * URL: https://visithaarlemmermeer.nl/ga-eropuit-dit-voorjaar
 *
 * Strategy: scrape listing page for agenda links, then fetch each detail page
 * for dates, descriptions, and images via og:meta tags.
 */

import * as cheerio from "cheerio";
import type { ScrapedEvent } from "./types";
import { parseDutchDate } from "./types";

const LISTING_URL = "https://visithaarlemmermeer.nl/ga-eropuit-dit-voorjaar";
const BASE_URL = "https://visithaarlemmermeer.nl";

const FAMILY_KEYWORDS = [
  "kinder", "kids", "jeugd", "familie", "family", "gezin",
  "klimmen", "klimpark", "paintball", "speeltuin", "boerderij",
  "natuur", "dieren", "waterbees", "excursie",
  "festival", "kano", "varen", "boerenvoetgolf", "fort",
  "jumpskillz", "boulderen", "escape", "lego", "stoomgemaal",
  "rondvaart", "rondleiding", "combiticket",
];

const EXCLUDE_KEYWORDS = [
  "vrouwen", "wellness", "make-up", "wijn", "bier", "cocktail",
  "yoga voor volwassenen", "netwerk", "business",
];

export async function scrapeVisitHaarlemmermeer(): Promise<ScrapedEvent[]> {
  console.log("🌷 Scraping Visit Haarlemmermeer...");

  const res = await fetch(LISTING_URL, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    console.error(`  ❌ HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Collect all agenda links from the listing page
  const agendaLinks = new Set<string>();
  $("a[href*='/agenda/']").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.includes("#")) {
      agendaLinks.add(href.startsWith("http") ? href : `${BASE_URL}${href}`);
    }
  });

  console.log(`  Found ${agendaLinks.size} agenda links`);

  const events: ScrapedEvent[] = [];

  // Fetch each detail page
  for (const url of agendaLinks) {
    await new Promise((r) => setTimeout(r, 500)); // rate limit

    try {
      const pageRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!pageRes.ok) continue;

      const pageHtml = await pageRes.text();
      const page$ = cheerio.load(pageHtml);

      // Title from h1
      const title = page$("h1").first().text().trim();
      if (!title || title.length < 3) continue;

      // Check if family-relevant
      const fullText = `${title} ${page$("meta[name='description']").attr("content") || ""}`.toLowerCase();
      const isFamilyRelevant = FAMILY_KEYWORDS.some((kw) => fullText.includes(kw));
      const isExcluded = EXCLUDE_KEYWORDS.some((kw) => fullText.includes(kw));
      if (!isFamilyRelevant || isExcluded) continue;

      // Date from page text
      const dateText = page$("body").text();
      const dateMatch = dateText.match(/(\d{1,2})\s+(jan|feb|mrt|mar|apr|mei|may|jun|jul|aug|sep|okt|oct|nov|dec)\w*\s*(\d{4})?/i);
      const date = dateMatch ? parseDutchDate(dateMatch[0]) : null;
      if (!date) continue;

      // Description from og:description or meta description
      const description = page$("meta[property='og:description']").attr("content")
        || page$("meta[name='description']").attr("content")
        || "";

      // Image from og:image
      let image = page$("meta[property='og:image']").attr("content") || "";
      if (image && !image.startsWith("http")) {
        image = `${BASE_URL}${image}`;
      }

      // Time — try to find a time pattern
      const timeMatch = dateText.match(/(\d{1,2}[:.]\d{2})\s*(?:uur|u|-|–)?/);
      const time = timeMatch ? timeMatch[1].replace(".", ":") : "";

      events.push({
        source: "visithaarlemmermeer",
        title,
        date,
        time,
        venue: "Haarlemmermeer",
        description: description.slice(0, 300),
        imageUrl: image,
        ticketUrl: url,
        category: "event",
        tags: ["familie", "haarlemmermeer"],
      });
    } catch {
      // Skip failed pages
    }
  }

  console.log(`  Family/kids: ${events.length} events`);
  return events;
}
