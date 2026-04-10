/**
 * Berry's Brain — generates a "dagplan" (day plan) tip.
 * Uses scoring to pick the best event + activity for today's situation.
 * Guards: seasonal filtering, date filtering (caller provides today's events),
 * weather-appropriate scoring.
 */

import type { SiteContext } from "./context";
import type { Event } from "@/data/events";
import type { Activity } from "@/data/activities";
import type { SeasonSuggestion } from "@/data/dutch-calendar";

export type BerryTip = {
  message: string;
  mood: "sunny" | "rainy" | "festive" | "chill" | "excited";
  vibe: string; // lowercase mood label, e.g. "zonnige paasmaandag"
  whyNow: string; // one-line reason for the #1 pick
};

/** Filter activities to those available this month */
function getAvailableActivities(all: Activity[], month: number): Activity[] {
  return all.filter((a) => !a.availableMonths || a.availableMonths.includes(month));
}

/** Simple hash for daily seed — same picks all day, different tomorrow */
function dailySeed(slug: string): number {
  const dateStr = new Date().toISOString().split("T")[0];
  const str = dateStr + slug;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 5;
}

/** Category bonus — prioritize one-off events over recurring films */
const CATEGORY_BONUS: Record<string, number> = {
  Festival: 6,
  Markt: 5,
  Event: 4,
  Concert: 3,
  Theater: 2,
  Film: 0,
};

/** Score an event based on weather fit, cost, data quality, and event type */
export function scoreEvent(event: Event, ctx: SiteContext): number {
  let score = 0;
  if (ctx.weather.isRainy && event.indoor) score += 4;
  if (ctx.weather.isGoodWeather && !event.indoor) score += 4;
  if (ctx.weather.current.temp < 10 && event.indoor) score += 3;
  if (event.free) score += 3;
  if (event.image !== "/berry-icon.png") score += 2;
  if (event.time) score += 1;
  score += CATEGORY_BONUS[event.category] ?? 1; // unique event types beat films
  score += dailySeed(event.slug); // 0–4 daily variety
  return score;
}

/** Score an activity based on weather fit */
export function scoreActivity(activity: Activity, ctx: SiteContext): number {
  let score = 0;
  const isIndoorCat = activity.category === "indoor" || activity.category === "cultuur";
  const isOutdoorCat = activity.category === "sport" || activity.category === "natuur" || activity.category === "dieren";
  if (ctx.weather.isRainy && isIndoorCat) score += 3;
  if (ctx.weather.isGoodWeather && isOutdoorCat) score += 3;
  if (ctx.weather.current.temp < 10 && isIndoorCat) score += 2;
  if (activity.free) score += 2;
  score += dailySeed(activity.slug); // 0–4 daily variety
  return score;
}

