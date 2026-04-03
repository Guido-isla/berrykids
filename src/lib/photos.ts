type PhotoManifest = Record<
  string,
  { file: string; attribution: string; fetchedAt: string }
>;

type HasSlugAndImage = { slug: string; image: string };

let manifestCache: PhotoManifest | null = null;

function loadManifest(): PhotoManifest {
  if (manifestCache) return manifestCache;

  try {
    const fs = require("fs");
    const path = require("path");
    const manifestPath = path.join(process.cwd(), "public/photos/manifest.json");
    if (fs.existsSync(manifestPath)) {
      manifestCache = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      return manifestCache!;
    }
  } catch {
    // Client-side or fs not available
  }
  return {};
}

/**
 * Get the best available image for any item with a slug and image field.
 * Works for events, activities, or anything else.
 */
export function getEventImage(item: HasSlugAndImage): {
  src: string;
  attribution: string;
} {
  const manifest = loadManifest();
  const cached = manifest[item.slug];

  if (cached) {
    return { src: cached.file, attribution: cached.attribution };
  }

  return { src: item.image, attribution: "" };
}

/**
 * Resolve images for a list of items. Call server-side,
 * pass resolved data to client components.
 */
export function resolveEventImages<T extends HasSlugAndImage>(
  items: T[]
): (T & { resolvedImage: string; photoAttribution: string })[] {
  return items.map((item) => {
    const { src, attribution } = getEventImage(item);
    return { ...item, resolvedImage: src, photoAttribution: attribution };
  });
}
