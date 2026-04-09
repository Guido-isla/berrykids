/**
 * Loads scraped venue programming and merges with manual programming data.
 * Falls back to manual data when scraped data is empty or stale.
 */

import scrapedData from "./scraped-events.json";
import { theaterAgenda as manualTheater, filmVanDeWeek as manualFilm } from "./programming";
import type { TheaterShow } from "./programming";

type ScrapedEvent = {
  source: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  ageLabel?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  ticketUrl?: string;
  category?: string;
  tags?: string[];
};

/**
 * Get all theater/concert shows — scraped + manual, deduped.
 */
export function getAllTheaterShows(): TheaterShow[] {
  const shows: TheaterShow[] = [...manualTheater];

  const scraped = (scrapedData.events as ScrapedEvent[]).filter(
    (e) => e.category === "theater" || e.category === "concert"
  );

  for (const s of scraped) {
    // Skip if we already have a manual entry with same title and date
    const isDupe = shows.some(
      (m) =>
        m.title.toLowerCase().includes(s.title.toLowerCase().slice(0, 15)) &&
        m.date === s.date
    );
    if (isDupe) continue;

    shows.push({
      title: s.title,
      venue: s.venue,
      date: s.date,
      time: s.time || "TBA",
      ageLabel: s.ageLabel || "Alle leeftijden",
      price: s.price || "Zie website",
      description: s.description || "",
      ticketUrl: s.ticketUrl,
      imageUrl: s.imageUrl && s.imageUrl.startsWith("https://") ? s.imageUrl : undefined,
    });
  }

  // Sort by date
  shows.sort((a, b) => a.date.localeCompare(b.date));

  // Only future events
  const now = new Date().toISOString().split("T")[0];
  return shows.filter((s) => s.date >= now);
}

/**
 * Get film showtimes — scraped films or manual fallback.
 */
export function getFilmVanDeWeek() {
  const films = getAllKidsFilms();
  return films[0] || manualFilm;
}

/**
 * Get all kids films — scraped + manual + Pathé Haarlem.
 */
export type KidsFilm = {
  slug: string;
  title: string;
  cinema: string;
  times: string[];
  ageLabel: string;
  description: string;
  image: string;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export function getAllKidsFilms(): KidsFilm[] {
  const films: KidsFilm[] = [];
  const seen = new Set<string>();

  // Scraped films — only future dates, skip mistagged events
  const today = new Date().toISOString().split("T")[0];
  const nonFilmWords = ["ontbijt", "brunch", "markt", "festival", "workshop"];
  const scrapedFilms = (scrapedData.events as ScrapedEvent[]).filter(
    (e) =>
      e.category === "film" &&
      e.date >= today &&
      !nonFilmWords.some((w) => e.title.toLowerCase().includes(w))
  );

  // Group scraped by title
  const byTitle = new Map<string, ScrapedEvent[]>();
  for (const f of scrapedFilms) {
    const existing = byTitle.get(f.title) || [];
    existing.push(f);
    byTitle.set(f.title, existing);
  }

  for (const [title, showings] of byTitle) {
    if (seen.has(title.toLowerCase())) continue;
    seen.add(title.toLowerCase());
    films.push({
      slug: slugify(title),
      title,
      cinema: showings[0].venue,
      times: showings.map((f) => {
        const dayName = ["zo", "ma", "di", "wo", "do", "vr", "za"][
          new Date(f.date + "T00:00:00").getDay()
        ];
        return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${f.time}`;
      }),
      ageLabel: showings[0].ageLabel || "Alle leeftijden",
      description: showings[0].description || "",
      image: showings[0].imageUrl || manualFilm.image,
    });
  }

  // Pathé Haarlem kids films — manually curated from pathe.nl/bioscoop/haarlem
  // Updated April 2026 — real current lineup
  const patheFilms = [
    {
      slug: "the-super-mario-galaxy-movie",
      title: "The Super Mario Galaxy Movie",
      cinema: "Pathé Haarlem",
      times: ["Za 11:00", "Za 14:00", "Zo 11:00", "Wo 14:00"],
      ageLabel: "6+ jaar",
      description: "Mario en Luigi op avontuur door het heelal. Spectaculaire animatie voor het hele gezin.",
      image: "https://image.tmdb.org/t/p/w500/ekF2RiziyzLeXsTvEvhhRjEc7Eo.jpg",
    },
    {
      slug: "mike-molly-vieren-feest",
      title: "Mike & Molly vieren feest",
      cinema: "Pathé Haarlem",
      times: ["Za 10:30", "Zo 10:30", "Wo 10:30"],
      ageLabel: "AL",
      description: "Feestelijke animatiefilm voor de allerkleinsten. Kort en vrolijk.",
      image: "https://static.filmvandaag.nl/covers/original/149000/149419.jpg?v=1&width=400",
    },
    {
      slug: "super-charlie",
      title: "Super Charlie",
      cinema: "Pathé Haarlem",
      times: ["Za 13:30", "Zo 13:30"],
      ageLabel: "6+ jaar",
      description: "Fantasie-avontuur over een jongen met superkrachten. Scandinavische productie.",
      image: "https://image.tmdb.org/t/p/w500/mdmULykTC1owrECUXTp2haR1Boq.jpg",
    },
    {
      slug: "jumpers",
      title: "Jumpers",
      cinema: "Pathé Haarlem",
      times: ["Za 16:00", "Zo 14:00", "Wo 14:30"],
      ageLabel: "6+ jaar",
      description: "Snelle animatiefilm vol actie en humor. Nieuw in de bioscoop.",
      image: "https://image.tmdb.org/t/p/w500/lf1bwcuLOuBbsLw9wO2EMhNsNtU.jpg",
    },
    {
      slug: "david",
      title: "David",
      cinema: "Pathé Haarlem",
      times: ["Za 11:30", "Zo 16:00"],
      ageLabel: "9+ jaar",
      description: "Animatiefilm over het beroemde bijbelverhaal. Mooi gemaakt, voor oudere kinderen.",
      image: "https://image.tmdb.org/t/p/w500/3f3bdkHG66HwPczYzbWoZK3lWtK.jpg",
    },
    {
      slug: "goat",
      title: "GOAT",
      cinema: "Pathé Haarlem",
      times: ["Za 14:00", "Zo 11:30", "Wo 14:00"],
      ageLabel: "6+ jaar",
      description: "Grappige animatiefilm over een geit met grote sportdromen.",
      image: "https://image.tmdb.org/t/p/w500/ozUcWnTDu1j0tlj1UzCNSLWWKw8.jpg",
    },
  ];

  for (const pf of patheFilms) {
    if (seen.has(pf.title.toLowerCase())) continue;
    seen.add(pf.title.toLowerCase());
    films.push(pf);
  }

  // Add manual fallback if no films yet
  if (!seen.has(manualFilm.title.toLowerCase())) {
    films.push({ ...manualFilm, slug: slugify(manualFilm.title) });
  }

  return films;
}

export function getFilmBySlug(slug: string): KidsFilm | undefined {
  return getAllKidsFilms().find((f) => f.slug === slug);
}
