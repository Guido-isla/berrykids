/**
 * Enriches scraped events by fetching their detail pages for descriptions.
 * Works for all sources that provide a ticketUrl/detail URL.
 *
 * Strategy per source:
 * - Visit Haarlem: JSON-LD schema.org description
 * - Schuur: paragraph text on detail page
 * - Philharmonie: paragraph text on detail page
 * - Generic fallback: meta description tag
 */

import * as cheerio from "cheerio";
import type { ScrapedEvent } from "./types";

const USER_AGENT = "BerryKids/1.0 (family events aggregator)";

async function fetchDescription(url: string): Promise<string> {
  if (!url || !url.startsWith("http")) return "";

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return "";

    const html = await res.text();
    const $ = cheerio.load(html);

    // Strategy 1: JSON-LD structured data — prefer Event type over WebPage
    const jsonLdScripts = $('script[type="application/ld+json"]');
    let bestJsonLdDesc = "";
    for (let i = 0; i < jsonLdScripts.length; i++) {
      try {
        const data = JSON.parse($(jsonLdScripts[i]).html() || "{}");
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          // Prefer Event/TheaterEvent descriptions
          if ((item["@type"]?.includes("Event") || item["@type"] === "TheaterEvent") &&
              item.description && item.description.length > 20) {
            return cleanDescription(item.description);
          }
          if (item.description && item.description.length > 30 &&
              !item.description.includes("Welkom in") && !bestJsonLdDesc) {
            bestJsonLdDesc = item.description;
          }
          if (item["@graph"]) {
            for (const node of item["@graph"]) {
              if ((node["@type"]?.includes("Event") || node["@type"] === "Article") &&
                  node.description && node.description.length > 20) {
                return cleanDescription(node.description);
              }
              if (node.description && node.description.length > 30 &&
                  !node.description.includes("Welkom in") && !bestJsonLdDesc) {
                bestJsonLdDesc = node.description;
              }
            }
          }
        }
      } catch {
        // Invalid JSON, skip
      }
    }
    if (bestJsonLdDesc) return cleanDescription(bestJsonLdDesc);

    // Strategy 2: Meta description
    const metaDesc = $('meta[name="description"]').attr("content")
      || $('meta[property="og:description"]').attr("content");
    if (metaDesc && metaDesc.length > 20) {
      return cleanDescription(metaDesc);
    }

    // Strategy 3: First meaningful paragraph on the page
    // Skip very short paragraphs and navigation text
    const paragraphs = $("main p, article p, .content p, [class*=description] p, [class*=body] p");
    for (let i = 0; i < Math.min(paragraphs.length, 10); i++) {
      const text = $(paragraphs[i]).text().trim();
      if (text.length > 40 && !text.includes("cookie") && !text.includes("©")) {
        return cleanDescription(text);
      }
    }

    // Strategy 4: Any paragraph that's long enough
    const allP = $("p");
    for (let i = 0; i < Math.min(allP.length, 20); i++) {
      const text = $(allP[i]).text().trim();
      if (text.length > 60 && !text.includes("cookie") && !text.includes("©") && !text.includes("privacy")) {
        return cleanDescription(text);
      }
    }
  } catch {
    // Timeout or network error
  }

  return "";
}

function cleanDescription(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 300); // Cap at 300 chars
}

/**
 * Enrich events that are missing descriptions by fetching their detail pages.
 * Rate-limited to avoid hammering servers.
 */
export async function enrichDescriptions(events: ScrapedEvent[]): Promise<ScrapedEvent[]> {
  const needsEnrichment = events.filter(
    (e) =>
      ((!e.description || e.description.length < 30 || e.description.includes("Welkom in Haarlem")) &&
      e.ticketUrl)
  );

  if (needsEnrichment.length === 0) {
    console.log("  All events already have descriptions");
    return events;
  }

  console.log(`  Enriching ${needsEnrichment.length} events with descriptions...`);

  let enriched = 0;
  for (const event of needsEnrichment) {
    const desc = await fetchDescription(event.ticketUrl!);
    if (desc) {
      event.description = desc;
      enriched++;
      console.log(`    ✅ ${event.title}: "${desc.slice(0, 60)}..."`);
    } else {
      console.log(`    ⚠️  ${event.title}: no description found`);
    }

    // Rate limit: 300ms between requests
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`  Enriched ${enriched}/${needsEnrichment.length} events`);
  return events;
}
