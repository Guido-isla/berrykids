/**
 * Script to look up Google Place IDs for Berry Kids venues.
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=your_key npx tsx scripts/lookup-places.ts
 *
 * This will output the placeId for each venue so you can add them to events.ts.
 */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY environment variable");
  process.exit(1);
}

const venues = [
  "Grote Markt, Haarlem",
  "Kenaupark, Haarlem",
  "De Dakkas, Haarlem",
  "Centrum Heemstede",
  "Patronaat, Haarlem",
  "Kinderboerderij De Olievaar, Haarlem",
  "Pannenkoekenhuisje, Bloemendaal",
  "Teylers Museum, Haarlem",
  "Strand Zuid, Zandvoort",
  "Frans Hals Museum, Haarlem",
  "Dorpsplein, Bennebroek",
  "Sporthal De Blekersvaart, Heemstede",
  "Bezoekerscentrum De Kennemerduinen, Overveen",
  "Kookstudio Bijzonder, Haarlem",
  "Landgoed Elswout, Bloemendaal",
  "Waterleidingduinen, Zandvoort",
  "Julianaplein, Heemstede",
  "Het Woelige Nest, Bennebroek",
];

async function lookupPlace(query: string) {
  const url = `https://places.googleapis.com/v1/places:searchText`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.photos",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: 52.3874, longitude: 4.6462 },
          radius: 15000,
        },
      },
    }),
  });

  if (!res.ok) {
    console.error(`Error for "${query}": ${res.status}`);
    return null;
  }

  const data = await res.json();
  const place = data.places?.[0];

  if (!place) {
    console.log(`  ❌ No result for: ${query}`);
    return null;
  }

  return {
    query,
    placeId: place.id,
    name: place.displayName?.text,
    address: place.formattedAddress,
    photoCount: place.photos?.length || 0,
  };
}

async function main() {
  console.log("Looking up Google Place IDs for Berry Kids venues...\n");

  for (const venue of venues) {
    const result = await lookupPlace(venue);
    if (result) {
      console.log(`  ✅ ${result.query}`);
      console.log(`     → placeId: "${result.placeId}"`);
      console.log(`     → name: ${result.name}`);
      console.log(`     → photos: ${result.photoCount}`);
      console.log();
    }

    // Rate limit: 100ms between requests
    await new Promise((r) => setTimeout(r, 100));
  }
}

main();
