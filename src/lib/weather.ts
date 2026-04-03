/**
 * Weather data from Open-Meteo.com
 * Free, no API key needed, unlimited calls.
 * Haarlem coordinates: 52.38°N, 4.64°E
 */

const HAARLEM_LAT = 52.38;
const HAARLEM_LNG = 4.64;

// WMO Weather interpretation codes → Dutch descriptions
const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Helder", icon: "☀️" },
  1: { description: "Overwegend helder", icon: "🌤️" },
  2: { description: "Half bewolkt", icon: "⛅" },
  3: { description: "Bewolkt", icon: "☁️" },
  45: { description: "Mistig", icon: "🌫️" },
  48: { description: "Mistig", icon: "🌫️" },
  51: { description: "Lichte motregen", icon: "🌦️" },
  53: { description: "Motregen", icon: "🌧️" },
  55: { description: "Motregen", icon: "🌧️" },
  61: { description: "Lichte regen", icon: "🌦️" },
  63: { description: "Regen", icon: "🌧️" },
  65: { description: "Hevige regen", icon: "🌧️" },
  71: { description: "Lichte sneeuw", icon: "🌨️" },
  73: { description: "Sneeuw", icon: "❄️" },
  75: { description: "Hevige sneeuw", icon: "❄️" },
  80: { description: "Buien", icon: "🌦️" },
  81: { description: "Regenbuien", icon: "🌧️" },
  82: { description: "Hevige buien", icon: "⛈️" },
  95: { description: "Onweer", icon: "⛈️" },
};

function getWeatherInfo(code: number) {
  return WEATHER_CODES[code] || { description: "Onbekend", icon: "🌡️" };
}

export type WeatherData = {
  current: {
    temp: number;
    rain: number;
    weatherCode: number;
    description: string;
    icon: string;
  };
  forecast: {
    date: string;
    tempMax: number;
    rainSum: number;
    weatherCode: number;
    description: string;
    icon: string;
    isRainy: boolean;
  }[];
  isGoodWeather: boolean;
  isRainy: boolean;
  fetchedAt: string;
};

let weatherCache: WeatherData | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getWeather(): Promise<WeatherData> {
  // Return cache if fresh
  if (weatherCache && Date.now() - cacheTime < CACHE_TTL) {
    return weatherCache;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${HAARLEM_LAT}&longitude=${HAARLEM_LNG}&current=temperature_2m,rain,weather_code&daily=temperature_2m_max,rain_sum,weather_code&forecast_days=5&timezone=Europe/Amsterdam`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Next.js cache: 1 hour
    });

    if (!res.ok) throw new Error(`Weather API: ${res.status}`);

    const data = await res.json();

    const currentInfo = getWeatherInfo(data.current.weather_code);

    const forecast = data.daily.time.map((date: string, i: number) => {
      const info = getWeatherInfo(data.daily.weather_code[i]);
      return {
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        rainSum: data.daily.rain_sum[i],
        weatherCode: data.daily.weather_code[i],
        description: info.description,
        icon: info.icon,
        isRainy: data.daily.rain_sum[i] > 1,
      };
    });

    const currentTemp = Math.round(data.current.temperature_2m);
    const isRainy = data.current.rain > 0 || data.current.weather_code >= 51;
    const isGoodWeather = currentTemp >= 15 && !isRainy;

    weatherCache = {
      current: {
        temp: currentTemp,
        rain: data.current.rain,
        weatherCode: data.current.weather_code,
        description: currentInfo.description,
        icon: currentInfo.icon,
      },
      forecast,
      isGoodWeather,
      isRainy,
      fetchedAt: new Date().toISOString(),
    };

    cacheTime = Date.now();
    return weatherCache;
  } catch (err) {
    console.error("Weather fetch failed:", err);

    // Return fallback data
    return {
      current: { temp: 14, rain: 0, weatherCode: 2, description: "Half bewolkt", icon: "⛅" },
      forecast: [],
      isGoodWeather: false,
      isRainy: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
