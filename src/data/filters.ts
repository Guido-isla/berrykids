import type { Event } from "./events";
import { getDateRange, isInDateRange, type WhenFilter } from "@/lib/dates";

export type Filters = {
  when: WhenFilter;
  cost: "all" | "free" | "paid";
  setting: "all" | "indoor" | "outdoor";
  age: "all" | "0-3" | "4-8" | "8+";
};

export const DEFAULT_FILTERS: Filters = {
  when: "weekend",
  cost: "all",
  setting: "all",
  age: "all",
};

export function filterEvents(events: Event[], filters: Filters): Event[] {
  const dateRange = getDateRange(filters.when);

  return events.filter((event) => {
    if (!isInDateRange(event.date, dateRange)) return false;

    if (filters.cost === "free" && !event.free) return false;
    if (filters.cost === "paid" && event.free) return false;

    if (filters.setting === "indoor" && !event.indoor) return false;
    if (filters.setting === "outdoor" && event.indoor) return false;

    if (filters.age !== "all") {
      const [minStr, maxStr] = filters.age === "8+"
        ? ["8", "99"]
        : filters.age.split("-");
      const filterMin = parseInt(minStr);
      const filterMax = parseInt(maxStr);

      if (event.ageMin !== undefined && event.ageMax !== undefined) {
        // Event has an age range — check for overlap
        if (event.ageMax < filterMin || event.ageMin > filterMax) return false;
      }
      // If event has no age range (all ages), always show it
    }

    return true;
  });
}
