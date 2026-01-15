import { AvailabilityInterface } from "@/src/app/types";
import { getMindbodyClient } from "@/src/services/auth";
import { caclulateSlotAvailabilities } from "@/src/services/availabilities";

/**
 * date: "YYYY-MM-DD" (recommended) or any ISO date string
 * NOTE: you MUST set MINDBODY_SESSION_TYPE_ID (or pass it in) for this to return slots.
 */
export const getAvailability = async (
  date: string | null | undefined,
  sessionId: number,
  defaultTime: number = 90
): Promise<string[] | null> => {
  try {
    if (!date || !sessionId) return null;

    const client = await getMindbodyClient();

    const start = new Date(`${date}T00:00:00.000Z`).toISOString();
    const end = new Date(`${date}T23:59:59.999Z`).toISOString();

    console.log("Request params", start, end, sessionId);

    const res = await client.get("/appointment/bookableitems", {
      params: {
        "request.sessionTypeIds": sessionId,
        "request.startDate": start,
        "request.endDate": end,
      },
    });

    const availabilities: AvailabilityInterface[] =
      res.data?.Availabilities ?? [];

    if (availabilities.length === 0) return null;

    const slots = caclulateSlotAvailabilities(availabilities, defaultTime);

    return slots;
  } catch (error) {
    console.log("getAvailability error:", error);
    return null;
  }
};

export const getSessionTypes = async () => {
  try {
    const client = await getMindbodyClient();

    const res = await client.get("/site/sessiontypes");

    return res.data ?? null;
  } catch (error) {
    console.log("getSessionTypes error:", error);
    return null;
  }
};
