/**
 * Berry's Brain — generates a "dagplan" (day plan) tip.
 * Combines an event + an activity into a mini plan for the day.
 */

import type { SiteContext } from "./context";
import type { Event } from "@/data/events";
import type { Activity } from "@/data/activities";
import type { SeasonSuggestion } from "@/data/dutch-calendar";

export type BerryTip = {
  /** Lines of text. Lines starting with [text](href) will be rendered as links. */
  message: string;
  mood: "sunny" | "rainy" | "festive" | "chill" | "excited";
};

export function generateBerryDayPlan(
  ctx: SiteContext,
  events: Event[],
  allActivities: Activity[],
  seasonSuggestions: SeasonSuggestion[]
): BerryTip {
  const { weather, calendar, season } = ctx;

  const indoor = events.filter((e) => e.indoor);
  const outdoor = events.filter((e) => !e.indoor);
  const indoorActivities = allActivities.filter((a) => a.category === "indoor" || a.category === "cultuur");
  const outdoorActivities = allActivities.filter((a) => a.category === "sport" || a.category === "natuur" || a.category === "dieren");

  // Pick event + activity based on weather
  const eventPick = weather.isRainy ? (indoor[0] || events[0]) : (outdoor[0] || events[0]);
  const activityPick = weather.isRainy
    ? indoorActivities[0] || allActivities[0]
    : outdoorActivities[0] || allActivities[0];

  // Make sure they're different
  const activity = activityPick?.title === eventPick?.title
    ? (weather.isRainy ? outdoorActivities[0] : indoorActivities[0]) || allActivities[1]
    : activityPick;

  // --- Build the day plan ---

  let opener = "";
  let planIntro = "";
  let morning = "";
  let afternoon = "";
  let closing = "";

  // Opener based on context
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

  // Morning: the event with inline link
  if (eventPick) {
    morning = `☀️ Ochtend: [${eventPick.title}](/event/${eventPick.slug}) in ${eventPick.location}.${eventPick.time ? ` Om ${eventPick.time}.` : ""} ${eventPick.free ? "Gratis!" : ""}`;
  }

  // Afternoon: the activity with inline link
  if (activity) {
    const actLink = activity.website ? activity.website : "/activiteiten";
    afternoon = `🌤️ Middag: [${activity.title}](${actLink}) — ${activity.description.slice(0, 80)}.${activity.free ? " Gratis!" : ""}`;
  }

  // Seasonal closing with inline link
  const seasonTip = seasonSuggestions[0];
  if (seasonTip && weather.isGoodWeather) {
    closing = `${season.emoji} Bonustip: [${seasonTip.title.toLowerCase()}](/tips/${seasonTip.slug}) — ${seasonTip.description.slice(0, 60)}.`;
  } else if (weather.isRainy) {
    closing = "☕ En daarna warme chocomel op de bank — verdiend!";
  } else {
    closing = "Klinkt als een goede dag! Scroll naar beneden voor meer ideeën.";
  }

  const message = `${opener} ${planIntro}\n\n${morning}\n\n${afternoon}\n\n${closing}`;

  return {
    message,
    mood: calendar.holidayName ? "festive" : weather.isRainy ? "rainy" : weather.isGoodWeather ? "sunny" : "chill",
  };
}
