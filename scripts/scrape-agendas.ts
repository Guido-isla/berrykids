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

  // Run all scrapers with error isolation
  for (const { name, fn } of [
    { name: "Patronaat", fn: scrapePatronaat },
    { name: "Schuur", fn: scrapeSchuur },
    { name: "Philharmonie", fn: scrapePhilharmonie },
    { name: "Kidsproof", fn: scrapeKidsproof },
    { name: "Haarlem Marketing", fn: scrapeHaarlemMarketing },
  ]) {
    console.log();
    try {
      const events = await fn();
      allEvents.push(...events);
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
