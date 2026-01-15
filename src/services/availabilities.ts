import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { AvailabilityInterface } from "@/src/app/types";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const caclulateSlotAvailabilities = (
  availabilities: AvailabilityInterface[],
  duration: number = 90
) => {
  try {
    if (!availabilities?.length) return [];

    const slots = new Set<string>();

    for (const a of availabilities) {
      const start = dayjs.utc(a.StartDateTime);

      // IMPORTANT: use EndDateTime if you want to allow 18:30 in your example
      const end = dayjs.utc(a.EndDateTime);

      let cursor = start.clone();

      while (cursor.clone().add(duration, "minute").isSameOrBefore(end)) {
        slots.add(cursor.format("HH:mm"));
        cursor = cursor.add(duration, "minute");
      }
    }

    return Array.from(slots).sort();
  } catch (error) {
    console.log("Error in caclulateSlotAvailabilities:", error);
    return [];
  }
};
