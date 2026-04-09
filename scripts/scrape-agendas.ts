/**
 * Main scraper: fetches family/kids events from Patronaat, Schuur, and Philharmonie.
 * Saves validated results to src/data/scraped-events.json
 *
 * Usage:
 *   npx tsx scripts/scrape-agendas.ts
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { scrapePatronaat } from "./scrapers/patronaat";
import { scrapeSchuur } from "./scrapers/schuur";
import { scrapePhilharmonie } from "./scrapers/philharmonie";
import { scrapeKidsproof } from "./scrapers/kidsproof";
import { scrapeHaarlemMarketing } from "./scrapers/haarlemmarketing";
import { scrapeVisitHaarlemmermeer } from "./scrapers/visithaarlemmermeer";
import { scrapeHaventheater } from "./scrapers/haventheater";
import { scrapeTheaterElswout } from "./scrapers/theaterelswout";
import { enrichDescriptions } from "./scrapers/enrich";
import type { ScrapedEvent } from "./scrapers/types";

const OUTPUT_PATH = join(__dirname, "../src/data/scraped-events.json");

/** Validate a single scraped event — reject anything that looks wrong */
function validate(event: ScrapedEvent): string | null {
  if (!event.title || event.title.length < 3) {
    return `Title too short: "${event.title}"`;
  }
  if (!event.date || !event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return `Invalid date: "${event.date}"`;
  }
  // Date must be in the future (not older than yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (new Date(event.date + "T00:00:00") < yesterday) {
    return `Past event: ${event.date}`;
  }
  // Date must be within 6 months
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  if (new Date(event.date + "T00:00:00") > sixMonths) {
    return `Too far in future: ${event.date}`;
  }
  if (!event.venue) {
    return "Missing venue";
  }
  // Title should not be a category name
  const categoryNames = ["film", "theater", "concert", "dans", "muziek", "documentaire"];
  if (categoryNames.includes(event.title.toLowerCase())) {
    return `Title is a category name: "${event.title}"`;
  }
  return null; // valid
}

async function main() {
  console.log("🍓 Berry Kids — Scraping venue agendas\n");
  console.log("=".repeat(50));

  const allEvents: ScrapedEvent[] = [];
  const errors: string[] = [];

  // Manual events — major events not on any scraped site
  const manualEvents: ScrapedEvent[] = [
    {
      source: "manual",
      title: "Kermis Haarlem",
      date: "2026-04-23",
      time: "13:00",
      venue: "Zaanenlaan / Grote Markt, Haarlem",
      description: "De Haarlemse Kermis op de Zaanenlaan en Grote Markt. Attracties, botsauto's, suikerspinnen en meer. 23 april t/m 3 mei.",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
      ticketUrl: "https://kermis-haarlem.nl/",
      category: "event",
      tags: ["kermis", "familie", "gratis"],
    },
    {
      source: "manual",
      title: "Kermis Haarlem",
      date: "2026-04-29",
      time: "13:00",
      venue: "Grote Markt, Haarlem",
      description: "Kermis op de Grote Markt! Attracties, botsauto's en meer midden in het centrum.",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
      ticketUrl: "https://kermis-haarlem.nl/",
      category: "event",
      tags: ["kermis", "familie", "gratis"],
    },
    {
      source: "manual",
      title: "Bloemencorso Bollenstreek",
      date: "2026-04-19",
      time: "09:30",
      venue: "Noordwijk → Haarlem",
      description: "Het grootste lentefeest! Praalwagens vol bloemen rijden van Noordwijk naar Haarlem. Gratis te bekijken langs de route.",
      imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
      ticketUrl: "https://bloemencorso-bollenstreek.nl/programma/",
      category: "event",
      tags: ["bloemencorso", "familie", "gratis", "bloemen"],
    },
  ];
  allEvents.push(...manualEvents);
  console.log(`\n📋 Manual events: ${manualEvents.length}`);

  // Run all scrapers with error isolation
  for (const { name, fn } of [
    { name: "Patronaat", fn: scrapePatronaat },
    { name: "Schuur", fn: scrapeSchuur },
    { name: "Philharmonie", fn: scrapePhilharmonie },
    // Kidsproof removed — JS-rendered page, can't scrape without headless browser
    { name: "Haarlem Marketing", fn: scrapeHaarlemMarketing },
    { name: "Visit Haarlemmermeer", fn: scrapeVisitHaarlemmermeer },
    { name: "Haventheater IJmuiden", fn: scrapeHaventheater },
    { name: "Theater Elswout", fn: scrapeTheaterElswout },
  ]) {
    console.log();
    try {
      const events = await fn();
      allEvents.push(...events);
      // Rate limit: 500ms between scrapers
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      const msg = `${name} scraper failed: ${err}`;
      console.error(`  ❌ ${msg}`);
      errors.push(msg);
    }
  }

  console.log();
  console.log("=".repeat(50));
  console.log("\n📋 Validation...");

  // Validate all events
  const valid: ScrapedEvent[] = [];
  let rejected = 0;

  for (const event of allEvents) {
    const error = validate(event);
    if (error) {
      console.log(`  ❌ [${event.source}] "${event.title}" — ${error}`);
      rejected++;
    } else {
      valid.push(event);
    }
  }

  // Sort by date
  valid.sort((a, b) => a.date.localeCompare(b.date));

  // Deduplicate by normalized title + date
  const seen = new Set<string>();
  const deduped = valid.filter((e) => {
    const key = `${e.title.toLowerCase().replace(/\s+/g, " ").trim()}-${e.date}`;
    if (seen.has(key)) {
      console.log(`  🔄 Duplicate: "${e.title}" on ${e.date}`);
      return false;
    }
    seen.add(key);
    return true;
  });

  // Enrich events missing descriptions
  console.log("\n📝 Enriching descriptions...");
  await enrichDescriptions(deduped);

  // Save
  const output = {
    scrapedAt: new Date().toISOString(),
    eventCount: deduped.length,
    rejectedCount: rejected,
    errors,
    events: deduped,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`\n✅ Result: ${deduped.length} valid events saved`);
  console.log(`   Rejected: ${rejected}`);
  if (errors.length) console.log(`   Scraper errors: ${errors.length}`);

  const bySrc = deduped.reduce(
    (acc, e) => { acc[e.source] = (acc[e.source] || 0) + 1; return acc; },
    {} as Record<string, number>
  );
  console.log("\nPer bron:");
  for (const [src, count] of Object.entries(bySrc)) {
    console.log(`  ${src}: ${count} events`);
  }

  if (deduped.length > 0) {
    console.log("\nAlle events:");
    for (const e of deduped) {
      const label = [e.date, e.time, e.title, e.venue, e.ageLabel].filter(Boolean).join(" | ");
      console.log(`  ${label}`);
    }
  }
}

main();
