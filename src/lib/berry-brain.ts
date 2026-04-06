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
};

/** Filter activities to those available this month */
function getAvailableActivities(all: Activity[], month: number): Activity[] {
  return all.filter((a) => !a.availableMonths || a.availableMonths.includes(month));
}

/** Score an event based on weather fit, cost, and data quality */
function scoreEvent(event: Event, ctx: SiteContext): number {
  let score = 0;
  if (ctx.weather.isRainy && event.indoor) score += 4;
  if (ctx.weather.isGoodWeather && !event.indoor) score += 4;
  if (ctx.weather.current.temp < 10 && event.indoor) score += 3;
  if (event.free) score += 3;
  if (event.image !== "/berry-icon.png") score += 2;
  if (event.time) score += 1;
  return score;
}

/** Score an activity based on weather fit */
function scoreActivity(activity: Activity, ctx: SiteContext): number {
  let score = 0;
  const isIndoorCat = activity.category === "indoor" || activity.category === "cultuur";
  const isOutdoorCat = activity.category === "sport" || activity.category === "natuur" || activity.category === "dieren";
  if (ctx.weather.isRainy && isIndoorCat) score += 3;
  if (ctx.weather.isGoodWeather && isOutdoorCat) score += 3;
  if (ctx.weather.current.temp < 10 && isIndoorCat) score += 2;
  if (activity.free) score += 2;
  return score;
}

export function generateBerryDayPlan(
  ctx: SiteContext,
  events: Event[],
  allActivities: Activity[],
  seasonSuggestions: SeasonSuggestion[]
): BerryTip {
  const { weather, calendar, season } = ctx;
  const currentMonth = new Date().getMonth() + 1;

  // --- Filter activities by season ---
  const available = getAvailableActivities(allActivities, currentMonth);

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

  // --- Build the message ---

  let opener = "";
  let planIntro = "";

  if (calendar.holidayName?.includes("Paas")) {
    opener = "Fijne Pasen! 🥚";
    planIntro = "Mijn dagplan voor vandaag:";
  } else if (calendar.holidayName === "Koningsdag") {
    opener = "Fijne Koningsdag! 🧡";
    planIntro = "Dit is mijn oranje dagplan:";
  } else if (calendar.isSchoolVacation) {
    opener = `${calendar.vacationName}!`;
    planIntro = "Geen school — dit is mijn plan:";
  } else if (calendar.isLongWeekend) {
    opener = `${calendar.longWeekendName}!`;
    planIntro = "Lang weekend, extra tijd. Mijn plan:";
  } else if (weather.isRainy) {
    opener = "Het regent 🌧️ maar geen probleem.";
    planIntro = "Mijn binnendag-plan:";
  } else if (weather.isGoodWeather) {
    opener = `${weather.current.temp}°C en ${weather.current.description.toLowerCase()} — heerlijk!`;
    planIntro = "Mijn plan voor vandaag:";
  } else {
    opener = `${weather.current.icon} ${weather.current.temp}°C vandaag.`;
    planIntro = "Mijn dagplan:";
  }

  // Morning: event (only if we have one for today)
  let morning = "";
  if (eventPick) {
    morning = `☀️ Ochtend: [${eventPick.title}](/event/${eventPick.slug}) in ${eventPick.location}.${eventPick.time ? ` Om ${eventPick.time}.` : ""} ${eventPick.free ? "Gratis!" : ""}`;
  }

  // Afternoon: activity
  let afternoon = "";
  if (activityPick) {
    const actLink = activityPick.website || "/activiteiten";
    afternoon = `🌤️ Middag: [${activityPick.title}](${actLink}) — ${activityPick.description.slice(0, 80)}.${activityPick.free ? " Gratis!" : ""}`;
  }

  // Seasonal closing
  const seasonTip = seasonSuggestions[0];
  let closing = "";
  if (seasonTip && weather.isGoodWeather) {
    closing = `${season.emoji} Bonustip: [${seasonTip.title.toLowerCase()}](/tips/${seasonTip.slug}) — ${seasonTip.description.slice(0, 60)}.`;
  } else if (weather.isRainy) {
    closing = "☕ En daarna warme chocomel op de bank — verdiend!";
  } else {
    closing = "Klinkt als een goede dag!";
  }

  // Assemble — skip empty lines
  const lines = [
    `${opener} ${planIntro}`,
    morning,
    afternoon,
    closing,
  ].filter(Boolean);

  // If no events AND no activities, give a simple message
  if (!eventPick && !activityPick) {
    return {
      message: `${opener} Vandaag geen specifieke evenementen gepland. Scroll naar beneden voor activiteiten in de buurt!`,
      mood: weather.isRainy ? "rainy" : "chill",
    };
  }

  // If no events but we have an activity
  if (!eventPick) {
    return {
      message: `${opener} Geen evenementen vandaag, maar dit kan altijd:\n\n${afternoon}\n\n${closing}`,
      mood: weather.isRainy ? "rainy" : "chill",
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
  };
}
