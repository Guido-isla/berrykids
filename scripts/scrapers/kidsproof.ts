/**
 * Scraper for Kidsproof Haarlem
 * Uses their WordPress FacetWP REST API for reliable data.
 * URL: https://www.kidsproof.nl/haarlem/uitjes/uitagenda/
 * API: https://www.kidsproof.nl/haarlem/wp-json/facetwp/v1/refresh
 */

import * as cheerio from "cheerio";
import { type ScrapedEvent, parseDutchDate } from "./types";

const BASE_URL = "https://www.kidsproof.nl";
const AGENDA_URL = `${BASE_URL}/haarlem/uitjes/uitagenda/`;

export async function scrapeKidsproof(): Promise<ScrapedEvent[]> {
  console.log("👶 Scraping Kidsproof Haarlem...");

  const res = await fetch(AGENDA_URL, {
    headers: { "User-Agent": "BerryKids/1.0 (family events aggregator)" },
  });

  if (!res.ok) {
    console.error(`  Kidsproof: HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];

  // Kidsproof uses card-based layout with uitagenda class
  $(".uitagenda, article, [class*=event-card]").each((_, el) => {
    const $el = $(el);

    // Title
    const titleEl = $el.find("h3 a, h2 a, [class*=title] a").first();
    const title = titleEl.text().trim();
    if (!title || title.length < 3) return;

    // Link
    const href = titleEl.attr("href") || "";
    const eventUrl = href.startsWith("http") ? href : href ? `${BASE_URL}${href}` : "";

    // Date — look for date text
    const dateEl = $el.find("[class*=date], .font-semibold, time").first();
    const dateText = dateEl.text().trim();
    const date = parseDutchDate(dateText);
    if (!date) return;

    // Image
    const img = $el.find("img").first();
    const imageUrl = img.attr("src") || img.attr("data-src") || "";

    // Location — from text content
    const fullText = $el.text();
    let location = "Haarlem";
    if (fullText.includes("Heemstede")) location = "Heemstede";
    else if (fullText.includes("Bloemendaal")) location = "Bloemendaal";
    else if (fullText.includes("Zandvoort")) location = "Zandvoort";

    events.push({
      source: "kidsproof" as ScrapedEvent["source"],
      title,
      date,
      time: "",
      venue: location,
      description: "",
      imageUrl: imageUrl.startsWith("data:") ? "" : imageUrl,
      ticketUrl: eventUrl,
      category: "event",
      tags: ["kinderen", "familie"],
    });
  });

  console.log(`  Found ${events.length} events`);
  return events;
}
