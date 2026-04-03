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
  const scrapedFilms = (scrapedData.events as ScrapedEvent[]).filter(
    (e) => e.category === "film"
  );

  if (scrapedFilms.length > 0) {
    const film = scrapedFilms[0];
    return {
      title: film.title,
      cinema: film.venue,
      times: scrapedFilms
        .filter((f) => f.title === film.title)
        .map((f) => {
          const dayName = ["zo", "ma", "di", "wo", "do", "vr", "za"][
            new Date(f.date + "T00:00:00").getDay()
          ];
          return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${f.time}`;
        }),
      ageLabel: film.ageLabel || "Alle leeftijden",
      description: film.description || "",
      image: film.imageUrl || manualFilm.image,
    };
  }

  return manualFilm;
}
