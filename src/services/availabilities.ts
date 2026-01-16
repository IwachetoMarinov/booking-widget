import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { AvailabilityInterface, SlotAvailability } from "@/src/app/types";

dayjs.extend(isSameOrBefore);

export const caclulateSlotAvailabilities = (
  availabilities: AvailabilityInterface[],
  duration: number = 90
): SlotAvailability[] => {
  try {
    if (!availabilities?.length) return [];

    const mappedAvailabilities = availabilities.map((a) => {
      return {
        staffId: a.Staff?.Id,
        start: a.StartDateTime,
        end: a.EndDateTime,
      };
    });

    console.log("mappedAvailabilities:", mappedAvailabilities);

    const seenHours = new Set<string>();
    const slots: SlotAvailability[] = [];

    for (const a of availabilities) {
      const start = dayjs(a.StartDateTime);
      const end = dayjs(a.EndDateTime);

      if (!start.isValid() || !end.isValid() || !start.isBefore(end)) continue;

      let cursor = start.clone();

      while (cursor.clone().add(duration, "minute").isSameOrBefore(end)) {
        const slotStart = cursor.clone();
        const slotEnd = cursor.clone().add(duration, "minute");

        const hourKey = slotStart.format("YYYY-MM-DDTHH:mm"); // safer than HH:mm only
        if (!seenHours.has(hourKey)) {
          seenHours.add(hourKey);
          slots.push({
            staffId: a.Staff?.Id,
            duration: {
              start: slotStart.format("YYYY-MM-DDTHH:mm:ss"),
              end: slotEnd.format("YYYY-MM-DDTHH:mm:ss"),
            },
          });
        }

        cursor = cursor.add(duration, "minute");
      }
    }

    slots.sort(
      (x, y) =>
        dayjs(x.duration.start).valueOf() - dayjs(y.duration.start).valueOf()
    );

    return slots;
  } catch (e) {
    console.log("Error in caclulateSlotAvailabilities:", e);
    return [];
  }
};