/** Enforce max N items per subcategory for diversity */
export function enforceVariety<T>(
  items: T[],
  getSubcategory: (item: T) => string,
  maxPerSubcategory: number,
  limit: number,
): T[] {
  const counts = new Map<string, number>();
  const result: T[] = [];
  for (const item of items) {
    const sub = getSubcategory(item);
    const count = counts.get(sub) || 0;
    if (count >= maxPerSubcategory) continue;
    counts.set(sub, count + 1);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

/** Boost a base score with family profile data (client-side) */
export function scoreWithProfile(
  baseScore: number,
  item: {
    ageMin?: number;
    ageMax?: number;
    subcategory?: string;
    category?: string;
    free?: boolean;
  },
  profile: { kids: { age: number; interests: string[] }[]; area: string }
): number {
  // Lazy import to avoid circular deps — these are pure functions
  const { fitsAge, matchesInterest } = require("@/lib/personalization");
  let boost = 0;

  if (profile.kids.length === 0) return baseScore;

  // Age fit: +5 if fits youngest, +3 if fits any other
  const youngest = Math.min(...profile.kids.map((k) => k.age));
  const fitsYoungest = fitsAge(item.ageMin, item.ageMax, youngest);
  const fitsAny = profile.kids.some((k) => fitsAge(item.ageMin, item.ageMax, k.age));

  if (fitsYoungest) {
    boost += 5;
  } else if (fitsAny) {
    boost += 3;
  } else {
    boost -= 3; // Penalize activities that don't fit any kid
  }

  // Age spread bonus: "Alle leeftijden" great for multi-kid families
  if (item.ageMin === undefined && item.ageMax === undefined && profile.kids.length >= 2) {
    boost += 3;
  }

  // Interest match: +4 if matches any kid's interests
  const allInterests = profile.kids.flatMap((k) => k.interests);
  const sub = item.subcategory || item.category || "";
  if (allInterests.length > 0 && matchesInterest(sub, allInterests)) {
    boost += 4;
  }

  return baseScore + boost;
}

export function generateBerryDayPlan(
  ctx: SiteContext,
  events: Event[],
  allActivities: Activity[],
  seasonSuggestions: SeasonSuggestion[]
): BerryTip {
  const { weather, calendar, season } = ctx;
  const currentMonth = new Date().getMonth() + 1;

  // --- Filter: only verified + available this month ---
  const verified = allActivities.filter((a) => a.verified);
  const available = getAvailableActivities(verified, currentMonth);

  // --- Score and pick best event ---
  const scoredEvents = events
    .map((e) => ({ event: e, score: scoreEvent(e, ctx) }))
    .sort((a, b) => b.score - a.score);
  const eventPick = scoredEvents[0]?.event || null;

  // --- Score and pick best activity (different from event) ---
  const scoredActivities = available
    .map((a) => ({ activity: a, score: scoreActivity(a, ctx) }))
    .sort((a, b) => b.score - a.score);
  const activityPick = scoredActivities.find(
    (a) => a.activity.title !== eventPick?.title
  )?.activity || scoredActivities[0]?.activity || null;

  // --- Build the message — conversational, opinionated, first person ---

  let opener = "";

  if (calendar.holidayName?.includes("Paas")) {
    opener = "Fijne Pasen! 🥚";
  } else if (calendar.holidayName === "Koningsdag") {
    opener = "Fijne Koningsdag! 🧡";
  } else if (calendar.isSchoolVacation) {
    opener = `${calendar.vacationName}!`;
  } else if (calendar.isLongWeekend) {
    opener = `${calendar.longWeekendName}!`;
  } else if (weather.isRainy) {
    opener = "Regendag — maar ik heb iets voor je.";
  } else if (weather.isGoodWeather) {
    opener = `${weather.current.temp}°C en ${weather.current.description.toLowerCase()}. Ga eropuit.`;
  } else {
    opener = `${weather.current.icon} ${weather.current.temp}°C vandaag.`;
  }

  // Morning: event — conversational, with opinion
  let morning = "";
  if (eventPick) {
    const timeNote = eventPick.time ? ` Ga voor ${eventPick.time}, dan is het nog rustig.` : "";
    const freeNote = eventPick.free ? " En het is gratis." : "";
    morning = `Ga naar [${eventPick.title}](/event/${eventPick.slug}) in ${eventPick.location}.${timeNote}${freeNote}`;
  }

  // Afternoon: activity — opinion-first, not description
  let afternoon = "";
  if (activityPick) {
    const tip = activityPick.tip || activityPick.description.slice(0, 70);
    afternoon = `Daarna: [${activityPick.title}](/activiteiten/${activityPick.slug}). ${tip}`;
  }

  // Closing — personal, not generic
  const seasonTip = seasonSuggestions[0];
  let closing = "";
  if (weather.isRainy) {
    closing = "En daarna warme chocomel. Verdiend.";
  } else if (seasonTip && weather.isGoodWeather) {
    closing = `Oh, en: [${seasonTip.title.toLowerCase()}](/tips/${seasonTip.slug}) is ook een aanrader nu.`;
  } else {
    closing = "Goede dag wordt dit.";
  }

  // --- Vibe label (lowercase, Spotify-style) ---
  const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const dayName = dayNames[new Date().getDay()];
  let vibe = "";
  if (calendar.holidayName?.includes("Paas")) {
    vibe = weather.isGoodWeather ? `zonnige paas${dayName}` : `gezellige paas${dayName}`;
  } else if (calendar.holidayName === "Koningsdag") {
    vibe = "oranje koningsdag";
  } else if (calendar.isSchoolVacation) {
    vibe = weather.isGoodWeather ? `buitendag ${calendar.vacationName?.toLowerCase()}` : `binnendag ${calendar.vacationName?.toLowerCase()}`;
  } else if (weather.isRainy) {
    vibe = `binnenblijf-${dayName}`;
  } else if (weather.isGoodWeather && weather.current.temp >= 18) {
    vibe = `warme ${dayName} buitendag`;
  } else if (weather.isGoodWeather) {
    vibe = `eerste-zonnedag-${dayName}`;
  } else if (weather.current.temp < 8) {
    vibe = `koude ${dayName} — warm binnen`;
  } else {
    vibe = `rustige ${dayName}`;
  }

  // --- "Waarom nu" for the #1 pick ---
  let whyNow = "";
  if (eventPick) {
    if (weather.isGoodWeather && !eventPick.indoor) {
      whyNow = `${weather.current.temp}°C en droog — perfect om eropuit te gaan`;
    } else if (weather.isRainy && eventPick.indoor) {
      whyNow = "Het regent, maar hier zit je warm en droog";
    } else if (eventPick.free) {
      whyNow = "Gratis, gezellig, en vandaag in de buurt";
    } else if (calendar.holidayName) {
      whyNow = `${calendar.holidayName} — iets bijzonders vandaag`;
    } else {
      whyNow = "Berry's beste keuze voor vandaag";
    }
  }

  // Assemble — skip empty lines
  const lines = [
    opener,
    morning,
    afternoon,
    closing,
  ].filter(Boolean);

  // If no events AND no activities, give a simple message
  if (!eventPick && !activityPick) {
    return {
      message: `${opener} Vandaag geen evenementen, maar scroll naar beneden — er is genoeg te doen.`,
      mood: weather.isRainy ? "rainy" : "chill",
      vibe,
      whyNow: weather.isGoodWeather ? "Lekker weer, ga naar buiten" : "Genoeg te doen binnen",
    };
  }

  // If no events — rescore activities with heavy free+outdoor bias
  if (!eventPick) {
    const freeOutdoor = available
      .filter((a) => a.free && (a.category === "natuur" || a.category === "dieren" || a.category === "sport"))
      .sort((a, b) => scoreActivity(b, ctx) - scoreActivity(a, ctx));
    const freeIndoor = available
      .filter((a) => a.free && (a.category === "indoor" || a.category === "cultuur"))
      .sort((a, b) => scoreActivity(b, ctx) - scoreActivity(a, ctx));

    const topFree = weather.isGoodWeather
      ? freeOutdoor[0] || freeIndoor[0] || activityPick
      : freeIndoor[0] || freeOutdoor[0] || activityPick;
    const altFree = weather.isGoodWeather
      ? freeOutdoor[1] || freeIndoor[0]
      : freeIndoor[1] || freeOutdoor[0];

    const topLine = topFree
      ? `👉 [${topFree.title}](/activiteiten#${topFree.slug}) — ${topFree.description.slice(0, 80)}. Gratis!`
      : "";
    const altLine = altFree
      ? `Of: [${altFree.title}](/activiteiten#${altFree.slug}) — ${altFree.description.slice(0, 60)}.`
      : "";

    const noEventOpener = weather.isGoodWeather
      ? `${opener} Geen agenda nodig — ga lekker naar buiten:`
      : weather.isRainy
        ? `${opener} Geen evenementen, maar genoeg te doen binnen:`
        : `${opener} Geen evenementen vandaag, maar dit kan altijd:`;

    const msgLines = [noEventOpener, topLine, altLine, closing].filter(Boolean);

    return {
      message: msgLines.join("\n\n"),
      mood: weather.isGoodWeather ? "sunny" : weather.isRainy ? "rainy" : "chill",
      vibe,
      whyNow: topFree ? `${topFree.title} — altijd goed` : "Genoeg te doen in de buurt",
    };
  }

  return {
    message: lines.join("\n\n"),
    mood: calendar.holidayName
      ? "festive"
      : weather.isRainy
        ? "rainy"
        : weather.isGoodWeather
          ? "sunny"
          : "chill",
    vibe,
    whyNow,
  };
}
