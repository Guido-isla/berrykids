/**
 * Context Engine — determines the "state of the world" for Berry Kids.
 * Combines weather, calendar, and season into smart recommendations.
 */

import { getWeather, type WeatherData } from "./weather";
import {
  getHoliday,
  getLongWeekend,
  getSchoolVacation,
  getVacationWeekNumber,
  getSeason,
  type SeasonSuggestion,
} from "@/data/dutch-calendar";

export type SiteContext = {
  weather: WeatherData;
  calendar: {
    todayLabel: string;
    isWeekend: boolean;
    isHoliday: boolean;
    holidayName?: string;
    isSchoolVacation: boolean;
    vacationName?: string;
    vacationWeek?: number;
    isLongWeekend: boolean;
    longWeekendName?: string;
  };
  season: {
    name: string;
    emoji: string;
    suggestions: SeasonSuggestion[];
  };
  hero: {
    label: string; // "Paasweekend · ☀️ Zonnig 18°C"
    sublabel: string; // "Haarlem e.o."
  };
  berryPick: {
    preferIndoor: boolean;
    reason: string; // "Perfect weer voor buiten" or "Lekker binnen bij dit weer"
  };
  ticker: {
    label: string; // "PAASWEEKEND" or "MEIVAKANTIE" or "DIT WEEKEND"
  };
};

export async function getSiteContext(): Promise<SiteContext> {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat

  // --- Weather ---
  const weather = await getWeather();

  // --- Calendar ---
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5; // Fri-Sun
  const holiday = getHoliday(today);
  const longWeekend = getLongWeekend(today);
  const vacation = getSchoolVacation(today);
  const vacationWeek = vacation ? getVacationWeekNumber(today, vacation) : undefined;

  // Determine today's label
  let todayLabel = isWeekend ? "Weekend" : getDutchDayName(dayOfWeek);
  if (longWeekend) todayLabel = longWeekend.name;
  else if (holiday) todayLabel = holiday.name;
  else if (vacation) todayLabel = `${vacation.name}`;

  // --- Season ---
  const season = getSeason(today);

  // --- Hero label ---
  let heroLabel = todayLabel;
  const weatherStr = `${weather.current.icon} ${weather.current.description} ${weather.current.temp}°C`;
  heroLabel = `${todayLabel} · ${weatherStr}`;

  if (vacation && vacationWeek) {
    heroLabel = `${vacation.name} · Week ${vacationWeek} · ${weatherStr}`;
  }

  // --- Berry's Pick preference ---
  let preferIndoor = false;
  let pickReason = "";

  if (weather.isRainy) {
    preferIndoor = true;
    pickReason = "Lekker binnen bij dit weer";
  } else if (weather.isGoodWeather) {
    preferIndoor = false;
    pickReason = "Perfect weer om eropuit te gaan";
  } else if (weather.current.temp < 10) {
    preferIndoor = true;
    pickReason = "Koud buiten — beter binnen";
  } else {
    preferIndoor = false;
    pickReason = "Lekker weer om iets te ondernemen";
  }

  // Override for special occasions
  if (holiday?.name.includes("Paas")) {
    pickReason = weather.isGoodWeather
      ? "Fijne Pasen! Heerlijk weer om eropuit te gaan"
      : "Fijne Pasen! Genoeg te doen binnen en buiten";
  }
  if (holiday?.name === "Koningsdag") {
    pickReason = "Fijne Koningsdag! Overal kindervrijmarkten";
    preferIndoor = false; // Koningsdag is always outside
  }

  // --- Ticker label with emojis ---
  let tickerLabel = "DIT WEEKEND";
  if (longWeekend) {
    const lwName = longWeekend.name.toUpperCase();
    if (lwName.includes("PAAS")) tickerLabel = `🥚 ${lwName}`;
    else if (lwName.includes("KONING")) tickerLabel = `🧡 ${lwName}`;
    else if (lwName.includes("KERST")) tickerLabel = `🎄 ${lwName}`;
    else if (lwName.includes("PINKSTER")) tickerLabel = `🌿 ${lwName}`;
    else tickerLabel = lwName;
  } else if (vacation) {
    tickerLabel = vacation.name.toUpperCase();
  } else if (holiday) {
    const hName = holiday.name.toUpperCase();
    if (hName.includes("PAAS")) tickerLabel = `🥚 ${hName}`;
    else if (hName.includes("KONING")) tickerLabel = `🧡 ${hName}`;
    else if (hName.includes("KERST")) tickerLabel = `🎄 ${hName}`;
    else if (hName.includes("SINTERKLAAS")) tickerLabel = `🎁 ${hName}`;
    else tickerLabel = hName;
  }

  return {
    weather,
    calendar: {
      todayLabel,
      isWeekend,
      isHoliday: !!holiday,
      holidayName: holiday?.name,
      isSchoolVacation: !!vacation,
      vacationName: vacation?.name,
      vacationWeek,
      isLongWeekend: !!longWeekend,
      longWeekendName: longWeekend?.name,
    },
    season: {
      name: season.name,
      emoji: season.emoji,
      suggestions: season.suggestions,
    },
    hero: {
      label: heroLabel,
      sublabel: "Haarlem e.o.",
    },
    berryPick: {
      preferIndoor,
      reason: pickReason,
    },
    ticker: {
      label: tickerLabel,
    },
  };
}

function getDutchDayName(day: number): string {
  const names = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  return names[day];
}
