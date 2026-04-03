/**
 * Scraper for Philharmonie Haarlem
 * URL: https://philhaarlem.nl/agenda
 *
 * HTML structure (Tailwind + Phoenix LiveView):
 * - Month groups: div.js-section-group[id="YYYY-MM"]
 *   - Month header: h3.js-date-header
 * - Event cards: article elements within grid
 *   - Image: picture > img[src]
 *   - Genre tags: a[href*="genre[]="] — filter for "jeugd-familie"
 *   - Date/time: p.font-semibold ("ma 6 apr — 09:30, 11:30")
 *   - Title: h3.font-bold ("OKAPI (4-24 maanden)")
 *   - Subtitle: next p after title
 *   - Event link: a[href*="/agenda/"] or a[href*="/festival/"]
 *   - Buttons: "Bestel" / "Meer info" links
 */

import * as cheerio from "cheerio";
import { type ScrapedEvent, parseDutchDate } from "./types";

const BASE_URL = "https://philhaarlem.nl";
const AGENDA_URL = `${BASE_URL}/agenda`;

export async function scrapePhilharmonie(): Promise<ScrapedEvent[]> {
  console.log("🎶 Scraping Philharmonie Haarlem...");

  const res = await fetch(AGENDA_URL, {
    headers: {
      "User-Agent": "BerryKids/1.0 (family events aggregator)",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    console.error(`  Philharmonie: HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];

  $("article").each((_, el) => {
    const $article = $(el);
    const fullText = $article.text();

    // Check if this is a family/kids event by looking for the genre tag
    const genreTags = $article.find("a[href*='genre']");
    let isKids = false;
    const tags: string[] = [];

    genreTags.each((_, tagEl) => {
      const tagText = $(tagEl).text().trim().toLowerCase();
      const tagHref = $(tagEl).attr("href") || "";
      tags.push(tagText);
      if (
        tagHref.includes("jeugd") ||
        tagHref.includes("familie") ||
        tagText.includes("jeugd") ||
        tagText.includes("familie") ||
        tagText.includes("family") ||
        tagText.includes("kids")
      ) {
        isKids = true;
      }
    });

    // Also check for festival tags that indicate kids content
    const festivalLinks = $article.find("a[href*='festival']");
    festivalLinks.each((_, fEl) => {
      const fText = $(fEl).text().trim().toLowerCase();
      if (fText.includes("turvenhoog")) {
        isKids = true;
        tags.push("2turvenhoog");
      }
    });

    // Also check title for age indicators
    const titleEl = $article.find("h3.font-bold").first();
    const title = titleEl.text().trim();

    if (title.match(/\(\d+[\s-].*(?:jaar|maanden|jr|mnd)\)/i) ||
        title.match(/\(\d+\+\)/)) {
      isKids = true;
    }

    // Also check for "Koningsconcert", "Jeugdorkest" etc. in title
    const kidsKeywords = ["kinder", "jeugd", "familie", "family", "kids", "junior", "baby", "peuter", "kleuter"];
    if (kidsKeywords.some((kw) => fullText.toLowerCase().includes(kw))) {
      isKids = true;
    }

    if (!isKids || !title) return;

    // Extract age from title: "OKAPI (4-24 maanden)" → "4-24 maanden"
    let ageLabel: string | undefined;
    const ageMatch = title.match(/\(([^)]+)\)/);
    if (ageMatch) {
      ageLabel = ageMatch[1];
    }

    // Clean title (remove age from title for display)
    const cleanTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();

    // Date and time — p.font-semibold
    const dateParagraph = $article.find("p.font-semibold").first().text().trim();
    // Formats: "vr 3 apr — 19:30" or "ma 6 apr — 09:30, 11:30, 15:15" or "ma 6, di 7 apr"
    const date = parseDutchDate(dateParagraph);
    if (!date) return;

    // Extract time(s) from the date paragraph
    let time = "";
    const timeMatch = dateParagraph.match(/—\s*(.+)$/);
    if (timeMatch) {
      time = timeMatch[1].trim();
    }

    // Image — from picture > img
    const img = $article.find("picture img").first();
    const imageUrl = img.attr("src") || "";

    // Event link — prefer /agenda/ links
    let eventUrl = "";
    $article.find("a[href]").each((_, aEl) => {
      const href = $(aEl).attr("href") || "";
      if ((href.includes("/agenda/") || href.includes("/festival/")) && !href.includes("genre") && !eventUrl) {
        eventUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
      }
    });

    // Subtitle/description — p element after title (not font-semibold)
    const allPs = $article.find("p");
    let description = "";
    allPs.each((_, pEl) => {
      const $p = $(pEl);
      if (!$p.hasClass("font-semibold") && $p.text().trim().length > 5) {
        const text = $p.text().trim();
        // Skip if it's just a performer name that's very short
        if (text.length > 10 || (!description && text.length > 3)) {
          if (!description) description = text;
        }
      }
    });

    // Check for sold out / ticket status
    const buttons = $article.find("a").filter((_, aEl) => {
      const text = $(aEl).text().trim().toLowerCase();
      return text.includes("bestel") || text.includes("kaarten") || text.includes("meer info");
    });
    const isSoldOut = fullText.toLowerCase().includes("uitverkocht");

    if (isSoldOut) return;

    events.push({
      source: "philharmonie",
      title: cleanTitle,
      date,
      time,
      venue: "Philharmonie Haarlem",
      ageLabel,
      description,
      imageUrl,
      ticketUrl: eventUrl,
      category: "concert",
      tags: ["familie", ...tags],
    });
  });

  console.log(`  Found ${events.length} family/kids events`);

  // Validate
  const valid = events.filter((e) => {
    if (!e.title || e.title.length < 2) {
      console.log(`  ⚠️  Skipped empty title`);
      return false;
    }
    if (!e.date) {
      console.log(`  ⚠️  Skipped "${e.title}" — no date`);
      return false;
    }
    return true;
  });

  console.log(`  Valid: ${valid.length} events`);
  return valid;
}
