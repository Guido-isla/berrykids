/**
 * Scraper for Haventheater IJmuiden — family shows
 * URL: https://haventheaterijmuiden.nl/programma/genre/familie
 */

import * as cheerio from "cheerio";
import type { ScrapedEvent } from "./types";
import { parseDutchDate } from "./types";

const LISTING_URL = "https://haventheaterijmuiden.nl/programma/genre/familie";
const BASE_URL = "https://haventheaterijmuiden.nl";

export async function scrapeHaventheater(): Promise<ScrapedEvent[]> {
  console.log("🎭 Scraping Haventheater IJmuiden (Familie)...");

  const res = await fetch(LISTING_URL, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    console.error(`  ❌ HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Find show detail links from the listing page
  const showLinks = new Set<string>();
  $("a[href*='/programma/']").each((_, el) => {
    const href = $(el).attr("href");
    if (href && href.match(/\/programma\/[a-z0-9-]+$/) && !href.includes("genre") && !href.includes("?")) {
      showLinks.add(href.startsWith("http") ? href : `${BASE_URL}${href}`);
    }
  });

  console.log(`  Found ${showLinks.size} show links`);

  const events: ScrapedEvent[] = [];

  for (const url of showLinks) {
    await new Promise((r) => setTimeout(r, 500));

    try {
      const pageRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!pageRes.ok) continue;

      const pageHtml = await pageRes.text();
      const page$ = cheerio.load(pageHtml);

      // Get title from meta description (h1 is empty on this site)
      const metaDesc = page$("meta[name='description']").attr("content") || "";
      const titleMatch = metaDesc.match(/^(.+?)\s+is op/);
      const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&") : page$("h1").text().trim();
      if (!title || title.length < 3) continue;

      // Get date
      const dateMatch = metaDesc.match(/(\d{1,2}\s+\w+\s+\d{4})/);
      const date = dateMatch ? parseDutchDate(dateMatch[1]) : null;
      if (!date) continue;

      // Get image
      const image = page$("meta[property='og:image']").attr("content") || "";

      // Get time
      const bodyText = page$("body").text();
      const timeMatch = bodyText.match(/(\d{2}:\d{2})/);
      const time = timeMatch ? timeMatch[1] : "";

      // Get age from title
      const ageMatch = title.match(/\((\d+\+?)\)/);
      const ageLabel = ageMatch ? `${ageMatch[1]} jaar` : "Alle leeftijden";

      events.push({
        source: "haventheater" as ScrapedEvent["source"],
        title: title.replace(/\s*\(\d+\+?\)/, "").trim(),
        date,
        time,
        venue: "Haventheater IJmuiden",
        ageLabel,
        description: metaDesc.slice(0, 200),
        imageUrl: image,
        ticketUrl: url,
        category: "theater",
        tags: ["familie", "theater"],
      });
    } catch {
      // Skip failed pages
    }
  }

  console.log(`  Family shows: ${events.length}`);
  return events;
}
