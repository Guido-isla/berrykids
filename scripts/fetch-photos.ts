/**
 * Fetches photos from Google Places API for all events with a googlePlaceId.
 * Saves them to public/photos/ so they're served statically.
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=your_key npx tsx scripts/fetch-photos.ts
 *
 * Run this once after adding placeIds, or periodically to refresh.
 * Photos are cached locally — won't re-download if they already exist.
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY environment variable");
  process.exit(1);
}

// Import events — use dynamic import since it's TS
async function loadEvents() {
  // Read the events file and extract placeIds manually to avoid TS compilation
  const eventsFile = readFileSync(
    join(__dirname, "../src/data/events.ts"),
    "utf-8"
  );

  const placeIdMatches = [
    ...eventsFile.matchAll(/slug:\s*"([^"]+)"[\s\S]*?googlePlaceId:\s*"([^"]+)"/g),
  ];

  return placeIdMatches.map((m) => ({
    slug: m[1],
    googlePlaceId: m[2],
  }));
}

const PHOTOS_DIR = join(__dirname, "../public/photos");
const MANIFEST_PATH = join(PHOTOS_DIR, "manifest.json");

type Manifest = Record<
  string,
  { file: string; attribution: string; fetchedAt: string }
>;

function loadManifest(): Manifest {
  if (existsSync(MANIFEST_PATH)) {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  }
  return {};
}

function saveManifest(manifest: Manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function fetchPlacePhoto(
  placeId: string
): Promise<{ photoName: string; attribution: string } | null> {
  // Step 1: Get photo references
  const detailsRes = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY!,
        "X-Goog-FieldMask": "photos",
      },
    }
  );

  if (!detailsRes.ok) {
    console.error(`  Details API error: ${detailsRes.status}`);
    return null;
  }

  const details = await detailsRes.json();
  const photo = details.photos?.[0];

  if (!photo) {
    console.log(`  No photos available`);
    return null;
  }

  return {
    photoName: photo.name,
    attribution: photo.authorAttributions?.[0]?.displayName || "",
  };
}

async function downloadPhoto(
  photoName: string,
  outputPath: string
): Promise<boolean> {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${API_KEY}`;

  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok) {
    console.error(`  Photo download error: ${res.status}`);
    return false;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  return true;
}

async function main() {
  console.log("Fetching Google Places photos for Berry Kids events...\n");

  if (!existsSync(PHOTOS_DIR)) {
    mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  const manifest = loadManifest();
  const events = await loadEvents();

  if (events.length === 0) {
    console.log("No events with googlePlaceId found. Add placeIds to events.ts first.");
    console.log("Run: GOOGLE_PLACES_API_KEY=your_key npx tsx scripts/lookup-places.ts");
    return;
  }

  for (const event of events) {
    const filename = `${event.slug}.jpg`;
    const filepath = join(PHOTOS_DIR, filename);

    // Skip if already downloaded
    if (existsSync(filepath) && manifest[event.slug]) {
      console.log(`⏭️  ${event.slug} — already cached`);
      continue;
    }

    console.log(`📷 ${event.slug} (${event.googlePlaceId})`);

    const photoRef = await fetchPlacePhoto(event.googlePlaceId);
    if (!photoRef) {
      continue;
    }

    const success = await downloadPhoto(photoRef.photoName, filepath);
    if (success) {
      manifest[event.slug] = {
        file: `/photos/${filename}`,
        attribution: photoRef.attribution,
        fetchedAt: new Date().toISOString(),
      };
      console.log(`  ✅ Saved → ${filename} (by ${photoRef.attribution})`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 200));
  }

  saveManifest(manifest);
  console.log(`\nDone. Manifest saved to ${MANIFEST_PATH}`);
  console.log(`\nNext step: update events.ts image fields to use /photos/[slug].jpg`);
  console.log(`Or use getEventImage() from lib/photos.ts for automatic fallback.`);
}

main();
