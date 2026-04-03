const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

type PlacePhoto = {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: { displayName: string; uri: string }[];
};

type PlaceDetailsResponse = {
  photos?: PlacePhoto[];
  displayName?: { text: string };
};

/**
 * Fetch photos for a Google Place ID.
 * Returns photo URLs with attribution info.
 */
export async function getPlacePhotos(
  placeId: string,
  maxResults = 3
): Promise<{ url: string; attribution: string }[]> {
  if (!API_KEY) {
    console.warn("GOOGLE_PLACES_API_KEY not set, skipping photo fetch");
    return [];
  }

  // Step 1: Get photo references from Place Details
  const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=photos,displayName&key=${API_KEY}`;

  const detailsRes = await fetch(detailsUrl, {
    headers: { "X-Goog-FieldMask": "photos,displayName" },
    next: { revalidate: 86400 }, // cache for 24h
  });

  if (!detailsRes.ok) {
    console.error(`Places API error: ${detailsRes.status}`);
    return [];
  }

  const details: PlaceDetailsResponse = await detailsRes.json();

  if (!details.photos || details.photos.length === 0) {
    return [];
  }

  // Step 2: Build photo URLs (up to maxResults)
  const photos = details.photos.slice(0, maxResults);

  return photos.map((photo) => {
    const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${API_KEY}`;
    const attribution = photo.authorAttributions?.[0]?.displayName || "";

    return { url: photoUrl, attribution };
  });
}

/**
 * Get a single photo URL for a place. Returns null if no photos.
 */
export async function getPlacePhotoUrl(
  placeId: string
): Promise<{ url: string; attribution: string } | null> {
  const photos = await getPlacePhotos(placeId, 1);
  return photos[0] || null;
}
