import { AvailabilityInterface, CustomerFormValues } from "@/src/app/types";
import { getMindbodyClient } from "@/src/services/auth";
import { caclulateSlotAvailabilities } from "@/src/services/availabilities";

/**
 * date: "YYYY-MM-DD" (recommended) or any ISO date string
 * NOTE: you MUST set MINDBODY_SESSION_TYPE_ID (or pass it in) for this to return slots.
 */
export const getAvailability = async (
  date: string | null | undefined,
  sessionId: number,
  defaultTime: number = 90,
  siteId: number
): Promise<string[] | null> => {
  try {
    if (!date || !sessionId || !siteId) return null;

    const client = await getMindbodyClient(siteId);

    client.interceptors.request.use((config) => {
      console.log("Mindbody request SiteId:", config.headers?.SiteId);
      return config;
    });

    const start = new Date(`${date}T00:00:00.000Z`).toISOString();
    const end = new Date(`${date}T23:59:59.999Z`).toISOString();

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

export const findCustomerByEmail = async (email: string, siteId: number) => {
  try {
    const client = await getMindbodyClient(siteId);

    const res = await client.get("/client/clients", {
      params: {
        "request.searchText": email,
        "request.includeInactive": true,
        "request.limit": 10,
        "request.offset": 0,
      },
    });

    const clients = res.data?.Clients ?? [];

    const normalizedEmail = email.trim().toLowerCase();

    const exactMatches = clients.filter(
      (c: any) =>
        typeof c.Email === "string" &&
        c.Email.trim().toLowerCase() === normalizedEmail
    );

    return exactMatches.length > 0 ? exactMatches[0] : null;
  } catch {
    return null;
  }
};

export const createCustomer = async (data: CustomerFormValues) => {
  try {
    if (!data.siteId) return null;
    const client = await getMindbodyClient(data?.siteId || 0);

    const payload = {
      FirstName: data.firstName.trim(),
      LastName: data.lastName.trim(),
      Email: data.email.trim(),
      MobilePhone: data.phone?.trim() || undefined,
    };

    const res = await client.post("/client/addclient", payload);

    return res?.data ?? null;
  } catch (error) {
    console.log(
      "createCustomer error:",
      (error as any)?.response?.data || error
    );
    return null;
  }
};
