/**
 * Scraper for De Schuur (Filmschuur + Theater)
 * URL: https://www.schuur.nl/agenda?genre=jeugd
 *
 * HTML structure (Tailwind CSS):
 * - Date headers: h3.faux-h5 > span ("Vr 3 apr")
 * - Event containers: div.lazyload.duration-500
 *   - Time: div.hidden.lg:flex span (desktop) or div.flex.lg:hidden span:first (mobile)
 *   - Title: h4 > a > span:first-child
 *   - Age: h4 > a > span.faux-h5 ("3+")
 *   - Category: mobile div span:nth-child(2) ("Jeugdtheater", "Familiefilm")
 *   - Image: picture img[data-src]
 *   - Link: h4 > a[href] or first a with /film/ or /theater/
 *   - Director/company: div.lg:order-first > span:first-child
 *   - Description: div.hidden.lg:block.mt-1 > span
 *   - Venue: last div.hidden.lg:block with SCHUUR/PHIL text
 */

import * as cheerio from "cheerio";
import { type ScrapedEvent, parseDutchDate } from "./types";

const BASE_URL = "https://www.schuur.nl";
const AGENDA_URL = `${BASE_URL}/agenda?genre=jeugd`;

export async function scrapeSchuur(): Promise<ScrapedEvent[]> {
  console.log("🎬 Scraping De Schuur (Film + Theater)...");

  const res = await fetch(AGENDA_URL, {
    headers: { "User-Agent": "BerryKids/1.0 (family events aggregator)" },
  });

  if (!res.ok) {
    console.error(`  Schuur: HTTP ${res.status}`);
    return [];
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];
  const mobileCategoryLookup = new Map<string, string>();

  // Build a map: for each event div, find its preceding date header
  let currentDate = "";

  // Walk through all direct children of the main content area
  // Date headers (h3 with faux-h5) and event divs (div.lazyload) are siblings
  $("h3, div.lazyload").each((_, el) => {
    const $el = $(el);

    // Date header
    if (el.tagName === "h3") {
      const dateText = $el.find("span").first().text().trim() || $el.text().trim();
      const parsed = parseDutchDate(dateText);
      if (parsed) currentDate = parsed;
      return;
    }

    // Event div
    if (!currentDate) return;

    // Title — h4 > a > span:first-child
    const titleLink = $el.find("h4 a").first();
    const titleSpans = titleLink.find("span");
    const title = titleSpans.first().text().trim();

    if (!title || title.length < 2) return;

    // Age rating — second span inside h4 > a, usually has class faux-h5
    let ageLabel: string | undefined;
    if (titleSpans.length > 1) {
      const ageText = titleSpans.eq(1).text().trim();
      if (ageText.match(/^\d/)) {
        ageLabel = `${ageText} jaar`;
      }
    }

    // Event URL
    const href = titleLink.attr("href") || "";
    const eventUrl = href.startsWith("http") ? href : href ? `${BASE_URL}${href}` : "";

    // Determine category from URL path or mobile category text
    let category = "theater";
    if (href.includes("/film/")) category = "film";

    // Mobile category text (more specific: "Jeugdtheater", "Familiefilm", "Documentaire")
    const mobileCategoryText = $el.find("div.flex.lg\\:hidden span").last().text().trim();
    if (mobileCategoryText) {
      const lower = mobileCategoryText.toLowerCase();
      if (lower.includes("film") || lower.includes("documentaire")) category = "film";
      else if (lower.includes("theater") || lower.includes("dans") || lower.includes("muziektheater")) category = "theater";
    }

    // Time — from desktop div or mobile div
    const desktopTime = $el.find("div.hidden.lg\\:flex span").first().text().trim();
    const mobileTime = $el.find("div.flex.lg\\:hidden span").first().text().trim();
    const time = desktopTime || mobileTime || "";

    // Image — lazy loaded via data-src
    const img = $el.find("picture img[data-src]").first();
    const imageUrl = img.attr("data-src") || img.attr("src") || "";
    // Skip SVG placeholders
    const finalImageUrl = imageUrl.startsWith("data:") ? "" : imageUrl;

    // Director/company
    const company = $el.find("div.lg\\:order-first span").first().text().trim();

    // Description
    const descEl = $el.find("div.hidden.lg\\:block.mt-1 span").first();
    const description = descEl.text().trim();

    // Venue indicator
    const venueText = $el.find("div.hidden.lg\\:block span.caps").text().trim();
    const venue = venueText === "PHIL" ? "Philharmonie Haarlem" : "De Schuur, Haarlem";

    // Store category for later filtering
    mobileCategoryLookup.set(title + currentDate, mobileCategoryText);

    events.push({
      source: "schuur",
      title,
      date: currentDate,
      time,
      venue,
      ageLabel,
      description: description || (company ? `Door: ${company}` : ""),
      imageUrl: finalImageUrl,
      ticketUrl: eventUrl,
      category,
      tags: ["jeugd", "familie"],
    });
  });

  console.log(`  Found ${events.length} jeugd/familie events`);

  // Validate and filter: only keep actual kids/family content
  const KIDS_CATEGORIES = [
    "jeugdtheater", "familiefilm", "jeugdfilm", "kinderfilm",
    "familievoorstelling", "kindertheater", "jeugd",
  ];

  const valid = events.filter((e) => {
    if (e.title.length < 3) {
      console.log(`  ⚠️  Skipped short title: "${e.title}"`);
      return false;
    }

    // Must have an age label (2+, 3+, etc.) OR a kids category
    const catLower = (mobileCategoryLookup.get(e.title + e.date) || "").toLowerCase();
    const hasAgeLabel = !!e.ageLabel;
    const hasKidsCategory = KIDS_CATEGORIES.some((kc) => catLower.includes(kc));
    const titleHasAge = !!e.title.match(/\d+\+/);
    const isKidsKeyword = ["mike", "molly", "taartrovers", "cinemini", "kunstspeeltuin", "paasontbijt"]
      .some((kw) => e.title.toLowerCase().includes(kw));

    if (!hasAgeLabel && !hasKidsCategory && !titleHasAge && !isKidsKeyword) {
      // This is probably an adult film/show that happens to be on the jeugd page
      return false;
    }

    return true;
  });

  console.log(`  Kids-only: ${valid.length} events (filtered from ${events.length})`);
  return valid;
}
