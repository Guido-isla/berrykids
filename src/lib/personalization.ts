/** Family profile stored in localStorage for instant on-site personalization */

export type KidProfile = {
  age: number;
  interests: string[];
};

export type FamilyProfile = {
  kids: KidProfile[];
  area: string;
};

const STORAGE_KEY = "berry-family";

export function getProfile(): FamilyProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: FamilyProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("berry-profile-changed"));
}

/** Interest → activity subcategories mapping */
export const INTEREST_MAP: Record<string, string[]> = {
  sport: ["Padel", "Surfen", "Suppen", "Zwemmen", "Buitenzwemmen", "Subtropisch Zwembad", "Boulderen", "Klimmen", "Klimpark", "Vechtsport", "Trampolinepark", "Bowling"],
  creatief: ["Workshop", "Museum", "Bibliotheek"],
  ontdekken: ["Museum", "Rondvaart", "Bezienswaardigheid", "Dierentuin", "Escape Room", "Landgoed"],
  dieren: ["Kinderboerderij", "Boerderij", "Hertenkamp", "Dierentuin"],
  water: ["Zwemmen", "Buitenzwemmen", "Subtropisch Zwembad", "Surfen", "Suppen", "Strand"],
  voorstellingen: ["Theater", "Bioscoop", "Bioscoop & Theater", "Concertzaal"],
};

export const INTEREST_OPTIONS: { id: string; emoji: string; label: string }[] = [
  { id: "sport", emoji: "⚽", label: "Sport & actief" },
  { id: "creatief", emoji: "🎨", label: "Creatief" },
  { id: "ontdekken", emoji: "🔬", label: "Ontdekken" },
  { id: "dieren", emoji: "🐴", label: "Dieren" },
  { id: "water", emoji: "🏊", label: "Water" },
  { id: "voorstellingen", emoji: "🎭", label: "Voorstellingen" },
];

export const AREA_OPTIONS = [
  "Haarlem centrum",
  "Haarlem Noord",
  "Haarlem Schalkwijk",
  "Heemstede",
  "Bloemendaal",
  "Overveen",
  "Zandvoort",
  "Bennebroek",
  "Aerdenhout",
];

/** Check if a subcategory matches any of the given interests */
export function matchesInterest(subcategory: string, interests: string[]): boolean {
  for (const interest of interests) {
    const subs = INTEREST_MAP[interest];
    if (subs?.some((s) => subcategory.includes(s) || s.includes(subcategory))) return true;
  }
  return false;
}

/** Check if an activity's age range fits a kid */
export function fitsAge(ageMin: number | undefined, ageMax: number | undefined, kidAge: number): boolean {
  if (ageMin === undefined && ageMax === undefined) return true; // "Alle leeftijden"
  if (ageMin !== undefined && kidAge < ageMin) return false;
  if (ageMax !== undefined && kidAge > ageMax) return false;
  return true;
}
