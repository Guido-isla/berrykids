/**
 * Scraper for Visit Haarlem / Haarlem Marketing uitagenda
 * URL: https://www.visithaarlem.com/en/events-calender/
 * Also tries: https://haarlem.nl/nme/activiteiten (NME nature activities)
 */

import * as cheerio from "cheerio";
import { type ScrapedEvent, parseDutchDate } from "./types";

const URLS = [
  "https://www.visithaarlem.com/en/events-calender/",
  "https://www.visithaarlem.com/nl/uitagenda/",
  "https://haarlem.nl/nme/activiteiten",
];

const KIDS_KEYWORDS = [
  "kinder", "kids", "jeugd", "familie", "family",
  "peuter", "kleuter", "junior", "gezin",
];

function isKidsRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return KIDS_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function scrapeHaarlemMarketing(): Promise<ScrapedEvent[]> {
  console.log("🏙️  Scraping Visit Haarlem / Gemeente...");

  const allEvents: ScrapedEvent[] = [];

  for (const url of URLS) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BerryKids/1.0 (family events aggregator)" },
        redirect: "follow",
      });

      if (!res.ok) {
        console.log(`  ${url}: HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Generic approach: find anything that looks like an event card
      $("article, [class*=event], [class*=card], [class*=agenda-item], li").each((_, el) => {
        const $el = $(el);
        const text = $el.text();

        // Must have a date somewhere
        const dateMatch = text.match(/\d{1,2}\s+(jan|feb|mrt|apr|mei|jun|jul|aug|sep|okt|nov|dec)\s*\d{0,4}/i);
        if (!dateMatch) return;

        const date = parseDutchDate(dateMatch[0]);
        if (!date) return;

        // Title
        const title = $el.find("h2, h3, h4, [class*=title]").first().text().trim();
        if (!title || title.length < 5) return;

        // Link
        const link = $el.find("a").first().attr("href") || "";

        // Image
        const img = $el.find("img").first();
        const imageUrl = img.attr("src") || img.attr("data-src") || "";

        // Time
        const timeMatch = text.match(/(\d{1,2}[:.]\d{2})\s*(?:uur|u|-|–)?/);

        allEvents.push({
          source: "haarlemmarketing" as ScrapedEvent["source"],
          title,
          date,
          time: timeMatch?.[1]?.replace(".", ":") || "",
          venue: "Haarlem",
          description: $el.find("p").first().text().trim().slice(0, 200),
          imageUrl: imageUrl.startsWith("data:") ? "" : imageUrl,
          ticketUrl: link.startsWith("http") ? link : link ? `https://haarlem.nl${link}` : "",
          category: "event",
          tags: [],
        });
      });

      console.log(`  ${url}: ${allEvents.length} events found`);
    } catch (err) {
      console.log(`  ${url}: failed — ${err}`);
    }
  }

  // Filter: only keep events that are explicitly family/kids relevant
  // OR events that are generally family-friendly (markets, festivals, nature)
  const FAMILY_FRIENDLY_KEYWORDS = [
    "kinder", "kids", "jeugd", "familie", "family", "gezin",
    "peuter", "kleuter", "markt", "festival", "natuur", "dieren",
    "springer", "pasen", "paas", "koningsdag", "sinterklaas",
    "kweek", "speeltuin", "boerderij", "workshop",
  ];

  const filtered = allEvents.filter((e) => {
    const text = `${e.title} ${e.description}`.toLowerCase();
    return FAMILY_FRIENDLY_KEYWORDS.some((kw) => text.includes(kw));
  });

  console.log(`  Total: ${allEvents.length}, family-relevant: ${filtered.length}`);
  return filtered;
}
